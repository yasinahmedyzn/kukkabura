const express = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const router = express.Router();

const SSLCommerzBase = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'; // Use sandbox for test

// Initiate payment
router.post('/init', async (req, res) => {
  const {
    amount,
    tran_id,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    customerPostcode,
    customerCountry,
  } = req.body;

  // Validate required fields
  if (
    !amount ||
    !tran_id ||
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !customerAddress ||
    !customerCity ||
    !customerPostcode ||
    !customerCountry
  ) {
    return res.status(400).json({ error: 'Missing required fields in request body' });
  }

  const data = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASSWORD,
    total_amount: amount,
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${process.env.BASE_URL}/api/payment/success`,
    fail_url: `${process.env.BASE_URL}/api/payment/fail`,
    cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: customerAddress,
    cus_city: customerCity,
    cus_postcode: customerPostcode,
    cus_country: customerCountry,
    cus_phone: customerPhone,
    shipping_method: 'NO',
    product_name: 'Order Payment',
    product_category: 'E-commerce',
    product_profile: 'general',
  };

  try {
    const response = await axios.post(SSLCommerzBase, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });


    if (response.data.status === 'SUCCESS') {
      return res.json({ GatewayPageURL: response.data.GatewayPageURL });
    } else {
      console.error('❌ Payment initiation failed:', response.data);
      return res.status(400).json({
        error: 'Failed to initiate payment',
        data: response.data,
      });
    }
  } catch (err) {
    console.error('💥 SSLCommerz Error:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Payment initiation failed',
      details: err.response?.data || err.message,
    });
  }
});

// Payment success callback
router.post('/success', (req, res) => {
  console.log('✅ Payment Success:', req.body);
  // TODO: Save transaction or update order status in DB
  res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
});

// Payment fail callback
router.post('/fail', (req, res) => {
  console.log('❌ Payment Failed:', req.body);
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
});

// Payment cancel callback
router.post('/cancel', (req, res) => {
  console.log('Payment Cancelled:', req.body);
  // Respond with HTML + JS to redirect the browser
  res.send(`
    <html>
      <head>
        <script>
          window.location.href = "${process.env.FRONTEND_URL}/cart?cancelled=true";
        </script>
      </head>
      <body>
        <p>Redirecting to cart...</p>
      </body>
    </html>
  `);
});

module.exports = router;
