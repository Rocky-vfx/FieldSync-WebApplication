const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'fieldsync-frontend', 'public', 'images'),
  path.join(__dirname, 'fieldsync-frontend', 'dist', 'images'),
  path.join(__dirname, 'fieldsync-frontend', 'images'),
  path.join(__dirname, 'images')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

const slides = [
  { file: 'fieldsync-app-connect', title: 'Smart FieldSync App', sub: 'Instant connection between customers and nearby verified helpers', icon: '📱', color1: '#071527', color2: '#0e3854', accent: '#f97316' },
  { file: 'fieldsync-map-pins', title: 'Hyperlocal Map Radius', sub: 'Live pins for available painters, plumbers and electricians nearby', icon: '📍', color1: '#041c24', color2: '#0d433e', accent: '#10b981' },
  { file: 'fieldsync-match-moment', title: 'The Perfect Match', sub: 'Homeowner and daily-wage professional agreeing on direct terms', icon: '🤝', color1: '#0d131f', color2: '#1a3250', accent: '#f59e0b' },
  { file: 'fieldsync-wage-cards', title: 'Transparent Wage Cards', sub: 'Compare daily wages and verified ratings upfront before calling', icon: '💳', color1: '#0b1322', color2: '#282566', accent: '#ec4899' },
  { file: 'service-painter', title: 'Master Painters', sub: 'Interior, exterior, texture finishes and waterproof coatings', icon: '🎨', color1: '#121215', color2: '#232326', accent: '#f97316' },
  { file: 'service-plumber', title: 'Emergency Plumbers', sub: 'Pipe leak repairs, bathroom fittings and drainage clearing', icon: '🔧', color1: '#091c33', color2: '#16368f', accent: '#38bdf8' },
  { file: 'service-carpenter', title: 'Skilled Carpenters', sub: 'Furniture repairs, wood cutting, modular fittings and hinges', icon: '🪚', color1: '#1f160a', color2: '#612a0c', accent: '#f59e0b' },
  { file: 'service-electrician', title: 'Certified Electricians', sub: 'Wiring, MCB panels, heavy appliances, short-circuit diagnostics', icon: '⚡', color1: '#0e141f', color2: '#1a2230', accent: '#eab308' },
  { file: 'service-mason', title: 'Expert Masons', sub: 'Bricklaying, tiling, cement plastering, and masonry renovation', icon: '🧱', color1: '#21130d', color2: '#472315', accent: '#ea580c' },
  { file: 'service-ac-tech', title: 'HVAC & AC Technicians', sub: 'Gas recharging, deep jet cleaning, compressor diagnostics', icon: '❄️', color1: '#06263b', color2: '#0369a1', accent: '#38bdf8' },
  { file: 'service-cleaner', title: 'Deep Cleaning Pros', sub: 'Kitchen, bathroom, sofa shampooing, and post-construction cleaning', icon: '✨', color1: '#043d2e', color2: '#035e44', accent: '#34d399' },
  { file: 'service-movers', title: 'Reliable Movers & Loaders', sub: 'Safe lifting, vehicle loading, household shifting with care', icon: '📦', color1: '#17143b', color2: '#352c9e', accent: '#a855f7' }
];

slides.forEach((s, idx) => {
  const safeTitle = escapeXml(s.title);
  const safeSub = escapeXml(s.sub);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg_${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${s.color1}"/>
      <stop offset="60%" stop-color="${s.color2}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="radial_${idx}" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="${s.accent}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${s.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad_${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03"/>
    </linearGradient>
  </defs>

  <!-- Deep Background -->
  <rect width="1200" height="900" fill="url(#bg_${idx})"/>
  
  <!-- Subtle Grid Accent -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="150" x2="1200" y2="150"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="450" x2="1200" y2="450"/>
    <line x1="0" y1="600" x2="1200" y2="600"/>
    <line x1="0" y1="750" x2="1200" y2="750"/>
    <line x1="200" y1="0" x2="200" y2="900"/>
    <line x1="400" y1="0" x2="400" y2="900"/>
    <line x1="600" y1="0" x2="600" y2="900"/>
    <line x1="800" y1="0" x2="800" y2="900"/>
    <line x1="1000" y1="0" x2="1000" y2="900"/>
  </g>

  <!-- Ambient Glow -->
  <circle cx="600" cy="340" r="420" fill="url(#radial_${idx})"/>

  <!-- Centered Glass Card -->
  <rect x="360" y="160" width="480" height="420" rx="32" fill="url(#cardGrad_${idx})" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>

  <!-- Icon Circle -->
  <g transform="translate(600, 270)">
    <circle cx="0" cy="0" r="64" fill="${s.accent}" fill-opacity="0.2" stroke="${s.accent}" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="50" fill="#ffffff" fill-opacity="0.1"/>
    <text x="0" y="20" font-size="48" text-anchor="middle" font-family="'Segoe UI Emoji', 'Apple Color Emoji', sans-serif">${s.icon}</text>
  </g>

  <!-- Badge Pill -->
  <g transform="translate(600, 385)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="${s.accent}" fill-opacity="0.25" stroke="${s.accent}" stroke-width="1.5"/>
    <text x="0" y="5" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="0.05em">FIELDSYNC VERIFIED</text>
  </g>

  <!-- Title & Description inside graphic -->
  <text x="600" y="465" font-family="'Outfit', system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="-0.02em">${safeTitle}</text>
  <text x="600" y="505" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="500" font-size="16" fill="#cbd5e1" text-anchor="middle">${safeSub}</text>

  <!-- Subtle corner decorative badges -->
  <g transform="translate(100, 100)" opacity="0.6">
    <circle cx="0" cy="0" r="6" fill="${s.accent}"/>
    <circle cx="20" cy="0" r="6" fill="#ffffff" fill-opacity="0.2"/>
    <circle cx="40" cy="0" r="6" fill="#ffffff" fill-opacity="0.2"/>
  </g>
</svg>`;

  dirs.forEach(d => {
    fs.writeFileSync(path.join(d, s.file + '.svg'), svg, 'utf-8');
    // Also save as .jpg and .webp for backwards compatibility if needed
    fs.writeFileSync(path.join(d, s.file + '.jpg'), svg, 'utf-8');
    fs.writeFileSync(path.join(d, s.file + '.webp'), svg, 'utf-8');
  });
});

console.log('Successfully generated XML-valid SVG placeholders in all directories.');
