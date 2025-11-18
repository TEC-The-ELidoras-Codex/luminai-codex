# 🎨 BRANDING FINALIZATION – Logo & Discord Assets

**Status**: Ready for Final Conversion  
**Target**: Complete logo conversion and Discord upload  
**Timeline**: 15–20 minutes total  
**Date**: November 10, 2025

---
title: Logo Finalization

## 📊 Current Status

### ✅ What's Ready

- Logo asset identified: `Logo TECdesign (Logo)TB.png` (115KB, perfect design)
- Logo style documented: Crown + Infinity + TEC with gold/blue/purple gradient
- Discord requirements documented: 1024×1024 icon + 680×240 banner
- Conversion guides created: `assets/logo/QUICK_CONVERSION_GUIDE.md` + `assets/logo/DISCORD_LOGO_SETUP.md`
- All documentation committed to Git

### ⏳ What's Pending

1. **Convert logo to icon format** (1024×1024 PNG) — Use Pixlr
2. **Convert logo to banner format** (680×240 PNG) — Use Pixlr
3. **Upload both assets to Discord** — Dev Portal
4. **Verify appearance** — Check bot profile looks correct

date_created: 2025-11-16
date_updated: 2025-11-16
status: draft
approvers:
  - persona: Ely
    role: Engineering Steward
owner_checklist:
  - [ ] Read and understood
  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md
  - [ ] Tested commands/steps (if procedural)
  - [ ] Old version archived if replaced
tags: [brand]
---

## 🚀 Quick Start (5-Minute Path)

### **Step 1: Open Pixlr** (1 minute)

```
1. Go to: https://pixlr.com/editor
2. Click: "Create New"
3. Select: "Blank Document"
```

### **Step 2: Create Icon (1024×1024)** (2 minutes)

```
1. Set canvas to: 1024 × 1024
2. Upload: Logo TECdesign (Logo)TB.png
3. Resize logo to fit nicely (leave ~100px margins)
4. Export as: discord_icon_1024x1024.png
   - Format: PNG
   - Quality: 100%
   - Background: Transparent
```

### **Step 3: Create Banner (680×240)** (2 minutes)

```
1. Create new document: 680 × 240
2. Upload: Logo TECdesign (Logo)TB.png again
3. Position logo on left side (centered vertically)
4. Optional: Add text "LuminAI Codex" on right
5. Export as: discord_banner_680x240.png
   - Format: PNG
   - Quality: 100%
   - Background: Transparent
```

### **Step 4: Upload to Discord** (1 minute)

```
1. Go to: Discord Developer Portal
2. Select: LuminAI-Codex app
3. Click: General Information
4. App Icon: Upload discord_icon_1024x1024.png
5. Banner: Upload discord_banner_680x240.png
6. Click: Save Changes
```

---

## 📋 Detailed Checklist

### **Pre-Conversion** ✅

