# Cloudinary Setup Guide

This guide will help you switch from Firebase Storage to Cloudinary for better image and media management.

## Why Switch to Cloudinary?

✅ **Built-in image optimization** - Automatic format conversion, resizing, and quality optimization  
✅ **Better performance** - Global CDN with edge caching  
✅ **Advanced transformations** - Real-time image manipulation via URL parameters  
✅ **Better pricing** - More predictable costs with generous free tier  
✅ **Superior features** - AI-powered background removal, auto-tagging, face detection  
✅ **Easier management** - Web-based dashboard for bulk operations

## Prerequisites

- Node.js (v14 or higher)
- Cloudinary account (free tier available)

## 1. Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address
4. Note your **Cloud Name** from the dashboard

## 2. Get API Credentials

1. Go to your Cloudinary Dashboard
2. Navigate to **Settings** → **API Keys**
3. Note down:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Create Upload Preset

1. Go to **Settings** → **Upload**
2. Click **Add upload preset**
3. Configure:
   - **Preset name**: `xtrawrkx_uploads`
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `xtrawrkx` (optional)
   - **Allowed formats**: `jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,txt`
   - **Transformation**:
     - Quality: `auto`
     - Format: `auto`
     - Max dimensions: `1920x1080`
4. Click **Save**

## 4. Install Dependencies

```bash
cd client
npm install cloudinary
```

## 5. Environment Configuration

Create or update your `.env.local` file in the client directory:

```env
# Storage Provider Configuration
# Set to 'cloudinary' to use Cloudinary, 'firebase' to use Firebase Storage
NEXT_PUBLIC_STORAGE_PROVIDER=cloudinary

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key_here
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xtrawrkx_uploads

# Firebase Configuration (keep for fallback)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# CMS Configuration
NEXT_PUBLIC_USE_CMS_DATA=true
NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,admin2@xtrawrkx.com
```

## 6. Test the Configuration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/admin/login`

3. Login with your admin credentials

4. Try uploading an image in the admin panel

5. Check that the image is uploaded to Cloudinary (check your Cloudinary dashboard)

## 7. Image Transformations

### Basic Usage

```javascript
import { CloudinaryImageService } from "@/src/services/cloudinaryService";

// Upload with automatic optimization
const result = await CloudinaryImageService.uploadImage(file, "events", {
  transformation: {
    width: 800,
    height: 600,
    crop: "fill",
    quality: "auto",
    format: "auto",
  },
});

// Get optimized image URL
const optimizedUrl = CloudinaryImageService.getOptimizedImageUrl(
  result.public_id,
  {
    w: 400,
    h: 300,
    c: "fill",
    q: "auto",
    f: "auto",
  }
);
```

### Advanced Transformations

```javascript
// Responsive images
const responsiveUrls = CloudinaryImageService.getResponsiveImageUrls(
  result.public_id,
  [400, 800, 1200, 1600]
);

// Thumbnails
const thumbnailUrl = CloudinaryImageService.getThumbnailUrl(
  result.public_id,
  200,
  200
);
```

## 8. Folder Structure

Cloudinary will organize your uploads in folders:

```
xtrawrkx/
├── events/
│   ├── event_images/
│   └── event_documents/
├── services/
│   ├── service_images/
│   └── service_documents/
├── resources/
│   ├── resource_images/
│   └── resource_documents/
└── general/
    ├── images/
    └── documents/
```

## 9. Security Configuration

### Upload Preset Security

1. Go to **Settings** → **Upload**
2. Select your upload preset
3. Configure restrictions:
   - **Max file size**: 10MB
   - **Max image width**: 1920px
   - **Max image height**: 1080px
   - **Allowed formats**: jpg,png,gif,webp,pdf,doc,docx,xls,xlsx,txt
   - **Resource type**: auto

### API Key Security

⚠️ **Important**: Never expose your API Secret in client-side code. The implementation uses upload presets to avoid this.

