const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

const pricingHTML = `
<section id="pricing" style="background:#080810;padding:6rem 5%">
  <div style="max-width:1100px;margin:0 auto">
    <p style="text-align:center;color:#7F77DD;font-size:0.85rem;text-transform:uppercase;letter-spacing:3px;margin-bottom:1rem">Pricing</p>
    <h2 style="text-align:center;font-family:'Outfit',sans-serif;font-size:clamp(1.8rem,3vw,2.8rem);font-weight:800;margin-bottom:0.5rem">Simple, transparent pricing</h2>
    <p style="text-align:center;color:#666;margin-bottom:3rem">A human receptionist costs $3,200/month. <strong style="color:#fff">CallBuddy starts at $149.</strong></p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;align-items:start">
      
      <!-- Starter -->
      <div style="background:#13131f;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2rem">
        <p style="color:#666;font-size:0.9rem;margin-bottom:0.5rem">Starter</p>
        <p style="font-family:'Outfit',sans-serif;font-size:0.85rem;color:#666;margin-bottom:1rem">For solo operators</p>
        <div style="margin-bottom:1.5rem">
          <span style="font-family:'Outfit',sans-serif;font-size:3rem;font-weight:900">$149</span>
          <span style="color:#666;font-size:0.9rem">/mo</span>
        </div>
        <ul style="list-style:none;margin-bottom:2rem">
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;1 location</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;200 calls/month</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;24/7 answering</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Calendar sync</li>
          <li style="padding:0.5rem 0;color:#888;font-size:0.9rem">✓ &nbsp;SMS reminders</li>
        </ul>
        <a href="/checkout.html?plan=starter" style="display:block;text-align:center;background:transparent;border:1px solid #7F77DD;color:#7F77DD;padding:0.9rem;border-radius:10px;font-weight:600;text-decoration:none;transition:all 0.2s" onmouseover="this.style.background='#7F77DD';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='#7F77DD'">Get Started Today</a>
      </div>

      <!-- Pro (highlighted) -->
      <div style="background:#13131f;border:1px solid #7F77DD;border-radius:20px;padding:2rem;transform:translateY(-12px);box-shadow:0 20px 60px rgba(127,119,221,0.2);position:relative">
        <div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:#7F77DD;color:#fff;padding:0.3rem 1.2rem;border-radius:50px;font-size:0.75rem;font-weight:700;white-space:nowrap">MOST POPULAR</div>
        <p style="color:#7F77DD;font-size:0.9rem;margin-bottom:0.5rem">Pro</p>
        <p style="font-family:'Outfit',sans-serif;font-size:0.85rem;color:#666;margin-bottom:1rem">For growing businesses</p>
        <div style="margin-bottom:1.5rem">
          <span style="font-family:'Outfit',sans-serif;font-size:3rem;font-weight:900">$249</span>
          <span style="color:#666;font-size:0.9rem">/mo</span>
        </div>
        <ul style="list-style:none;margin-bottom:2rem">
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;3 locations</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;500 calls/month</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Everything in Starter</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;CRM integration</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Emergency detection</li>
          <li style="padding:0.5rem 0;color:#888;font-size:0.9rem">✓ &nbsp;Priority support</li>
        </ul>
        <a href="/checkout.html?plan=pro" style="display:block;text-align:center;background:#7F77DD;color:#fff;padding:0.9rem;border-radius:10px;font-weight:600;text-decoration:none">Get Started Today</a>
      </div>

      <!-- Agency -->
      <div style="background:#13131f;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:2rem">
        <p style="color:#666;font-size:0.9rem;margin-bottom:0.5rem">Agency</p>
        <p style="font-family:'Outfit',sans-serif;font-size:0.85rem;color:#666;margin-bottom:1rem">For multi-location businesses</p>
        <div style="margin-bottom:1.5rem">
          <span style="font-family:'Outfit',sans-serif;font-size:3rem;font-weight:900">$499</span>
          <span style="color:#666;font-size:0.9rem">/mo</span>
        </div>
        <ul style="list-style:none;margin-bottom:2rem">
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Unlimited locations</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Unlimited calls</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;White label</li>
          <li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);color:#888;font-size:0.9rem">✓ &nbsp;Custom voice</li>
          <li style="padding:0.5rem 0;color:#888;font-size:0.9rem">✓ &nbsp;API access</li>
        </ul>
        <a href="https://wa.me/917206170244" target="_blank" style="display:block;text-align:center;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;padding:0.9rem;border-radius:10px;font-weight:600;text-decoration:none">Contact Us</a>
      </div>
    </div>
    <p style="text-align:center;color:#555;font-size:0.85rem;margin-top:2rem">No contracts. Cancel anytime. Setup in 10 minutes.</p>
  </div>
</section>
`;

// Insert pricing section before the footer or before the final CTA
if (h.includes('<footer')) {
  h = h.replace('<footer', pricingHTML + '\n<footer');
  console.log('Inserted before footer');
} else if (h.includes('id="contact"')) {
  h = h.replace('id="contact"', pricingHTML + '\n<section id="contact"');
  console.log('Inserted before contact');
} else {
  // Insert before closing body
  h = h.replace('</body>', pricingHTML + '\n</body>');
  console.log('Inserted before </body>');
}

fs.writeFileSync('public/index.html', h);
console.log('DONE - pricing section added');
