const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');

// Find all section ids
const sections = h.match(/id="[^"]+"/g);
console.log('All section IDs:', sections);

// Check for pricing keywords
console.log('\nHas $149:', h.includes('149'));
console.log('Has $249:', h.includes('249'));
console.log('Has $499:', h.includes('499'));
console.log('Has pricing:', h.includes('pricing'));
console.log('Has Starter:', h.includes('Starter'));
console.log('Has Pro:', h.includes('Pro'));
console.log('\nFile size:', h.length, 'chars');
