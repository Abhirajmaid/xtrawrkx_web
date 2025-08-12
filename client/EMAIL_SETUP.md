# 📧 Email Service Setup Guide

This guide explains how to set up and configure the email notification system for event registrations.

## 🚀 Quick Setup

### 1. Install Dependencies

The email service uses `nodemailer` for sending emails. It should already be installed, but if not:

```bash
npm install nodemailer
```

### 2. Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-gmail-app-password

# Admin Email Configuration (comma-separated list)
ADMIN_EMAILS=admin@xtrawrkx.com,support@xtrawrkx.com

# Alternative: Custom SMTP Server
# SMTP_HOST=your-smtp-server.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@domain.com
# SMTP_PASS=your-password
```

### 3. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Use this password as `EMAIL_PASS` (not your regular Gmail password)

### 4. Alternative SMTP Setup

For custom SMTP servers, uncomment the alternative configuration in `/app/api/send-email/route.js`:

```javascript
// For custom SMTP server
return nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

## 📬 Email Types & Flow

### Email Recipients for Each Registration:

1. **To User/Company**:

   - Primary contact email
   - Company email (if different from primary contact)

2. **To XtraWrkx Admin**:
   - All emails listed in `ADMIN_EMAILS`
   - Contains full registration details for processing

### 1. Registration Confirmation Email (To User)

**Sent when:**

- User completes free registration
- User registers but payment is pending

**Features:**

- Welcome message
- Registration details
- Payment reminder (if applicable)
- Next steps information

### 2. Payment Confirmation Email (To User)

**Sent when:**

- Payment is successfully completed
- Registration status changes to confirmed

**Features:**

- Payment confirmation
- Event pass notification
- Event details
- Support information

### 3. Admin Notification Email (To XtraWrkx)

**Sent when:**

- Any new registration occurs
- Any payment is completed

**Features:**

- Complete registration details
- Company information
- Contact details
- Payment status
- Direct links to admin panel

## 🔧 Email Templates

### Template Structure

Email templates are HTML-based with inline CSS for maximum compatibility:

- **Header**: Branded header with gradient background
- **Content**: Registration/payment details
- **Next Steps**: Action items and instructions
- **Footer**: Support contact and company information

### Customization

To customize email templates, edit the functions in `/app/api/send-email/route.js`:

- `getRegistrationEmailTemplate(data)` - Registration confirmation
- `getPaymentConfirmationTemplate(data)` - Payment confirmation

## 🚀 Integration Points

### Event Registration Flow

1. **Free Registration**: Email sent immediately after successful registration
2. **Paid Registration**:
   - Initial email when registration is created (payment pending)
   - Confirmation email when payment is completed

### Season Registration Flow

1. **Free Season Registration**: Email sent immediately
2. **Paid Season Registration**:
   - Initial email for registration received
   - Confirmation email when payment is completed

## 🛠️ API Endpoints

### POST /api/send-email

**Request Body:**

```json
{
  "type": "registration" | "payment_confirmation",
  "data": {
    "registrationId": "string",
    "companyName": "string",
    "primaryContactName": "string",
    "primaryContactEmail": "string",
    "companyEmail": "string",
    "eventTitle": "string",
    "eventDate": "string",
    "eventLocation": "string",
    "ticketType": "string",
    "totalCost": "number",
    "paymentStatus": "string",
    "paymentId": "string" // for payment confirmation
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "recipient": "email@example.com"
}
```

## 🧪 Testing

### Test Email Functionality

1. **Free Registration Test:**

   - Register for a free event
   - Check if confirmation email is received

2. **Paid Registration Test:**

   - Register for a paid event
   - Check initial registration email
   - Complete payment
   - Check payment confirmation email

3. **Season Registration Test:**
   - Test both free and paid season registrations
   - Verify appropriate emails are sent

### Email Troubleshooting

**Common Issues & Solutions:**

#### 1. **Gmail Authentication Error (Most Common)**

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**

- ✅ Enable 2-Factor Authentication on Gmail
- ✅ Generate App Password (NOT your regular Gmail password)
- ✅ Use App Password in `EMAIL_PASS` variable
- ✅ Ensure `EMAIL_USER` is your full Gmail address

**How to get Gmail App Password:**

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Select "Mail" and generate password
5. Use this 16-character password in `.env.local`

#### 2. **Environment Variables Not Working**

```
Error: Missing required email data
```

**Solutions:**

- ✅ Create `.env.local` file in `/client` directory
- ✅ Restart your development server after adding variables
- ✅ Check variable names match exactly: `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAILS`

#### 3. **Emails Going to Spam/Junk**

**Solutions:**

- ✅ Check spam folder
- ✅ Add sender email to contacts
- ✅ Use proper "From" name format
- ✅ Verify email authentication settings

#### 4. **Admin Emails Not Received**

**Solutions:**

- ✅ Check `ADMIN_EMAILS` format: `email1@domain.com,email2@domain.com`
- ✅ No spaces in email list
- ✅ Verify admin email addresses are correct

#### 5. **SMTP Connection Timeout**

```
Error: connect ETIMEDOUT
```

**Solutions:**

- ✅ Check internet connection
- ✅ Verify firewall settings
- ✅ Try different network (corporate firewalls may block SMTP)
- ✅ Use Gmail instead of custom SMTP

## 📊 Monitoring

### Error Handling

The email service includes robust error handling:

- **Non-blocking**: Email failures don't prevent registration completion
- **Logging**: All email attempts are logged for debugging
- **Graceful Degradation**: Registration works even if email service is down

### Logs

Check browser console for email-related logs:

- `Registration email sent successfully`
- `Payment confirmation email sent successfully`
- `Failed to send email: [error details]`

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit email credentials to code
2. **App Passwords**: Use Gmail App Passwords instead of regular passwords
3. **Rate Limiting**: Consider adding rate limiting for email API
4. **Validation**: Email addresses are validated before sending

## 📈 Future Enhancements

Potential improvements:

1. **Email Templates**: Advanced template system with dynamic content
2. **Delivery Tracking**: Track email open rates and delivery status
3. **Bulk Emails**: Support for sending bulk notifications
4. **Email Queue**: Queue system for reliable email delivery
5. **Multiple Providers**: Support for SendGrid, AWS SES, etc.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify environment variables are set correctly
3. Test with a different email address
4. Contact support with error logs

---

**Note**: Email notifications enhance user experience but are not critical for registration functionality. The system is designed to work reliably even if email services are temporarily unavailable.
