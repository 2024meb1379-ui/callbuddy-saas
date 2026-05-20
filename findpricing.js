const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');

// Find pricing section
const idx = h.indexOf('id="pricing"');
if (idx === -1) {
  console.log('No id="pricing" found');
  // Try to find any pricing-related buttons
  const btnMatches = h.match(/<a[^>]*>([\s\S]*?)<\/a>/g);
  if (btnMatches) {
    btnMatches.forEach(b => {
      if (b.includes('149') || b.includes('249') || b.includes('499') || b.includes('Start') || b.includes('Choose') || b.includes('Select') || b.includes('Buy')) {
        console.log('Found button:', b.slice(0, 200));
      }
    });
  }
  // Also check buttons
  const btns = h.match(/<button[^>]*>([\s\S]*?)<\/button>/g);
  if (btns) {
    btns.forEach(b => {
      if (b.includes('149') || b.includes('249') || b.includes('499') || b.includes('Start') || b.includes('Choose')) {
        console.log('Found button:', b.slice(0, 200));
      }
    });
  }
} else {
  console.log(h.slice(idx, idx + 3000));
}
