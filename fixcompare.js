const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

// Find what compare-related IDs exist
const ids = h.match(/id="[^"]*"/g);
const compareIds = ids ? ids.filter(id => id.toLowerCase().includes('compar')) : [];
console.log('Compare IDs found:', compareIds);

// Fix navbar compare link to match actual section ID
if (compareIds.length > 0) {
  const actualId = compareIds[0].replace('id="', '').replace('"', '');
  console.log('Actual ID:', actualId);
  h = h.replace(/href="#compare"/g, `href="#${actualId}"`);
  fs.writeFileSync('public/index.html', h);
  console.log('FIXED - compare link now points to:', actualId);
} else {
  // No compare section exists - add id="compare" to comparison section
  h = h.replace(/<section([^>]*?)>\s*(<[^>]*?>)?\s*([^<]*?[Cc]ompar)/g, '<section id="compare"$1>$2$3');
  fs.writeFileSync('public/index.html', h);
  console.log('Added compare ID to section');
}
