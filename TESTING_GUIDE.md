# PhotoPrint Pro - Testing Guide

This guide provides comprehensive testing instructions and mock data for the photo company website.

## 🚀 Quick Start

1. **Open the main website**: Open `index.html` in your browser
2. **Open the admin panel**: Open `admin.html` in your browser
3. **Test the search functionality** using the mock data below

## 📋 Mock Data for Testing

### Session IDs (for customer search)
Use these Session IDs to find photos on the main website:

| Session ID | Customer Name | Email | Photos Available |
|------------|---------------|-------|------------------|
| `SESS001` | John Smith | john@example.com | 6 photos |
| `SESS002` | Jane Doe | jane@example.com | 4 photos |
| `SESS003` | Mike Johnson | mike@example.com | 2 photos |
| `SESS004` | Sarah Wilson | sarah@example.com | 2 photos |
| `SESS005` | Emma | emma@example.com | 2 photos |
| `SESS006` | David | david@example.com | 2 photos |

### Email Addresses (for customer search)
Use these email addresses to find photos:

| Email | Session ID | Photos Available |
|-------|------------|------------------|
| `john@example.com` | SESS001 | 6 photos |
| `jane@example.com` | SESS002 | 4 photos |
| `mike@example.com` | SESS003 | 2 photos |
| `sarah@example.com` | SESS004 | 2 photos |
| `emma@example.com` | SESS005 | 2 photos |
| `david@example.com` | SESS006 | 2 photos |

## 🧪 Testing Scenarios

### 1. Customer Search Testing

#### Test Case 1: Search by Session ID
1. Go to the main website (`index.html`)
2. Navigate to "Find My Photos" section
3. Click on "Session ID" tab
4. Enter `SESS001` in the search field
5. Click "Search"
6. **Expected Result**: Should display 6 photos for John Smith

#### Test Case 2: Search by Email
1. Go to the main website (`index.html`)
2. Navigate to "Find My Photos" section
3. Click on "Email" tab
4. Enter `jane@example.com` in the search field
5. Click "Search"
6. **Expected Result**: Should display 4 photos for Jane Doe

#### Test Case 3: Invalid Search
1. Enter an invalid Session ID like `INVALID123`
2. Click "Search"
3. **Expected Result**: Should show "No photos found" message

### 2. Photo Purchase Testing

#### Test Case 4: Purchase Digital Download
1. Search for photos using any valid Session ID
2. Click "Purchase" on any photo
3. In the modal, click "Purchase Digital" ($9.99)
4. **Expected Result**: Should show processing animation and success message

#### Test Case 5: Purchase Print + Digital
1. Search for photos using any valid Session ID
2. Click "Purchase" on any photo
3. In the modal, click "Purchase Print + Digital" ($19.99)
4. **Expected Result**: Should show processing animation and success message

### 3. Admin Panel Testing

#### Test Case 6: Upload New Session
1. Open `admin.html` in your browser
2. Go to "Upload Photos" section
3. Fill in the form:
   - Session ID: `SESS007`
   - Customer Name: `Test Customer`
   - Customer Email: `test@example.com`
4. Upload some image files (drag and drop or click to select)
5. Click "Upload Session"
6. **Expected Result**: Should show success message and add to sessions list

#### Test Case 7: View Sessions
1. In admin panel, go to "Manage Sessions"
2. **Expected Result**: Should see all sessions in a table format
3. Click "View" on any session
4. **Expected Result**: Should show session details

#### Test Case 8: View Customers
1. In admin panel, go to "Customers"
2. **Expected Result**: Should see customer cards with photos and session info
3. Click "View Details" on any customer
4. **Expected Result**: Should show customer details

### 4. Gallery Testing

#### Test Case 9: Gallery Watermarks
1. Go to "Gallery" section on main website
2. **Expected Result**: All photos should have "PhotoPrint Pro" watermarks
3. Try to screenshot a photo
4. **Expected Result**: Watermark should still be visible in screenshot

#### Test Case 10: Gallery Interaction
1. Hover over gallery photos
2. **Expected Result**: Should show overlay with "Find This Photo" button
3. Click "Find This Photo"
4. **Expected Result**: Should scroll to search section

### 5. Responsive Design Testing

#### Test Case 11: Mobile Testing
1. Open website on mobile device or use browser dev tools
2. Test navigation menu (hamburger menu)
3. Test search functionality on mobile
4. **Expected Result**: Should work smoothly on mobile

#### Test Case 12: Tablet Testing
1. Test on tablet-sized screen
2. **Expected Result**: Layout should adapt appropriately

## 🔍 Detailed Mock Data Structure

### Session Data Format
```javascript
{
    id: 'SESS001',
    customerName: 'John Smith',
    email: 'john@example.com',
    photos: 6,
    date: '2024-12-15',
    status: 'active',
    photosList: [
        {
            id: 'PHOTO001',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            title: 'Professional Portrait 1',
            price: 9.99
        },
        // ... more photos
    ]
}
```

### Photo Data Format
```javascript
{
    id: 'PHOTO001',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    title: 'Professional Portrait 1',
    price: 9.99
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Search Not Working
- **Cause**: JavaScript not loaded properly
- **Solution**: Check browser console for errors, ensure all files are in the same directory

### Issue 2: Photos Not Loading
- **Cause**: Image URLs might be blocked or slow
- **Solution**: Check internet connection, images are from Unsplash CDN

### Issue 3: Admin Panel Not Working
- **Cause**: File paths might be incorrect
- **Solution**: Ensure `admin.html`, `admin-styles.css`, and `admin-script.js` are in the same directory

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🎯 Business Flow Testing

### Complete Customer Journey
1. **Customer gets photos taken** → Admin uploads photos via admin panel
2. **Customer receives Session ID** → Admin provides Session ID to customer
3. **Customer searches for photos** → Uses Session ID or email on main website
4. **Customer sees watermarked previews** → All photos have watermarks
5. **Customer purchases photos** → Gets clean, watermark-free downloads
6. **Customer shares on social media** → Clean photos ready for posting

### Admin Workflow
1. **Take photos** → Professional photo session
2. **Upload to system** → Use admin panel to upload photos
3. **Provide Session ID** → Give customer their unique Session ID
4. **Monitor sales** → Track purchases through admin dashboard

## 🔐 Security Features Tested

- ✅ Watermarked previews (can't be used without purchase)
- ✅ Session ID validation
- ✅ Email validation
- ✅ Purchase confirmation
- ✅ Form validation

## 📊 Performance Testing

- ✅ Fast loading times
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Mobile optimization

## 🎨 UI/UX Testing

- ✅ Modern, professional design
- ✅ Intuitive navigation
- ✅ Clear call-to-action buttons
- ✅ Consistent color scheme
- ✅ Accessible design

This testing guide ensures all functionality works as expected for both customers and administrators. 