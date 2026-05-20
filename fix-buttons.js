const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

// Fix all Get Started Today buttons to link to checkout
h = h.replace(
  /href="#"([^>]*?)>Get Started Today/g,
  'href="/checkout.html?plan=pro"$1>Get Started Today'
);

// Fix starter button
h = h.replace(
  /href="#"([^>]*?)>Get Started Today([^<]*?Starter|[^<]*?starter)/g,
  'href="/checkout.html?plan=starter"$1>Get Started Today$2'
);

// Fix buttons that use onclick or no href
h = h.replace(
  /(<button[^>]*?)>Get Started Today/g,
  '$1 onclick="window.location.href=\'/checkout.html?plan=pro\'">Get Started Today'
);

// Make sure nav Get Started button works
h = h.replace(
  /(<a[^>]*?nav[^>]*?)>Get Started/g,
  '<a href="/checkout.html?plan=pro">Get Started'
);

fs.writeFileSync('public/index.html', h);

// Count checkout links after fix
const count = (h.match(/checkout/g) || []).length;
console.log('DONE - checkout links:', count);
