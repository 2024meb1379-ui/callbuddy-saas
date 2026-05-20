const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

const compareHTML = `
<section id="compare" style="background:#0f0f1a;padding:6rem 5%">
  <div style="max-width:1000px;margin:0 auto">
    <p style="text-align:center;color:#7F77DD;font-size:0.85rem;text-transform:uppercase;letter-spacing:3px;margin-bottom:1rem">Comparison</p>
    <h2 style="text-align:center;font-family:'Outfit',sans-serif;font-size:clamp(1.8rem,3vw,2.8rem);font-weight:800;margin-bottom:3rem">Why pay more for less?</h2>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
        <thead>
          <tr>
            <th style="padding:1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.08);color:#666"></th>
            <th style="padding:1rem;text-align:center;border-bottom:1px solid #7F77DD;color:#7F77DD;background:rgba(127,119,221,0.1);border-radius:8px 8px 0 0">CallBuddy AI</th>
            <th style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);color:#666">Human Receptionist</th>
            <th style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);color:#666">Basic AI</th>
            <th style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);color:#666">Voicemail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Price/month</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#7F77DD;font-weight:700;background:rgba(127,119,221,0.05)">$149</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">$3,200</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">$200-300</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">$0</td>
          </tr>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Answers 24/7</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80;background:rgba(127,119,221,0.05)">✓</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#ff4444">✗</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80">✓</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#ff4444">✗</td>
          </tr>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Answer speed</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#7F77DD;font-weight:700;background:rgba(127,119,221,0.05)">2 sec</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">3+ rings</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">8-10 sec</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#ff4444">Never</td>
          </tr>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Books appointments</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80;background:rgba(127,119,221,0.05)">✓</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80">✓</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">Sometimes</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#ff4444">✗</td>
          </tr>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Sick days</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80;font-weight:700;background:rgba(127,119,221,0.05)">0</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#ff4444">Yes</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#4ade80">0</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">N/A</td>
          </tr>
          <tr>
            <td style="padding:1rem;border-bottom:1px solid rgba(255,255,255,0.04);color:#fff">Setup time</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#7F77DD;font-weight:700;background:rgba(127,119,221,0.05)">10 min</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">Months</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">Weeks</td>
            <td style="padding:1rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);color:#666">Minutes</td>
          </tr>
          <tr>
            <td style="padding:1rem;color:#fff">Cancel anytime</td>
            <td style="padding:1rem;text-align:center;color:#4ade80;font-weight:700;background:rgba(127,119,221,0.05)">✓</td>
            <td style="padding:1rem;text-align:center;color:#ff4444">✗</td>
            <td style="padding:1rem;text-align:center;color:#ff4444">✗</td>
            <td style="padding:1rem;text-align:center;color:#4ade80">✓</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
`;

// Insert before pricing section
h = h.replace('<section id="pricing"', compareHTML + '\n<section id="pricing"');

// Fix navbar links to match actual section IDs
h = h.replace('href="#compare"', 'href="#compare"');
h = h.replace('href="#features"', 'href="#features"');
h = h.replace('href="#pricing"', 'href="#pricing"');

fs.writeFileSync('public/index.html', h);
console.log('DONE - comparison table added');