- [ ] Logo file ready: `/home/tec_tgcr/luminai-codex/assets/logo/Logo TECdesign (Logo)TB.png`
- [ ] Pixlr bookmark saved (<https://pixlr.com/editor>)
- [ ] Discord Dev Portal bookmarked (<https://discord.com/developers>)
- [ ] Understood: Icon = 1024×1024, Banner = 680×240

### **Conversion Phase** ⏳

- [ ] Open Pixlr
- [ ] Create 1024×1024 canvas
- [ ] Upload logo
- [ ] Resize and center logo
- [ ] Export as `discord_icon_1024x1024.png`
- [ ] Create 680×240 canvas
- [ ] Upload logo again
- [ ] Position logo on left
- [ ] Export as `discord_banner_680x240.png`
- [ ] Save both files locally

### **Upload Phase** 📤

- [ ] Go to Discord Developer Portal
- [ ] Navigate to LuminAI-Codex app
- [ ] Go to General Information tab
- [ ] Upload icon PNG
- [ ] Upload banner PNG
- [ ] Verify both images display correctly
- [ ] Click "Save Changes"

### **Post-Upload Verification** ✅

- [ ] Icon visible in bot profile (small circle in Discord)
- [ ] Banner visible when scrolling to bot in app list
- [ ] Both images at correct resolution
- [ ] No artifacts or compression issues
- [ ] TEC logo style preserved (crown + infinity + TEC intact)

---

## 🎨 Design Guidelines (Reference)

### **Icon (1024×1024)**

- **Aspect Ratio**: 1:1 square
- **Background**: Transparent (PNG)
- **Logo Placement**: Centered, ~900×900 size (100px margin)
- **Style**: Crown + Infinity + TEC sharp and clear
- **Colors**: Gold/blue/purple gradient intact
- **Size**: < 10MB (usually ~100–200KB)
- **Use Cases**:
  - Discord app icon (32×32 at smallest, 1024×1024 at largest)
  - Bot profile picture
  - Verification badge

### **Banner (680×240)**

- **Aspect Ratio**: 17:6 (landscape)
- **Background**: Transparent (PNG)
- **Logo Placement**: Left side, 150–200px from left edge, vertically centered
- **Optional Text**: "LuminAI Codex" in right ~40% of banner (sans-serif, white/gold)
- **Colors**: Match icon (gold/blue/purple)
- **Size**: < 10MB (usually ~50–100KB)
- **Use Cases**:
  - Discord app store banner
  - Bot profile header
  - Integration listing

---

## 🔧 Troubleshooting

### **Issue: Logo looks blurry after resize**

**Solution**: Use "Nearest Neighbor" interpolation instead of bilinear

### **Issue: Logo has white background instead of transparent**

**Solution**:

1. Select the background with "Select by Color" tool
2. Delete it
3. Export as PNG with "Preserve Transparency" checked

### **Issue: Colors look different after export**

**Solution**:

1. Check "Color Profile" settings in export
2. Use sRGB color space
3. Ensure "Preserve Color Profile" is checked

### **Issue: Discord says image is wrong size**

**Solution**:

1. Verify exact dimensions: Icon = 1024×1024, Banner = 680×240
2. Check export settings (some tools add padding)
3. Use online tool to verify: <https://www.imgonline.com.ua/eng/check-image-size.php>

### **Issue: Can't upload to Discord**

**Solution**:

1. Ensure file is PNG (not JPEG or WebP)
2. Check file size < 10MB
3. Try different browser (Chrome/Firefox)
4. Clear browser cache and try again

---

## 💾 File References

### **Asset Files**

- **Logo Source**: `/home/tec_tgcr/luminai-codex/assets/logo/Logo TECdesign (Logo)TB.png`
- **Icon Output**: `discord_icon_1024x1024.png` (save locally, then upload)
- **Banner Output**: `discord_banner_680x240.png` (save locally, then upload)

### **Guides**

- **Quick Start**: `assets/logo/QUICK_CONVERSION_GUIDE.md`
- **Detailed Setup**: `assets/logo/DISCORD_LOGO_SETUP.md`
- **Implementation Status**: `docs/operations/IMPLEMENTATION_COMPLETE.md`

### **Discord Developer Portal**

- **App Settings**: <https://discord.com/developers/applications/YOUR_APP_ID/information>
- **LuminAI-Codex App**: <https://discord.com/developers/applications/1336XXX/information>

---

## 📈 Progress Timeline

| Step | Task | Duration | Status |
|------|------|----------|--------|
| 1 | Open Pixlr | 1 min | ⏳ Pending |
| 2 | Create icon | 2 min | ⏳ Pending |
| 3 | Create banner | 2 min | ⏳ Pending |
| 4 | Upload to Discord | 1 min | ⏳ Pending |
| 5 | Verify appearance | 1 min | ⏳ Pending |
| **TOTAL** | **Branding complete** | **~7 min** | 🟡 In Progress |

---

## 🎯 Next Steps After Upload

### **Immediate (Next 1 hour)**

1. ✅ Icon + banner uploaded
2. ✅ Verified appearance in Discord
3. ✅ Bot profile looks professional

### **Short-term (Next 24 hours)**

1. Proceed to Discord verification setup (identity check)
2. Enable team 2FA
3. Submit for Discord verification
4. Await Discord approval (2–7 business days)

### **Medium-term (After Discord verification)**

1. Launch bot publicly
2. Add to first server
3. Begin testing with real users
4. Collect feedback

---

## ✨ Success Criteria

✅ Icon correctly sized (1024×1024)  
✅ Banner correctly sized (680×240)  
✅ Both in PNG format with transparency  
✅ Logo style preserved (crown + infinity + TEC)  
✅ Both uploaded to Discord Dev Portal  
✅ Both visible in bot profile  
✅ No compression artifacts  
✅ No color degradation  
✅ File sizes < 10MB each  

---

## 🎉 Result

Once complete:

- ✅ Discord bot has professional branding
- ✅ Icon appears in Discord app list
- ✅ Banner visible on integration page
- ✅ Users recognize LuminAI Codex branding
- ✅ Ready for verification submission

---

**Ready to convert? Open Pixlr and follow the 5-minute guide above.**

Questions? See `assets/logo/QUICK_CONVERSION_GUIDE.md` for detailed steps.
