const fs = require('fs');
const path = require('path');

const slides = [
  'fieldsync-app-connect',
  'fieldsync-map-pins',
  'fieldsync-match-moment',
  'fieldsync-wage-cards',
  'service-painter',
  'service-plumber',
  'service-carpenter',
  'service-electrician',
  'service-mason',
  'service-ac-tech',
  'service-cleaner',
  'service-movers'
];

const dataUris = {};
slides.forEach(name => {
  const svgPath = path.join(__dirname, 'fieldsync-frontend', 'public', 'images', name + '.svg');
  const svg = fs.readFileSync(svgPath, 'utf-8');
  dataUris[name] = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
});

const files = [
  path.join(__dirname, 'fieldsync-frontend', 'login.html'),
  path.join(__dirname, 'fieldsync-frontend', 'public', 'login.html'),
  path.join(__dirname, 'fieldsync-frontend', 'dist', 'login.html'),
  path.join(__dirname, 'login.html')
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf-8');
  let idx = 0;
  // Replace <img src="images/..." or <img src="..."
  html = html.replace(/<img\s+src="[^"]*"\s+alt="([^"]*)"[^>]*\/>/g, (match, altText) => {
    const slideName = slides[idx % slides.length];
    const uri = dataUris[slideName];
    idx++;
    return `<img src="${uri}" data-src="images/${slideName}.jpg" alt="${altText}" />`;
  });
  fs.writeFileSync(f, html, 'utf-8');
  console.log('Embedded data URIs in', f, 'processed', idx, 'images');
});
