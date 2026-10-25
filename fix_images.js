const fs = require('fs');

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

const files = [
  'fieldsync-frontend/login.html',
  'fieldsync-frontend/public/login.html',
  'fieldsync-frontend/dist/login.html',
  'login.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf-8');
  let idx = 0;
  html = html.replace(/<img src="images\/[^"]*"/g, () => {
    const slideName = slides[idx % slides.length];
    idx++;
    return `<img src="images/${slideName}.svg"`;
  });
  fs.writeFileSync(f, html, 'utf-8');
  console.log('Fixed', f, 'replaced', idx, 'images');
});
