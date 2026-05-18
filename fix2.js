const fs = require('fs');
let h = fs.readFileSync('public/checkout.html', 'utf8');
h = h.replace(/fetch\('\/api\/create-order'/g, "fetch('https://callbuddy-saas.onrender.com/api/create-order'");
fs.writeFileSync('public/checkout.html', h);
console.log('DONE');
