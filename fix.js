const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'checkout.html');
let h = fs.readFileSync(filePath, 'utf8');

// Add error div if missing
if (!h.includes('id="error-msg"')) {
  h = h.replace('</form>', '<div id="error-msg" style="color:#ff4444;margin-bottom:10px;font-size:14px;text-align:center;"></div>\n</form>');
}

// New clean submit handler
const newScript = `
<script>
(function() {
  const form = document.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    const errDiv = document.getElementById('error-msg');
    if (errDiv) errDiv.textContent = '';
    const origText = btn ? btn.textContent : 'Pay Now';
    if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }
    const params = new URLSearchParams(window.location.search);
    const data = {
      plan: params.get('plan') || 'pro',
      fullName: (document.getElementById('fullName') || {}).value || '',
      businessName: (document.getElementById('businessName') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      phone: (document.getElementById('phone') || {}).value || ''
    };
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok) {
        sessionStorage.setItem('customerEmail', data.email);
        window.location.href = '/success.html';
      } else {
        if (errDiv) errDiv.textContent = json.message || 'Error. Try again.';
        if (btn) { btn.disabled = false; btn.textContent = origText; }
      }
    } catch (err) {
      if (errDiv) errDiv.textContent = 'Network error. Try again.';
      if (btn) { btn.disabled = false; btn.textContent = origText; }
    }
  });
})();
</script>
</body>`;

// Replace closing body tag
h = h.replace('</body>', newScript);

fs.writeFileSync(filePath, h);
console.log('DONE - checkout fixed');
