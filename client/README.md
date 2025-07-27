# Xtrawrkx Web Platform

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   cd client
   npm install
   ```

2. **Create `.env.local` in the `client` directory:**

   ```env
   # Cloudinary (for all file/image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

   # Firebase (for authentication & database)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Admin emails (comma-separated)
   NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,test@example.com
   # Use CMS (true/false)
   NEXT_PUBLIC_USE_CMS_DATA=true
   ```

   - For **testing only**, you can use:
     ```env
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## 📝 How Event Data & Images Are Stored

- **Event data** is stored in **Firebase Firestore** via the `eventService` (see `src/services/databaseService.js`).
- **Images** (hero/background) are uploaded to **Cloudinary** using the `uploadImage` function (see `src/services/cloudinaryService.js`).
- The returned Cloudinary URL is saved in the event's Firestore document under `heroImage` and `background` fields.

### Event Creation Flow

1. **Admin fills out the event form** (`/admin/events/new`)
2. **Image upload:**
   - When an image is selected, it is uploaded to Cloudinary immediately.
   - The returned URL is set in the form state.
3. **On submit:**
   - The form data (including image URLs) is sent to Firestore via `eventService.createEvent(formData)`.

---

## 🔑 Environment Variables

- All required variables are shown above.
- Cloudinary **upload preset** must be set to **unsigned** in your Cloudinary dashboard.
- See comments in `.env.local` for details.

---

## 🛠️ Useful Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server

---

## 📦 File Uploads: Cloudinary

- All images/files are uploaded to Cloudinary.
- Only the returned URL is stored in Firestore.
- No files are stored in Firebase Storage.

---

## 🔒 Authentication

- Admin login uses Firebase Auth.
- Only emails in `NEXT_PUBLIC_ADMIN_EMAILS` can access admin routes.

---

## 📚 More

- For advanced configuration, see `src/services/cloudinaryService.js` and `src/services/databaseService.js`.
- For troubleshooting, check browser console and `.env.local` values.

---

**This README is your main setup and usage guide.**
