# Firebase CMS Setup Guide

This guide will help you set up and configure the Firebase CMS system for managing resources, events, and services.

## Prerequisites

- Node.js (v14 or higher)
- Firebase account
- Firebase CLI installed (`npm install -g firebase-tools`)

## 1. Firebase Project Setup

### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "xtrawrkx-cms")
4. Enable Google Analytics (optional)
5. Create project

### Enable Required Services

1. **Authentication**

   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Add authorized domains if needed

2. **Firestore Database**

   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (we'll configure security later)
   - Select location closest to your users

3. **Storage**

   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"
   - Select location

4. **Hosting** (optional)
   - Go to Hosting
   - Click "Get started"
   - Follow setup instructions

## 2. Firebase Configuration

### Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" > Web app
4. Register app with nickname
5. Copy the configuration object

### Environment Variables

Create a `.env.local` file in the client directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# CMS Configuration
# Set to 'true' to use Firebase CMS data, 'false' to use static data
NEXT_PUBLIC_USE_CMS_DATA=true

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@xtrawrkx.com,admin2@xtrawrkx.com
```

## 3. Firebase Security Rules

### Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users for public data
    match /{document=**} {
      allow read: if true;
    }

    // Allow write access only to authenticated admin users
    match /resources/{resourceId} {
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@xtrawrkx.com', 'admin2@xtrawrkx.com'];
    }

    match /events/{eventId} {
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@xtrawrkx.com', 'admin2@xtrawrkx.com'];
    }

    match /services/{serviceId} {
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@xtrawrkx.com', 'admin2@xtrawrkx.com'];
    }
  }
}
```

### Storage Security Rules

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all users
    match /{allPaths=**} {
      allow read: if true;
    }

    // Allow write access only to authenticated admin users
    match /{allPaths=**} {
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@xtrawrkx.com', 'admin2@xtrawrkx.com'];
    }
  }
}
```

## 4. Install Dependencies

```bash
cd client
npm install firebase
```

## 5. Admin User Setup

### Create Admin User

1. Go to Firebase Console > Authentication
2. Click "Add user"
3. Enter admin email and password
4. Verify the email is in your `NEXT_PUBLIC_ADMIN_EMAILS` list

### Test Admin Login

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Login with admin credentials
4. You should be redirected to the admin dashboard

## 6. Data Migration (Optional)

If you want to migrate existing static data to Firebase:

### Resources Migration

```javascript
// Run this in the browser console on the admin dashboard
import { ResourceService } from "../services/databaseService";
import { resourcesData } from "../data/ResourcesData";

const migrateResources = async () => {
  for (const resource of resourcesData) {
    try {
      await ResourceService.createResource(resource);
      console.log(`Migrated resource: ${resource.title}`);
    } catch (error) {
      console.error(`Failed to migrate resource: ${resource.title}`, error);
    }
  }
};

migrateResources();
```

### Events Migration

```javascript
// Run this in the browser console on the admin dashboard
import { EventService } from "../services/databaseService";
import { eventsData } from "../data/EventsData";

const migrateEvents = async () => {
  for (const event of eventsData) {
    try {
      await EventService.createEvent(event);
      console.log(`Migrated event: ${event.title}`);
    } catch (error) {
      console.error(`Failed to migrate event: ${event.title}`, error);
    }
  }
};

migrateEvents();
```

### Services Migration

```javascript
// Run this in the browser console on the admin dashboard
import { ServiceService } from "../services/databaseService";
import servicesData from "../data/ServicesData";

const migrateServices = async () => {
  for (const service of servicesData) {
    try {
      await ServiceService.createService(service);
      console.log(`Migrated service: ${service.name}`);
    } catch (error) {
      console.error(`Failed to migrate service: ${service.name}`, error);
    }
  }
};

migrateServices();
```

## 7. Using the CMS

### Accessing the Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Navigate through the admin dashboard

### Managing Resources

- **Create**: Click "Add Resource" button
- **Edit**: Click the edit icon on any resource
- **Delete**: Click the delete icon
- **Bulk Actions**: Select multiple resources for bulk operations
- **Search & Filter**: Use the search bar and category filters

### Managing Events

- **Create**: Click "Add Event" button
- **Edit**: Click the edit icon on any event
- **Delete**: Click the delete icon
- **Status Management**: Update event status (upcoming, ongoing, completed)
- **Bulk Actions**: Select multiple events for bulk operations

### Managing Services

- **Create**: Click "Add Service" button
- **Edit**: Click the edit icon on any service
- **Delete**: Click the delete icon
- **Featured**: Toggle featured status
- **Categories**: Organize by category and sub-company

### File Uploads

- Images are automatically resized and optimized
- Files are stored in Firebase Storage
- Supported formats: JPG, PNG, GIF, WebP, PDF

## 8. Switching Between Data Sources

### Use Static Data (Default)

```env
NEXT_PUBLIC_USE_CMS_DATA=false
```

### Use Firebase CMS Data

```env
NEXT_PUBLIC_USE_CMS_DATA=true
```

The system automatically falls back to static data if Firebase is unavailable.

## 9. Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Build and deploy
npm run build
firebase deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## 10. Monitoring and Analytics

### Firebase Analytics

- Event tracking is automatically enabled
- View analytics in Firebase Console > Analytics

### Performance Monitoring

- Real-time performance data
- Error tracking and reporting
- User engagement metrics

## 11. Troubleshooting

### Common Issues

1. **Authentication Error**

   - Check admin email is in `NEXT_PUBLIC_ADMIN_EMAILS`
   - Verify Firebase Auth is properly configured

2. **Permission Denied**

   - Update Firestore security rules
   - Check user is authenticated

3. **File Upload Issues**

   - Verify Storage security rules
   - Check file size limits

4. **Data Not Loading**
   - Check Firebase configuration
   - Verify network connectivity
   - Check browser console for errors

### Debug Mode

Enable debug mode by setting:

```env
NEXT_PUBLIC_DEBUG=true
```

## 12. Best Practices

### Security

- Never commit `.env.local` to version control
- Use environment-specific configurations
- Regularly review security rules
- Monitor authentication logs

### Performance

- Use pagination for large datasets
- Implement proper caching
- Optimize images before upload
- Use Firebase Performance Monitoring

### Data Management

- Regular backups of Firestore data
- Implement data validation
- Use transactions for critical operations
- Monitor storage usage

## Support

For issues or questions:

- Check the Firebase Console for error logs
- Review the browser console for client-side errors
- Refer to Firebase documentation
- Contact the development team

## License

This CMS system is part of the Xtrawrkx web application and is subject to the project's license terms.
