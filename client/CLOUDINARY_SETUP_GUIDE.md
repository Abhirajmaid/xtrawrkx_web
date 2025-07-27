# Fix "Failed to upload image: Failed to fetch" Error

## Problem

The image upload is failing because Cloudinary is not properly configured. The application is trying to upload to invalid endpoints.

## Solution

### Step 1: Create Environment Variables File

Create a file named `.env.local` in the `client` directory with the following content:

```env
# Cloudinary Configuration (REQUIRED for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-actual-upload-preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key

# Firebase Configuration (REQUIRED for database operations)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcd1234
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCD1234

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,your-email@example.com

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_USE_CMS_DATA=false
```

### Step 2: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign up or log in to your account
3. From the dashboard, get:
   - **Cloud Name**: Found at the top of your dashboard
   - **Upload Preset**: Create an unsigned upload preset (see step 3)
   - **API Key**: Found in the "API Keys" section

### Step 3: Create an Unsigned Upload Preset

1. In your Cloudinary dashboard, go to Settings → Upload
2. Click "Add upload preset"
3. Set the following:
   - **Preset name**: Choose a name (e.g., `xtrawrkx_uploads`)
   - **Signing mode**: Select **"Unsigned"** (Important!)
   - **Folder**: Set to organize uploads (e.g., `xtrawrkx/uploads`)
4. Save the preset
5. Use the preset name in your `.env.local` file

### Step 4: Update Environment Variables

Replace the placeholder values in your `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name-here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name-here
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key-here
```

### Step 5: Restart Development Server

After creating/updating `.env.local`:

```bash
# Stop the development server (Ctrl+C)
# Then restart it
npm run dev
```

## Testing the Fix

1. Go to the admin panel
2. Try to upload an image in Events or Services
3. Check the browser console for detailed error messages if it still fails

## Common Issues & Solutions

### "Invalid upload preset" Error

- Make sure your upload preset exists in Cloudinary
- Ensure it's set to "unsigned" mode
- Double-check the preset name in `.env.local`

### "Invalid cloud_name" Error

- Verify your cloud name in the Cloudinary dashboard
- Make sure there are no typos in `.env.local`

### Still Getting "Failed to fetch"

- Check your internet connection
- Verify all environment variables are set correctly
- Make sure you restarted the development server
- Check browser console for more detailed error messages

### Network/CORS Issues

- Ensure your domain is added to allowed domains in Cloudinary settings
- For local development, this usually isn't needed

## File Structure After Setup

```
client/
├── .env.local          ← Create this file
├── package.json
├── src/
│   └── services/
│       └── cloudinaryService.js  ← Updated with better error handling
└── ...
```

## Security Notes

- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Keep your API keys secure
- Use unsigned presets for client-side uploads

## Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify your Cloudinary account is active
3. Make sure your upload preset allows the file types you're trying to upload
4. Test uploading directly in the Cloudinary dashboard to ensure your account works

The improved error handling will now provide more specific guidance when issues occur.
