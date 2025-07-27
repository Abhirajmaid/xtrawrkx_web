# Setup & Troubleshooting Guide

## Cloudinary Setup Tips

- **Cloud Name:** Found in your Cloudinary dashboard.
- **Upload Preset:** Must be set to `unsigned` for client-side uploads.
- **Demo values:**
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
  ```
- If you get `Upload preset not found`, check your `.env.local` and restart the dev server.

## Firebase Setup Tips

- All Firebase config values are found in your Firebase project settings.
- Make sure Firestore and Auth are enabled.
- Only emails in `NEXT_PUBLIC_ADMIN_EMAILS` can access admin.

## Common Issues

- **Image upload fails:**
  - Check Cloudinary env vars and preset.
  - Try demo values to isolate config issues.
- **Event not saving:**
  - Check browser console for errors.
  - Make sure Firestore rules allow writes for your user.
- **Admin login fails:**
  - Make sure your email is in `NEXT_PUBLIC_ADMIN_EMAILS`.
  - Check Firebase Auth for user existence.

## Useful Links

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Firebase Console](https://console.firebase.google.com/)
- [Next.js Docs](https://nextjs.org/docs)

## File Upload Flow (Summary)

1. User selects image → uploaded to Cloudinary → gets URL
2. URL is saved in Firestore as part of event data
3. No files are stored in Firebase Storage

## Support

- Double-check `.env.local` for typos
- Restart dev server after any env change
- Check browser console for detailed errors

---

For most users, the main `README.md` is all you need. Use this file for troubleshooting and advanced setup.
