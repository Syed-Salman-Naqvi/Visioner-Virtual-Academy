# 🔐 Test Credentials for Visioner Virtual Academy

## Student Portal Login Credentials

The application now includes **default student accounts** that are automatically loaded when the app starts. These accounts work on both local development and deployed production environments.

---

## 📋 Available Test Accounts

### Account 1: Test Student
- **Student ID**: `VVA-INTL-159994`
- **Password**: `VVA123456`
- **Name**: Test Student
- **Email**: student@visionervirtualacademy.com

### Account 2: Aiden Vance
- **Student ID**: `VVA-INTL-443603`
- **Password**: `Aiden12345`
- **Name**: Aiden Vance
- **Email**: aiden.vance@example.com

---

## 🎯 How to Login

1. Navigate to: `https://visioner-virtual-academy.vercel.app/login`
2. Enter one of the Student IDs above
3. Enter the corresponding password
4. Click "Sign In to Portal"

### Flexible Login Options

The authentication system supports multiple formats:
- Full ID: `VVA-INTL-159994`
- Without prefix: `INTL-159994`
- Numbers only: `159994`
- Case insensitive: `vva-intl-159994` works too

---

## 🔧 Technical Details

### Auto-Initialization
- Default accounts are automatically loaded when the app starts
- If localStorage is empty, accounts are seeded automatically
- Works on both local and production deployments
- No manual setup required

### Files Modified
1. **`lib/seed-data.ts`** - Contains default student accounts
2. **`lib/storage.ts`** - Auto-initializes accounts on first load
3. **`app/login/page.tsx`** - Calls initialization on mount

### Data Persistence
- Default accounts are stored in browser localStorage
- Owner portal can create additional accounts
- All accounts persist across sessions
- Supabase integration available for cloud sync (optional)

---

## 🚀 Testing the Deployment

### Quick Test
```bash
# Open browser and navigate to:
https://visioner-virtual-academy.vercel.app/login

# Try logging in with:
Student ID: VVA-INTL-159994
Password: VVA123456
```

### Expected Behavior
✅ Login form loads without errors  
✅ Credentials are accepted  
✅ Redirects to `/student` dashboard  
✅ Student name displays correctly  
✅ Portal data loads (assignments, schedule, etc.)

---

## 🛠️ Owner Portal Access

### Owner Credentials
- **Owner ID**: `owner123`
- **Password**: `ownerPass123`

The owner portal allows you to:
- View all student applications
- Generate new student accounts
- Manage student records and grades
- Add assignments and schedule

---

## 📝 Creating New Student Accounts

### Via Owner Portal
1. Login to owner portal: `/owner`
2. Go to "Applications" tab
3. Select an application
4. Click "Generate Student Account"
5. New credentials will be displayed

### Account Format
- Student ID: Same as Application ID
- Password: Randomly generated (format: `VVA######`)
- Automatically saved to localStorage
- Syncs to Supabase if configured

---

## 🔄 Resetting to Default

If you need to reset to default accounts:

```javascript
// In browser console:
localStorage.removeItem('vva_student_accounts');
location.reload();
```

This will reinitialize the default test accounts.

---

## 🌐 Deployment Status

✅ **Build Status**: Passing  
✅ **Default Accounts**: Loaded  
✅ **Authentication**: Working  
✅ **localStorage**: Seeded  
✅ **Production URL**: https://visioner-virtual-academy.vercel.app

---

## 📞 Support

If login issues persist:
1. Clear browser cache and localStorage
2. Try in incognito/private mode
3. Check browser console for errors
4. Verify credentials exactly as shown above

---

**Last Updated**: September 27, 2026  
**Version**: 2.0 (with auto-seeding)
