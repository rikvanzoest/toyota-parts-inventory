# Photo Upload Feature

## Overview

Each part can now have up to **2 photos** to showcase the condition and details of the used part.

## How It Works

### Adding Photos (Admin Only)

1. Click "Add Part" or edit an existing part
2. Scroll to the "Photos (Optional)" section
3. Click on the upload area for Photo 1 or Photo 2
4. Select an image from your device
5. Preview appears immediately
6. Click the X button to remove a photo

### Photo Specifications

- **Format**: PNG, JPG, JPEG, GIF, WEBP
- **Max Size**: 5MB per photo
- **Max Photos**: 2 per part
- **Storage**: Photos are stored as base64 in the database

### Viewing Photos

- **Table View**: First photo shows as thumbnail (64x64px) in the Photo column
- **No Photo**: Gray placeholder icon appears
- Both viewers and admins can see photos

## Technical Details

### Database Storage

Photos are stored in the `toyota_parts` table:
- `photo_1` - TEXT field (base64 encoded)
- `photo_2` - TEXT field (base64 encoded)

### File Size Limit

The 5MB limit is enforced in the browser before upload. If a user tries to upload a larger file, they'll see an error message.

### Base64 Storage

Photos are converted to base64 format and stored directly in the database. This approach:
- ✅ Simple implementation
- ✅ No external storage needed
- ✅ Works immediately
- ⚠️ Can increase database size

### For Production (Optional Upgrade)

For better performance with many photos, consider:

1. **Supabase Storage** (Recommended for production):
   - Create a storage bucket in Supabase
   - Upload photos to storage
   - Store only the URL in the database
   - Reduces database size
   - Faster loading

2. **Image CDN**:
   - Use Cloudinary or imgix
   - Better image optimization
   - Automatic resizing

## Photo Display

### Table View
- Shows first photo (photo_1) as thumbnail
- Gray placeholder if no photo
- 64x64px square with rounded corners

### Form View (Admin)
- Both photos shown side-by-side
- 192px height preview
- Drag-and-drop upload areas
- Remove button (X) on each photo

## Example Use Cases

**Body Parts**: 
- Photo 1: Overall view showing condition
- Photo 2: Close-up of any damage/scratches

**Engine Parts**:
- Photo 1: Part installed on vehicle
- Photo 2: Part removed showing details

**Interior Parts**:
- Photo 1: Full part view
- Photo 2: Wear areas or special features

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (desktop & mobile)
- Firefox
- Safari (desktop & mobile)

Photos are processed client-side before upload, so no server-side image processing is needed.
