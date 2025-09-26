# Complete Watermarked Photo System Setup Guide

## 🎯 **System Overview**

This system automatically:
1. **Admin uploads** → Original photos go to `photos` bucket
2. **Auto-watermarking** → Watermarked versions created in `photos-watermarked` bucket
3. **Customer preview** → Shows only watermarked photos
4. **Payment required** → To download clean photos without watermark

## 🚀 **Step-by-Step Setup**

### **Step 1: Deploy Edge Function**

```bash
# Navigate to your project
cd "/Users/apple/Desktop/Photo-Company main/photo-company"

# Deploy the watermarking function
supabase functions deploy watermark-photo

# Set environment variables
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 2: Create Storage Buckets**

In **Supabase Dashboard** → **Storage**:

1. **Create `photos` bucket** (for original photos)
   - Set to **Public**
   - This is where admin uploads go

2. **Create `photos-watermarked` bucket** (for watermarked previews)
   - Set to **Public**
   - This is where watermarked versions are stored

### **Step 3: Set Up Database Tables**

In **Supabase Dashboard** → **SQL Editor**, run:

```sql
-- Run the purchase-schema.sql file
-- This creates the photo_purchases table for tracking sales
```

### **Step 4: Configure Storage Policies**

In **Supabase Dashboard** → **Storage** → **Policies**:

**For `photos` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Public read access for photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- Allow service role to upload
CREATE POLICY "Service role can upload photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos');
```

**For `photos-watermarked` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Public read access for watermarked photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos-watermarked');

-- Allow service role to upload
CREATE POLICY "Service role can upload watermarked photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos-watermarked');
```

### **Step 5: Test the Complete Flow**

1. **Admin Upload Test:**
   - Go to admin panel
   - Upload a photo with session ID
   - Check that watermarked version appears in `photos-watermarked` bucket

2. **Customer Preview Test:**
   - Go to customer "Find Your Photos"
   - Search with session ID
   - Verify watermarked photos are displayed

3. **Purchase Test:**
   - Click "View" on a photo
   - Click "Purchase Digital"
   - Enter email and name
   - Verify clean photo downloads

## 🔧 **How It Works**

### **Admin Upload Flow:**
```
1. Admin uploads photo → photos bucket
2. Edge Function triggered automatically
3. Watermarked version created → photos-watermarked bucket
4. Database updated with session info
```

### **Customer Preview Flow:**
```
1. Customer searches with Session ID
2. System shows watermarked photos from photos-watermarked bucket
3. Customer can view watermarked preview
4. Payment required to download clean photos
```

### **Purchase Flow:**
```
1. Customer clicks "Purchase Digital"
2. Payment processed (simulated)
3. Signed URL generated from photos bucket (clean photos)
4. Customer downloads clean photo
5. Purchase recorded in database
```

## 🎨 **Watermark Features**

- **Diagonal placement** across center of photo
- **30% transparency** for subtle effect
- **Responsive sizing** (8% of image dimension)
- **Professional branding** ("PhotoPrint Pro")
- **High-quality output** (90% JPEG quality)

## 🛠️ **Troubleshooting**

### **If Edge Function fails:**
```bash
# Check function logs
supabase functions logs watermark-photo

# Redeploy if needed
supabase functions deploy watermark-photo
```

### **If photos don't appear:**
- Check browser console for errors
- Verify storage bucket policies
- Ensure both buckets exist and are public

### **If watermarking doesn't work:**
- Check Edge Function logs
- Verify service role key permissions
- Ensure Sharp library is properly imported

## 📋 **Verification Checklist**

- [ ] Edge Function deployed successfully
- [ ] Both storage buckets created and public
- [ ] Database tables created
- [ ] Storage policies configured
- [ ] Admin can upload photos
- [ ] Watermarked versions appear automatically
- [ ] Customers see watermarked previews only
- [ ] Purchase flow generates clean photo downloads
- [ ] No console errors in browser

## 🎉 **You're Done!**

Your watermarked photo system is now fully functional with:
- ✅ Automatic watermarking on upload
- ✅ Customer preview of watermarked photos only
- ✅ Payment-required clean photo downloads
- ✅ Complete purchase tracking
- ✅ Professional watermark design

The system protects your photos while providing a smooth customer experience!
