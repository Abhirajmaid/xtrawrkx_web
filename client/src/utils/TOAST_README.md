# Toast Notification System

This document describes the comprehensive toast notification system implemented throughout the xtrawrkx website using React Toastify.

## Overview

The toast system provides consistent, user-friendly notifications for:

- Success messages (registrations, form submissions, CRUD operations)
- Error handling (payment failures, validation errors, network issues)
- Warning messages (payment cancellations, incomplete actions)
- Loading states (form submissions, API calls)
- Information messages (general user feedback)

## Files Structure

```
client/src/utils/
├── toast.js                 # Main toast utilities and configuration
└── TOAST_README.md          # This documentation

client/src/components/common/
└── ToastProvider.jsx        # React component wrapper for ToastContainer

client/app/
└── layout.jsx               # Root layout with ToastProvider integration
```

## Core Components

### 1. Toast Utilities (`toast.js`)

#### Basic Toast Functions

- `toastUtils.success(message, options)` - Green success notifications
- `toastUtils.error(message, options)` - Red error notifications
- `toastUtils.warning(message, options)` - Orange warning notifications
- `toastUtils.info(message, options)` - Blue informational notifications
- `toastUtils.loading(message, options)` - Loading spinner notifications

#### Advanced Toast Functions

- `toastUtils.update(toastId, type, message, options)` - Update existing toast
- `toastUtils.dismiss(toastId)` - Dismiss specific toast
- `toastUtils.dismissAll()` - Dismiss all toasts
- `toastUtils.promise(promise, messages, options)` - Promise-based toasts

#### Pre-configured Common Toasts

- Authentication: `commonToasts.loginSuccess()`, `commonToasts.loginError()`
- Registration: `commonToasts.registrationSuccess(id)`, `commonToasts.registrationError()`
- Payment: `commonToasts.paymentSuccess()`, `commonToasts.paymentCancelled()`
- Forms: `commonToasts.formSuccess()`, `commonToasts.formError()`
- CRUD: `commonToasts.saveSuccess()`, `commonToasts.deleteSuccess()`
- File Operations: `commonToasts.uploadSuccess()`, `commonToasts.uploadError()`
- Network: `commonToasts.networkError()`, `commonToasts.serverError()`
- Validation: `commonToasts.validationError(message)`

### 2. ToastProvider Component

Wraps the ToastContainer with pre-configured settings:

- Position: top-right
- Auto-close timing: 5-7 seconds (varies by type)
- Progress bar, hover pause, click to close
- Limit: 5 concurrent toasts
- Custom styling with brand colors

### 3. Custom Styling

Located in `globals.css`, provides:

- Brand-consistent color gradients
- Smooth animations
- Responsive design
- Custom progress bars
- Hover effects

## Implementation Examples

### Basic Usage

```jsx
import { toastUtils, commonToasts } from "@/src/utils/toast";

// Simple success message
toastUtils.success("Operation completed successfully!");

// Error with longer duration
toastUtils.error("Something went wrong", { autoClose: 10000 });

// Pre-configured common toast
commonToasts.loginSuccess();
```

### Loading States with Updates

```jsx
// Start loading
const loadingToast = toastUtils.loading("Processing...");

try {
  // Perform async operation
  await someAsyncOperation();

  // Update to success
  toastUtils.update(loadingToast, "success", "Operation completed!");
} catch (error) {
  // Update to error
  toastUtils.update(loadingToast, "error", `Failed: ${error.message}`);
}
```

### Form Validation

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toastUtils.validationError("Please fill in all required fields.");
    return;
  }

  const loadingToast = toastUtils.loading("Submitting form...");

  try {
    await submitForm();
    toastUtils.update(loadingToast, "success", "Form submitted successfully!");
  } catch (error) {
    toastUtils.update(
      loadingToast,
      "error",
      "Submission failed. Please try again."
    );
  }
};
```

### Promise-based Toasts

```jsx
const promise = someAsyncOperation();

