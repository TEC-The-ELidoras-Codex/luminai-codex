/**
 * Generate Discord Bot Assets for LuminAI Codex
 * Creates:
 * - App Icon: 1024x1024 (1:1)
 * - Banner: 680x240 (17:6)
 */

const fs = require('fs');
const path = require('path');

// Try to use canvas if available, fallback to SVG
let useCanvas = false;
try {
  require('canvas');
  useCanvas = true;
} catch (e) {
  console.log('ℹ️  Canvas not available, generating SVG versions instead');
}

const OUTPUT_DIR = path.join(__dirname, '.');

// Color Scheme
const colors = {
  primaryBlue: '#2C3E50',
  accentGold: '#F39C12',
  accentCyan: '#3498DB',
  accentPurple: '#9B59B6',
  white: '#FFFFFF',
  darkBg: '#1A1A1A',
};

/**
 * Generate Icon SVG (1024x1024)
 */
function generateIconSVG() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" fill="${colors.primaryBlue}"/>
  
  <!-- Concentric circles (resonance effect) -->
  <circle cx="512" cy="512" r="400" fill="none" stroke="${colors.accentGold}" stroke-width="20"/>
  <circle cx="512" cy="512" r="300" fill="none" stroke="${colors.accentGold}" stroke-width="20"/>
  <circle cx="512" cy="512" r="200" fill="none" stroke="${colors.accentGold}" stroke-width="20"/>
  
  <!-- Wave patterns (resonance) -->
  <path d="M 150 512 Q 300 450 450 512 T 750 512 T 1050 512" 
        fill="none" stroke="${colors.accentCyan}" stroke-width="12" stroke-linecap="round"/>
  <path d="M 150 512 Q 300 574 450 512 T 750 512 T 1050 512" 
        fill="none" stroke="${colors.accentCyan}" stroke-width="12" stroke-linecap="round"/>
  
  <!-- Center arc (C for Codex) -->
  <path d="M 400 300 A 224 224 0 0 1 400 724" 
        fill="none" stroke="${colors.accentGold}" stroke-width="50" stroke-linecap="round"/>
  
  <!-- AI symbol at bottom -->
  <g transform="translate(512, 800)">
    <polygon points="0,-80 40,40 -40,40" fill="${colors.accentPurple}" stroke="${colors.white}" stroke-width="4"/>
    <circle cx="0" cy="-80" r="8" fill="${colors.white}"/>
  </g>
  
  <!-- Glow effect -->
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>`;
  
  return svg;
}

/**
 * Generate Banner SVG (680x240)
 */
function generateBannerSVG() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="680" height="240" viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.darkBg};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${colors.primaryBlue};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.darkBg};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="680" height="240" fill="url(#bgGradient)"/>
  
  <!-- Resonance bars (left side) -->
  <rect x="40" y="90" width="18" height="60" fill="${colors.accentCyan}" stroke="${colors.white}" stroke-width="2"/>
  <rect x="70" y="75" width="18" height="90" fill="${colors.accentGold}" stroke="${colors.white}" stroke-width="2"/>
  <rect x="100" y="60" width="18" height="120" fill="${colors.accentPurple}" stroke="${colors.white}" stroke-width="2"/>
  <rect x="130" y="80" width="18" height="80" fill="${colors.accentCyan}" stroke="${colors.white}" stroke-width="2"/>
  <rect x="160" y="100" width="18" height="40" fill="${colors.accentGold}" stroke="${colors.white}" stroke-width="2"/>
  
  <!-- Divider lines -->
  <line x1="190" y1="50" x2="190" y2="190" stroke="${colors.accentGold}" stroke-width="3"/>
  <line x1="200" y1="100" x2="670" y2="100" stroke="${colors.accentCyan}" stroke-width="2"/>
  <line x1="200" y1="140" x2="670" y2="140" stroke="${colors.accentCyan}" stroke-width="2"/>
  
  <!-- Text placeholder area (right side shows where text should go) -->
  <text x="220" y="120" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${colors.white}">
    LuminAI Codex
  </text>
  <text x="220" y="155" font-family="Arial, sans-serif" font-size="14" fill="${colors.accentCyan}">
    AI Research Assistant
  </text>
</svg>`;
  
  return svg;
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Generating Discord Bot Assets...\n');
  
  // Generate Icon
  const iconSvg = generateIconSVG();
  const iconPath = path.join(OUTPUT_DIR, 'discord_icon_1024x1024.svg');
  fs.writeFileSync(iconPath, iconSvg);
  console.log(`✅ Icon SVG: ${iconPath} (1024×1024)`);
  
  // Generate Banner
  const bannerSvg = generateBannerSVG();
  const bannerPath = path.join(OUTPUT_DIR, 'discord_banner_680x240.svg');
  fs.writeFileSync(bannerPath, bannerSvg);
  console.log(`✅ Banner SVG: ${bannerPath} (680×240)`);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 NEXT STEPS:');
  console.log('='.repeat(60));
  console.log('1. Open generated SVG files in Figma or Illustrator');
  console.log('2. Export as PNG (1024×1024 icon, 680×240 banner)');
  console.log('3. Upload to Discord Developer Portal:');
  console.log('   • Icon → "App Icon" (1024×1024, 1:1)');
  console.log('   • Banner → "Banner" (680×240, 17:6)');
  console.log('='.repeat(60));
  console.log('\n📦 Alternative: Use online SVG to PNG converter:');
  console.log('   • https://convertio.co/svg-png/');
  console.log('   • https://image.online-convert.com/convert-to-png');
  console.log('='.repeat(60));
}

main();
