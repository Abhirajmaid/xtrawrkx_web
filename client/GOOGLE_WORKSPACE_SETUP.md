# 🚀 Google Workspace Email Setup for xsos@xtrawrkx.com

## ✅ Code Changes Completed

Your website code has been updated to use environment variables and is ready to work with your Google Workspace email `xsos@xtrawrkx.com`.

## 📋 What You Need to Do Now

### 1. Create Environment File

Create a file named `.env.local` in your `client` directory with this content:

```env
# Google Workspace Email Configuration
EMAIL_USER=xsos@xtrawrkx.com
EMAIL_PASS=your-app-specific-password-here

# Admin Email Recipients (comma-separated, no spaces)
ADMIN_EMAILS=xsos@xtrawrkx.com,hiten@xtrawrkx.com
```

### 2. Generate App Password for Google Workspace

#### For xsos@xtrawrkx.com account:

1. **Sign in to Google Admin Console** (as admin):

   - Go to [admin.google.com](https://admin.google.com)
   - Sign in with your admin account (`hiten@xtrawrkx.com`)

2. **Enable 2-Step Verification** for xsos@xtrawrkx.com:

   - Go to Users → Find xsos@xtrawrkx.com → Security
   - Enable 2-Step Verification

3. **Generate App Password**:

   - Go to [myaccount.google.com](https://myaccount.google.com) (sign in as xsos@xtrawrkx.com)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" → Generate password
   - Copy the 16-character password

4. **Update .env.local**:
   Replace `your-app-specific-password-here` with the generated password

### 3. Alternative: Use Gmail SMTP for Google Workspace

If app passwords don't work, you can use OAuth2 or regular SMTP:

```env
# Alternative configuration
EMAIL_USER=xsos@xtrawrkx.com
EMAIL_PASS=your-account-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### 4. Test the Configuration

After setting up the environment file:

1. **Restart your development server**:

   ```bash
   npm run dev
   ```

2. **Test registration**:

   - Go to any event registration page
   - Complete a test registration
   - Check if emails are sent to both user and admin

3. **Check logs**:
   - Look at your console for email sending logs
   - Verify emails are received at xsos@xtrawrkx.com and hiten@xtrawrkx.com

## 🔧 Troubleshooting

### Problem: "Invalid login" error

**Solution**:

- Ensure 2-Step Verification is enabled for xsos@xtrawrkx.com
- Use App Password, not regular account password
- Verify the email address is correct

### Problem: "Authentication failed"

**Solution**:

- Check if "Less secure app access" needs to be enabled (for Google Workspace)
- Try OAuth2 authentication instead
- Contact your Google Workspace admin (hiten@xtrawrkx.com) for SMTP permissions

### Problem: Environment variables not working

**Solution**:

- Ensure `.env.local` is in the correct directory (`client/.env.local`)
- Restart your development server after creating/updating the file
- Check for typos in variable names

## 📧 What Happens Now

With this group email setup:

1. **Registration emails** will be sent FROM `hiten@xtrawrkx.com` but with **Reply-To: xsos@xtrawrkx.com**
2. **Admin notifications** will be sent TO both `xsos@xtrawrkx.com` and `hiten@xtrawrkx.com`
3. **User replies** will go to the group email `xsos@xtrawrkx.com`
4. **All credentials** are safely stored in environment variables (not in code)

### How It Works:

- **SMTP Authentication**: Uses `hiten@xtrawrkx.com` (since group emails can't authenticate)
- **Reply Address**: Set to `xsos@xtrawrkx.com` (so responses go to the group)
- **Recipients**: Both individual and group emails receive notifications

## 🎯 Email Flow

```
User registers for event
    ↓
User gets confirmation email FROM xsos@xtrawrkx.com
    ↓
Admin gets notification AT xsos@xtrawrkx.com & hiten@xtrawrkx.com
    ↓
Payment completed (if applicable)
    ↓
User gets payment confirmation FROM xsos@xtrawrkx.com
    ↓
Admin gets payment notification AT xsos@xtrawrkx.com & hiten@xtrawrkx.com
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use App Passwords instead of regular passwords
- Store credentials securely
- The current hardcoded credentials have been removed from your code

## ✨ Next Steps

1. Create the `.env.local` file with your Google Workspace credentials
2. Test the email system
3. Monitor email delivery and adjust settings if needed

Your website is now ready to send professional emails from your official `xsos@xtrawrkx.com` address! 🚀
