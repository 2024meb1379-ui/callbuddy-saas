const fs = require('fs');
let h = fs.readFileSync('public/checkout.html', 'utf8');

// Fix the button text - replace HTML entity with actual rupee or unicode
h = h.replace(/Pay Now - &#8377;/g, 'Pay Now — ₹');
h = h.replace(/&#8377;/g, '₹');

fs.writeFileSync('public/checkout.html', h);
console.log('DONE - rupee fixed');
console.log('Verify:', h.includes('&#8377;') ? 'STILL HAS ENTITY' : 'ALL FIXED');
