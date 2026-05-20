const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

// Extract each major section
function extractSection(html, startId, endId) {
  const startIdx = html.indexOf(`id="${startId}"`);
  if (startIdx === -1) return { section: '', remaining: html };
  
  // Go back to find the opening <section tag
  const sectionStart = html.lastIndexOf('<section', startIdx);
  if (sectionStart === -1) return { section: '', remaining: html };
  
  // Find the matching closing </section>
  let depth = 0;
  let i = sectionStart;
  while (i < html.length) {
    if (html.slice(i, i+8) === '<section') depth++;
    if (html.slice(i, i+9) === '</section') {
      depth--;
      if (depth === 0) {
        const sectionEnd = i + 9;
        const section = html.slice(sectionStart, sectionEnd);
        const remaining = html.slice(0, sectionStart) + html.slice(sectionEnd);
        return { section, remaining };
      }
    }
    i++;
  }
  return { section: '', remaining: html };
}

// Extract FAQ section (contains faq-icon-1)
const faqResult = extractSection(h, 'faq-icon-1', '');
const faqSection = faqResult.section;
h = faqResult.remaining;

// Extract compare section
const compareResult = extractSection(h, 'compare', '');
const compareSection = compareResult.section;
h = compareResult.remaining;

// Extract pricing section  
const pricingResult = extractSection(h, 'pricing', '');
const pricingSection = pricingResult.section;
h = pricingResult.remaining;

console.log('FAQ found:', faqSection.length > 0);
console.log('Compare found:', compareSection.length > 0);
console.log('Pricing found:', pricingSection.length > 0);

// Now insert in correct order before footer
// Order: Compare → Pricing → FAQ → Final CTA → Footer
if (h.includes('<footer')) {
  h = h.replace('<footer', compareSection + '\n' + pricingSection + '\n' + faqSection + '\n<footer');
  console.log('Reordered: Compare → Pricing → FAQ → Footer');
} else {
  h = h.replace('</body>', compareSection + '\n' + pricingSection + '\n' + faqSection + '\n</body>');
  console.log('Reordered before body end');
}

fs.writeFileSync('public/index.html', h);
console.log('DONE');
