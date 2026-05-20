const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

if (s.includes("require('cors')") || s.includes('require("cors")')) {
  console.log('CORS already present - checking placement...');
  // Make sure cors is used before routes
  if (!s.includes('app.use(cors())') && !s.includes("app.use(require('cors')())")) {
    console.log('CORS required but not used as middleware - fixing...');
  } else {
    console.log('CORS is already configured correctly.');
  }
} else {
  // Add cors
  s = s.replace(
    "app.use(express.json())",
    "app.use(require('cors')());\napp.use(express.json());"
  );
  fs.writeFileSync('server.js', s);
  console.log('DONE - CORS added');
}

// Verify
const updated = fs.readFileSync('server.js', 'utf8');
console.log('Has cors:', updated.includes('cors'));
