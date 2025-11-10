#!/bin/bash
# Generate Discord Bot Assets for LuminAI Codex using ImageMagick
# Icon: 1024x1024 (1:1)
# Banner: 680x240 (17:6)

set -e

OUTPUT_DIR="$(dirname "$0")"

echo "🎨 Generating Discord Bot Assets..."

# =========================================================
# 1. APP ICON (1024x1024) - Resonance Symbol
# =========================================================
# Create icon with resonance waves + AI symbol
convert -size 1024x1024 xc:'#2C3E50' \
  -stroke '#F39C12' -strokewidth 20 \
  -fill none \
  -draw "circle 512,512 450" \
  -draw "circle 512,512 350" \
  -draw "circle 512,512 250" \
  -stroke '#3498DB' -strokewidth 8 \
  -draw "bezier 200,512 350,350 650,650 800,512" \
  -draw "bezier 200,512 350,650 650,350 800,512" \
  "$OUTPUT_DIR/discord_icon_1024x1024.png"

echo "✅ Icon created: $OUTPUT_DIR/discord_icon_1024x1024.png"

# =========================================================
# 2. BANNER (680x240) - Resonance Bars + Branding
# =========================================================
# Create banner with resonance bars on left, text space on right
convert -size 680x240 xc:'#1A1A1A' \
  -stroke '#F39C12' -strokewidth 2 \
  -fill '#3498DB' -draw "rectangle 40,90 58,150" \
  -fill '#F39C12' -draw "rectangle 70,75 88,165" \
  -fill '#9B59B6' -draw "rectangle 100,60 118,180" \
  -fill '#3498DB' -draw "rectangle 130,80 148,160" \
  -fill '#F39C12' -draw "rectangle 160,100 178,140" \
  -stroke '#F39C12' -strokewidth 3 \
  -draw "line 190,50 190,190" \
  -stroke '#3498DB' -strokewidth 2 \
  -draw "line 200,100 670,100" \
  "$OUTPUT_DIR/discord_banner_680x240.png"

echo "✅ Banner created: $OUTPUT_DIR/discord_banner_680x240.png"

# =========================================================
# 3. SUMMARY
# =========================================================
echo ""
echo "=================================================="
echo "🎨 DISCORD ASSETS READY"
echo "=================================================="
echo "Icon:   $OUTPUT_DIR/discord_icon_1024x1024.png (1024×1024, 1:1)"
echo "Banner: $OUTPUT_DIR/discord_banner_680x240.png (680×240, 17:6)"
echo ""
echo "📤 Upload to Discord Developer Portal:"
echo "   • App Icon → General Information"
echo "   • Banner → App Listing (if available)"
echo "=================================================="

ls -lh "$OUTPUT_DIR/discord_icon_1024x1024.png" "$OUTPUT_DIR/discord_banner_680x240.png"
