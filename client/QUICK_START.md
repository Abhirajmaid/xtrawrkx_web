# Quick Start Guide

If you're getting errors when trying to access `/admin/login`, follow these steps to get up and running quickly:

## Option 1: Use Static Data (Recommended for Development)

This is the fastest way to get started and test the system:

1. **Install Firebase** (required even for static data mode):

   ```bash
   cd client
   npm install firebase
   ```

2. **Create Environment File**:
   Create a `.env.local` file in the `client` directory:

   ```env
   # Use static data (no Firebase setup required)
   NEXT_PUBLIC_USE_CMS_DATA=false

   # Admin emails (comma-separated)
   NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,test@example.com
   ```

3. **Start Development Server**:

   ```bash
   npm run dev
   ```

4. **Access Admin Panel**:
   - Go to `http://localhost:3000/admin/login`
   - You'll see a warning that Firebase is not available, but you can still access the interface
   - The system will use static data from the data files

## Option 2: Full Firebase Setup

If you want to use the full CMS capabilities:

1. **Install Firebase**:

   ```bash
   cd client
   npm install firebase
   ```

2. **Set up Firebase Project**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage

3. **Get Firebase Configuration**:

   - Go to Project Settings
   - Add a web app
   - Copy the configuration

4. **Create Environment File**:
   Create a `.env.local` file in the `client` directory:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Enable CMS
   NEXT_PUBLIC_USE_CMS_DATA=true

   # Admin emails
   NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,your_email@example.com
   ```

5. **Create Admin User**:

   - Go to Firebase Console > Authentication
   - Click "Add user"
   - Add your email and password
   - Make sure the email is in your `NEXT_PUBLIC_ADMIN_EMAILS` list

6. **Start Development Server**:

   ```bash
   npm run dev
   ```

7. **Access Admin Panel**:
   - Go to `http://localhost:3000/admin/login`
   - Login with your Firebase credentials

## Troubleshooting

### "Firebase is not available" Error

- Make sure you've installed Firebase: `npm install firebase`
- Check your `.env.local` file exists and has the correct variables
- Restart your development server after creating/modifying `.env.local`

### "Client-side exception" Error

- This usually means Firebase package is not installed
- Run `npm install firebase` in the client directory
- Restart your development server

### Authentication Issues

- Make sure your email is in the `NEXT_PUBLIC_ADMIN_EMAILS` list
- Check that the user exists in Firebase Authentication
- Verify Firebase configuration is correct

### Permission Denied

- Check Firestore security rules
- Make sure user is authenticated
- Verify admin email configuration

## Testing the System

Once you have the system running:

1. **Static Data Mode**: Browse through the existing resources, events, and services
2. **CMS Mode**: Create, edit, and manage content through the admin interface
3. **Switch Modes**: Change `NEXT_PUBLIC_USE_CMS_DATA` to toggle between static and CMS data

## Next Steps

- Read the full `CMS_SETUP_GUIDE.md` for complete configuration
- Set up Firebase security rules for production
- Configure proper environment variables for deployment
- Migrate static data to Firebase if needed

## Support

If you're still having issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure Firebase package is installed
4. Try clearing your browser cache and restarting the dev server
