const fs = require('fs');
const svg = fs.readFileSync('Document.svg', 'utf8');
const match = svg.match(/base64,([^"]+)/);
if (match) {
  fs.writeFileSync('logo.png', Buffer.from(match[1], 'base64'));
}
