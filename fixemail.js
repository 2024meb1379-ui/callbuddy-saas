const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

// Fix nodemailer transport to ignore SSL
s = s.replace(
  "service: 'gmail',\n        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }",
  "host: 'smtp.gmail.com',\n        port: 587,\n        secure: false,\n        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },\n        tls: { rejectUnauthorized: false }"
);

fs.writeFileSync('server.js', s);

// Verify fix
const updated = fs.readFileSync('server.js', 'utf8');
console.log('Has tls fix:', updated.includes('rejectUnauthorized'));
console.log('DONE');
