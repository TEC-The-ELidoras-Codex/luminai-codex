# 🤖 Discord Bot Setup - Quick Start

**Bot Name**: LuminAI-Codex  
**Application ID**: 1401803197898690635  
**Public Key**: `794a1921bf24ecc7c1c693183e98c02a9a40a5fb5a23996e9372264ff3e7cc06`  
**Status**: ✅ Ready to Configure

---

## 🎯 What You Just Did

✅ Created Discord bot on developer portal  
✅ Configured General Information  
✅ Set bot name and permissions  
✅ Got Application ID & Public Key

---

## � General Information Tab (Currently Here)

**What**: Configure your bot's profile on Discord  
**Status**: ⏳ In Progress

| Field | Required | Action |
|-------|----------|--------|
| App Icon | ❌ Optional | Skip for now (add TEC logo later) |
| Name | ✅ Done | Already set: `LuminAI-Codex` |
| Description | ❌ Optional | Add 1-line description (400 chars) |
| Tags | ❌ Optional | Skip |
| Interactions URL | ❌ Optional | Skip |
| Terms/Privacy URLs | ❌ Optional | Skip |

### **What to Do Now**

```bash
# 1. Click Description field
# 2. Enter: "AI research assistant with GPT-4, Claude, and xAI. Generate, explore, build."
# 3. Save Changes (auto-saves usually)
# 4. Optional: Upload TEC logo as App Icon (1024x1024 PNG)
```

### **Important IDs to Save**

Add these to your `.env.local` (NOT your bot token):

```env
DISCORD_APP_ID=1401803197898690635
DISCORD_PUBLIC_KEY=794a1921bf24ecc7c1c693183e98c02a9a40a5fb5a23996e9372264ff3e7cc06
```

**Next**: Go to "Bot" tab → Get your **Bot Token**

---

## 🔧 What to Do Next (Bot Tab)

```bash
# ⚠️ Your token was shown ONCE and cannot be viewed again!
# If you didn't copy it, click "Reset Token" to get a new one

nano ~/.env.local

# Add this:
DISCORD_BOT_TOKEN=MzA0YOUR_TOKEN_HERE
```

**Token format**: Starts with `Mzà4` → long string

---

### **2. Enable Required Intents**

In Discord Developer Portal:

```
Bot → Privileged Gateway Intents
✅ Presence Intent
✅ Server Members Intent  
✅ Message Content Intent
```

**Why**: Your bot needs these to:

- Read user messages
- Get member info
- Track status/presence

---

### **3. Invite Bot to Your Discord Server**

```bash
# Discord Developer Portal → OAuth2 → URL Generator

Scopes: ✅ bot

Permissions:
  ✅ Send Messages
  ✅ Embed Links
  ✅ Attach Files
  ✅ Read Message History
  ✅ Use Slash Commands
```

Copy the generated URL and open it to invite bot.

---

### **4. Test the Connection**

```bash
# Quick test (if you have Node.js):
node -e "require('dotenv').config(); console.log('Token:', process.env.DISCORD_BOT_TOKEN?.slice(0,10))"

# Should output: Token: Mzà4...
```

---

## 📋 Complete Setup Checklist

### **General Information Tab** (You're here)

- [ ] Add description (optional)
- [ ] Upload icon (optional, use TEC logo later)
- [ ] Save DISCORD_APP_ID to `.env.local`
- [ ] Save DISCORD_PUBLIC_KEY to `.env.local`

### **Bot Tab** (Next)

- [ ] Copy Bot Token
- [ ] Add DISCORD_BOT_TOKEN to `.env.local`
- [ ] Enable 3 Intents (Presence, Members, Message Content)

### **OAuth2 Tab**

- [ ] Go to URL Generator
- [ ] Select `bot` scope
- [ ] Select permissions (Send Messages, etc)
- [ ] Copy invite link
- [ ] Invite bot to your Discord server

### **Local Setup**

- [ ] `.env.local` has DISCORD_BOT_TOKEN
- [ ] `.env.local` has DISCORD_APP_ID
- [ ] `.env.local` has DISCORD_PUBLIC_KEY
- [ ] Test token loads: `node -e "require('dotenv').config(); console.log(process.env.DISCORD_BOT_TOKEN?.slice(0,10))"`

### **Security**

- [ ] `.env.local` is in `.gitignore` ✅
- [ ] Never commit `.env.local` to git
- [ ] Keep token secret
- [ ] Bot invited to your Discord server
- [ ] Bot appears in your server member list
- [ ] `.env.local` is NOT committed to git

---

## 🔄 If You Lost Your Token

```bash
# Discord Developer Portal → Bot → Reset Token
# Copy the new one immediately!
# Update .env.local with new token
```

---

## ✅ Your Next Steps

1. **Today**: Add `DISCORD_BOT_TOKEN` to `.env.local`
2. **Today**: Invite bot to your server
3. **This Week**: Set up Bitwarden & GitHub App credentials (see `ENV_LOCAL_SETUP.md`)
4. **This Week**: Start implementing Discord commands in your app

---

## 📚 Resources

- **Discord.js Documentation**: <https://discord.js.org/>
- **Discord API Docs**: <https://discord.com/developers/docs>
- **Bot Intents Guide**: <https://discord.com/developers/docs/topics/gateway#gateway-intents>
- **Slash Commands**: <https://discord.com/developers/docs/interactions/application-commands>

---

**Remember**: Keep your token secret! Don't share it or commit it to git.
