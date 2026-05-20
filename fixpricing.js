const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

s = s.replace(
  /amountINR:\s*12400/g,
  'amountINR: 14900'
);
s = s.replace(
  /amountINR:\s*20700/g,
  'amountINR: 24900'
);
s = s.replace(
  /amountINR:\s*41500/g,
  'amountINR: 49900'
);

fs.writeFileSync('server.js', s);
console.log('DONE - pricing fixed');
