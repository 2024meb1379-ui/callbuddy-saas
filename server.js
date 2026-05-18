require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3001;

const PLANS = {
  starter: { name: 'Starter', price: '$149', amountINR: 12400 },
  pro:     { name: 'Pro',     price: '$249', amountINR: 20700 },
  agency:  { name: 'Agency',  price: '$499', amountINR: 41500 }
};

// Ensure orders dir exists
const ordersDir = path.join(__dirname, 'data', 'orders');
if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir, { recursive: true });

// ── CREATE ORDER ──────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { plan, fullName, businessName, email, phone } = req.body || {};

    if (!fullName || !businessName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const planKey = String(plan || 'pro').toLowerCase();
    const selectedPlan = PLANS[planKey];
    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
    }

    let razorpayOrderId = null;

    // Create Razorpay order
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const rzpOrder = await razorpay.orders.create({
          amount: selectedPlan.amountINR * 100, // paise
          currency: 'INR',
          receipt: `order_${Date.now()}`
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Razorpay order error:', rzpErr.message);
        // Continue without razorpay in dev
      }
    }

    // Save pending order
    const orderId = `order_${Date.now()}`;
    const orderRecord = { id: orderId, plan: planKey, planName: selectedPlan.name, amount: selectedPlan.price, fullName, businessName, email, phone, razorpayOrderId, status: 'pending', createdAt: new Date().toISOString() };
    fs.writeFileSync(path.join(ordersDir, `${orderId}.json`), JSON.stringify(orderRecord, null, 2));

    return res.json({ success: true, orderId, razorpayOrderId, plan: planKey });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to create order.' });
  }
});

// ── VERIFY PAYMENT ────────────────────────────────────────────
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, fullName, businessName, email, phone, plan } = req.body;

    // Verify signature
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
      if (expectedSig !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed.' });
      }
    }

    const planKey = String(plan || 'pro').toLowerCase();
    const selectedPlan = PLANS[planKey] || PLANS.pro;

    // Save confirmed order
    const orderId = `confirmed_${Date.now()}`;
    const orderRecord = { id: orderId, plan: planKey, planName: selectedPlan.name, amount: selectedPlan.price, fullName, businessName, email, phone, razorpay_payment_id, status: 'paid', createdAt: new Date().toISOString() };
    fs.writeFileSync(path.join(ordersDir, `${orderId}.json`), JSON.stringify(orderRecord, null, 2));

    // Send WhatsApp notification
    if (process.env.CALLMEBOT_APIKEY) {
      try {
        const msg = encodeURIComponent(`💰 NEW CALLBUDDY PAYMENT!\nName: ${fullName}\nBusiness: ${businessName}\nPlan: ${selectedPlan.name} ${selectedPlan.price}\nEmail: ${email}\nPhone: ${phone}`);
        await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${process.env.CALLMEBOT_PHONE}&text=${msg}&apikey=${process.env.CALLMEBOT_APIKEY}`);
      } catch (e) { console.error('WhatsApp error:', e.message); }
    }

    // Send confirmation email to customer
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
        });
        await transporter.sendMail({
          from: `CallBuddy AI <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Welcome to CallBuddy AI — You\'re all set!',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:40px;border-radius:12px;">
              <h1 style="color:#7F77DD;">Welcome to CallBuddy AI, ${fullName}!</h1>
              <p style="color:#ccc;font-size:16px;">Your payment for the <strong>${selectedPlan.name} plan</strong> has been confirmed.</p>
              <p style="color:#ccc;">We'll set up your AI receptionist Alex within <strong>24 hours</strong>.</p>
              <div style="background:#13131f;padding:20px;border-radius:8px;margin:24px 0;">
                <p style="color:#888;margin:0;">Business: <strong style="color:#fff;">${businessName}</strong></p>
                <p style="color:#888;margin:8px 0 0;">Plan: <strong style="color:#7F77DD;">${selectedPlan.name} ${selectedPlan.price}/mo</strong></p>
              </div>
              <p style="color:#666;font-size:14px;">Questions? WhatsApp us at +91 7206170244</p>
            </div>
          `
        });
      } catch (e) { console.error('Email error:', e.message); }
    }

    return res.json({ success: true, message: 'Payment verified and confirmed.' });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── HEALTH ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.listen(PORT, () => console.log(`CallBuddy server running at http://localhost:${PORT}`));