toastUtils.promise(promise, {
  pending: "Processing your request...",
  success: "Request completed successfully!",
  error: "Request failed. Please try again.",
});
```

## Integration Points

### 1. Authentication Flow

- **Login**: Success/error toasts in `admin/login/page.jsx`
- **Logout**: Success toast in `AdminLayout.jsx`
- **Password Reset**: Implemented in `AuthContext.js`

### 2. Registration & Payment

- **Event Registration**: Success toasts in `events/[slug]/register/page.jsx`
- **Season Registration**: Success toasts in `events/season/[season]/register/page.jsx`
- **Payment Processing**: Error handling and success notifications
- **Payment Cancellation**: Warning toasts with registration ID

### 3. Admin CRUD Operations

- **Events Management**: Create, update, delete, duplicate in `admin/events/page.jsx`
- **Gallery Management**: All CRUD operations in `admin/gallery/page.jsx`
- **Failed Payments**: Resolution handling in `admin/failed-payments/page.jsx`

### 4. Contact Forms

- **Contact Form**: Submission handling in `components/contact/ContactForm.jsx`
- **Book Meeting Modal**: Consultation booking in `components/common/BookMeetModal.jsx`

## Configuration

### Default Settings

```javascript
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light",
  style: {
    fontSize: "14px",
    fontFamily: "var(--font-poppins, sans-serif)",
  },
};
```

### Custom Durations by Type

- **Success**: 5 seconds
- **Error**: 7 seconds
- **Warning**: 6 seconds
- **Info**: 5 seconds
- **Loading**: No auto-close
- **Registration Success**: 10-12 seconds (longer for important info)

## Best Practices

### 1. Message Content

- Be specific and actionable
- Include relevant IDs for registrations/transactions
- Use emoji sparingly for visual appeal (🎉, 💳, ❌, ⚠️)
- Provide next steps when appropriate

### 2. Timing

- Use longer durations for important information (registration IDs, payment confirmations)
- Keep error messages visible longer than success messages
- Use loading toasts for operations > 1 second

### 3. User Experience

- Replace all `alert()` calls with appropriate toasts
- Combine loading states with success/error updates
- Provide clear validation feedback
- Don't spam users with too many simultaneous toasts

### 4. Error Handling

- Always include error context in messages
- Provide fallback actions when possible
- Log errors to console for debugging while showing user-friendly toast

## Migration from Alerts

The following patterns were replaced:

```javascript
// Old: Basic alert
alert("Success message");

// New: Toast notification
toastUtils.success("Success message");

// Old: Confirm dialog
if (confirm("Are you sure?")) {
  // action
}

// New: Toast feedback after action
// Keep confirm dialog but add toast feedback
if (confirm("Are you sure?")) {
  const loadingToast = toastUtils.loading("Processing...");
  // action with toast update
}

// Old: Console error only
console.error("Error:", error);

// New: User-facing toast + console log
console.error("Error:", error);
toastUtils.error(`Operation failed: ${error.message}`);
```

## Testing

### Manual Testing Scenarios

1. **Registration Flow**: Test free and paid registrations
2. **Payment Flow**: Test successful payment, cancellation, and failures
3. **Admin Operations**: Test CRUD operations in admin panels
4. **Form Submissions**: Test contact forms and booking modals
5. **Authentication**: Test login/logout flows
6. **Validation**: Test form validation with empty/invalid inputs
7. **Network Issues**: Test with slow/failed network requests

### Toast Behavior Verification

- Toasts appear in correct position (top-right)
- Appropriate colors and icons for each type
- Auto-close timing works correctly
- Progress bars function properly
- Hover pause/resume works
- Click to dismiss works
- Loading toasts update correctly
- Multiple toasts stack properly (max 5)

## Troubleshooting

### Common Issues

1. **Toasts not appearing**: Check ToastProvider is wrapped in root layout
2. **Styling issues**: Verify globals.css includes toast styles
3. **Import errors**: Ensure correct import paths for toast utilities
4. **Multiple toast libraries**: Ensure only react-toastify is used

### Performance Considerations

- Toast system is lightweight and doesn't impact performance
- Limit concurrent toasts to 5 for optimal UX
- Loading toasts are automatically cleaned up on update
- Toast container is rendered once at root level

## Future Enhancements

### Potential Improvements

1. **Sound notifications** for important toasts
2. **Offline toast queue** for failed network requests
3. **Toast persistence** for critical messages across page reloads
4. **Custom toast templates** for specific use cases
5. **Analytics integration** to track user interaction with toasts
6. **Accessibility improvements** for screen readers
7. **Mobile-specific positioning** and sizing

### Maintenance

- Regularly review toast messages for clarity and usefulness
- Monitor user feedback for toast timing and content
- Update styling to match brand evolution
- Keep react-toastify dependency updated
- Review and optimize toast configurations based on user behavior

---

This toast system provides a production-ready, user-friendly notification system that enhances the overall user experience of the xtrawrkx platform.
