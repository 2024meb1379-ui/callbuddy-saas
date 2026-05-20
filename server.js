require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase
const supabase = createClient(
  'https://kzvwdsccrdxrktklhpxw.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

// Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PLANS = {
  starter: { name: 'Starter', price: '$149', amountINR: 14900 },
  pro:     { name: 'Pro',     price: '$249', amountINR: 24900 },
  agency:  { name: 'Agency',  price: '$499', amountINR: 49900 }
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { plan, fullName, businessName, email, phone } = req.body || {};

    if (!fullName || !businessName || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const planKey = String(plan || 'pro').toLowerCase();
    const selectedPlan = PLANS[planKey];
    if (!selectedPlan) {
      return res.status(400).json({ message: 'Invalid plan.' });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: selectedPlan.amountINR * 100, // paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: { plan: planKey, email, businessName }
    });

    // Save pending order to Supabase
    await supabase.from('orders').insert({
      id: razorpayOrder.id,
      plan: planKey,
      plan_name: selectedPlan.name,
      amount: selectedPlan.amountINR,
      full_name: fullName,
      business_name: businessName,
      email,
      phone,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: selectedPlan.amountINR * 100,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone
    });

  } catch (err) {
    console.error('create-order error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to create order.' });
  }
});

// Verify payment after Razorpay success
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    // Update order in Supabase
    const { data: order } = await supabase
      .from('orders')
      .update({ status: 'paid', payment_id: razorpay_payment_id })
      .eq('id', razorpay_order_id)
      .select()
      .single();

    // Send WhatsApp notification to you
    if (process.env.CALLMEBOT_APIKEY && order) {
      const msg = encodeURIComponent(
        `New CallBuddy payment!\nName: ${order.full_name}\nBusiness: ${order.business_name}\nPlan: ${order.plan_name}\nAmount: ₹${order.amount}\nEmail: ${order.email}\nPhone: ${order.phone}`
      );
      await axios.get(
        `https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${msg}&apikey=${process.env.CALLMEBOT_APIKEY}`
      ).catch(e => console.log('WhatsApp error:', e.message));
    }

    // Send confirmation email to customer
    if (process.env.GMAIL_USER && order) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
      });
      await transporter.sendMail({
        from: `CallBuddy AI <${process.env.GMAIL_USER}>`,
        to: order.email,
        subject: 'Welcome to CallBuddy AI — You\'re all set!',
        html: `
          <h2>Welcome to CallBuddy AI, ${order.full_name}!</h2>
          <p>Your payment of ₹${order.amount} for the <strong>${order.plan_name}</strong> plan has been confirmed.</p>
          <p>We'll set up your AI receptionist within 24 hours.</p>
          <p>Questions? WhatsApp us at +91 7206170244</p>
          <br><p>Team CallBuddy AI</p>
        `
      }).catch(e => console.log('Email error:', e.message));
    }

    res.json({ success: true });

  } catch (err) {
    console.error('verify-payment error:', err.message);
    res.status(500).json({ message: 'Verification failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`CallBuddy server running at http://localhost:${PORT}`);
});
