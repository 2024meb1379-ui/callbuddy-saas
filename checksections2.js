const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');
const ids = h.match(/id="[^"]+"/g);
console.log('All IDs:', ids);
