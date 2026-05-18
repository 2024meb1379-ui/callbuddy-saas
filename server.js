require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

const PLANS = {
  starter: { name: "Starter", price: 149, amountPaise: 1490000 },
  pro: { name: "Pro", price: 249, amountPaise: 2490000 },
  agency: { name: "Agency", price: 499, amountPaise: 4990000 },
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ordersDir = path.join(__dirname, "data", "orders");
if (!fs.existsSync(ordersDir)) {
  fs.mkdirSync(ordersDir, { recursive: true });
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/checkout", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

app.get("/success", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { plan, fullName, businessName, email, phone } = req.body || {};

    if (!fullName || !businessName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
        error: "All fields are required.",
      });
    }

    const planKey = String(plan || "pro").toLowerCase();
    const selectedPlan = PLANS[planKey];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected.",
        error: "Invalid plan selected.",
      });
    }

    const orderRecord = {
      id: `order_${Date.now()}`,
      plan: planKey,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      fullName,
      businessName,
      email,
      phone,
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(ordersDir, `${orderRecord.id}.json`),
      JSON.stringify(orderRecord, null, 2)
    );

    return res.json({
      success: true,
      orderId: orderRecord.id,
      amount: selectedPlan.price,
      plan: planKey,
    });
  } catch (err) {
    console.error("create-order error:", err);
    const msg = err.message || "Failed to create order. Please try again.";
    return res.status(500).json({
      success: false,
      message: msg,
      error: msg,
    });
  }
});

app.listen(PORT, () => {
  console.log(`CallBuddy server running at http://localhost:${PORT}`);
});
