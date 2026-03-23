const fs = require('fs');
const files = ['research.md', 'src/App.css', 'data/sample-products.json'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
