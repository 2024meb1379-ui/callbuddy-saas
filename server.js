require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

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
          key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Sqiz4oODb5syJ9',
          key_secret: process.env.RAZORPAY_KEY_SECRET || '4ETe4I7xWvU31YiN0AZePcly'
        });
        const rzpOrder = await razorpay.orders.create({
          amount: selectedPlan.amountINR * 100, // paise
          currency: 'INR',
          receipt: `order_${Date.now()}`
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Razorpay order error FULL:', JSON.stringify(rzpErr), rzpErr.message, rzpErr.statusCode, rzpErr.error);
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
    if (process.env.RESEND_API_KEY) {
      try {
        const https = require('https');
        const emailData = JSON.stringify({
          from: 'CallBuddy AI <onboarding@resend.dev>',
          to: 'sagargoyat2007@gmail.com',
          subject: `💰 NEW PAYMENT: ${fullName} - ${selectedPlan.name}`,
          html: `<div style="font-family:sans-serif;padding:20px;background:#0a0a0f;color:#fff;">
            <h2 style="color:#7F77DD;">💰 New CallBuddy Payment!</h2>
            <p><b>Name:</b> ${fullName}</p>
            <p><b>Business:</b> ${businessName}</p>
            <p><b>Plan:</b> ${selectedPlan.name} - ₹${(selectedPlan.price/100).toLocaleString()}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
            <p><b>Time:</b> ${new Date().toLocaleString('en-IN')}</p>
          </div>`
        });
        await new Promise((resolve, reject) => {
          const req = https.request({
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(emailData)
            }
          }, (res) => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => {
              const parsed = JSON.parse(b);
              if (parsed.id) { console.log('Notification email sent:', parsed.id); resolve(); }
              else { console.error('Resend error:', b); resolve(); }
            });
          });
          req.on('error', reject);
          req.write(emailData);
          req.end();
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