## 10. Migration from Firebase Storage

### Option 1: Gradual Migration

- Keep `NEXT_PUBLIC_STORAGE_PROVIDER=firebase` for existing files
- Switch to `NEXT_PUBLIC_STORAGE_PROVIDER=cloudinary` for new uploads
- Migrate files gradually

### Option 2: Complete Migration

1. Download all files from Firebase Storage
2. Upload to Cloudinary using the admin panel or API
3. Switch to `NEXT_PUBLIC_STORAGE_PROVIDER=cloudinary`
4. Update database references to new URLs

### Migration Script (Optional)

```javascript
// Example migration script
import { StorageService } from "@/src/services/storageService";
import { CloudinaryService } from "@/src/services/cloudinaryService";

async function migrateFiles() {
  // Set to Firebase first
  process.env.NEXT_PUBLIC_STORAGE_PROVIDER = "firebase";

  // List all files
  const files = await StorageService.listFiles("images");

  // Switch to Cloudinary
  process.env.NEXT_PUBLIC_STORAGE_PROVIDER = "cloudinary";

  // Upload each file to Cloudinary
  for (const file of files) {
    const response = await fetch(file.url);
    const blob = await response.blob();
    const fileObj = new File([blob], file.name);

    await CloudinaryService.uploadFile(fileObj, "migrated/" + file.name);
  }
}
```

## 11. Performance Optimizations

### Automatic Optimizations

Cloudinary provides automatic:

- Format selection (WebP, AVIF for modern browsers)
- Quality optimization
- Compression
- Responsive images
- Lazy loading support

### Manual Optimizations

```javascript
// Progressive JPEG
const progressiveUrl = CloudinaryImageService.getOptimizedImageUrl(publicId, {
  fl: "progressive",
});

// Blur placeholder
const blurUrl = CloudinaryImageService.getOptimizedImageUrl(publicId, {
  w: 20,
  h: 20,
  c: "fill",
  e: "blur:1000",
  q: 1,
});
```

## 12. Monitoring and Analytics

### Cloudinary Dashboard

Monitor your usage:

- Bandwidth usage
- Storage usage
- Transformation usage
- Popular assets

### Performance Monitoring

```javascript
// Track upload performance
const startTime = performance.now();
const result = await CloudinaryImageService.uploadImage(file);
const uploadTime = performance.now() - startTime;

console.log(`Upload completed in ${uploadTime}ms`);
```

## 13. Troubleshooting

### Common Issues

1. **Upload fails**: Check upload preset configuration
2. **Images not loading**: Verify cloud name and URLs
3. **Transformations not working**: Check transformation syntax
4. **CORS errors**: Ensure your domain is whitelisted

### Debug Mode

```javascript
// Enable debug logging
process.env.NEXT_PUBLIC_DEBUG_STORAGE = "true";
```

### Fallback to Firebase

If Cloudinary is unavailable, the system automatically falls back to Firebase Storage:

```javascript
// Check current provider
console.log("Current storage provider:", StorageService.getProvider());

// Check if configured
console.log("Storage configured:", StorageService.isConfigured());
```

## 14. Cost Optimization

### Free Tier Limits

- 25GB storage
- 25GB bandwidth
- 25,000 transformations

### Optimization Tips

1. Use auto-format and auto-quality
2. Implement responsive images
3. Use progressive loading
4. Cache transformed images
5. Monitor usage in dashboard

## 15. Next Steps

1. **Test thoroughly** in development
2. **Monitor performance** after deployment
3. **Optimize transformations** based on usage
4. **Set up alerts** for usage limits
5. **Consider upgrading** if you exceed free tier

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)
- [Community Forum](https://community.cloudinary.com/)

---

**Remember**: You can switch back to Firebase Storage at any time by changing `NEXT_PUBLIC_STORAGE_PROVIDER=firebase` in your environment variables.
