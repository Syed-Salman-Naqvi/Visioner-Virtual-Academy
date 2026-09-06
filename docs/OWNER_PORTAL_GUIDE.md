# Owner Portal Guide - Generating Student Credentials

## 📋 Overview

The Owner Portal allows you to:
- ✅ Review student applications
- ✅ Generate unique login credentials
- ✅ Sync credentials to cloud database
- ✅ Track student enrollment status

---

## 🔑 Generating Student Credentials

### Step 1: Access Owner Portal
```
URL: https://your-domain.com/owner
Username: (admin login)
Password: (admin password)
```

### Step 2: Find Pending Applications
- Navigate to "Applications" section
- Filter by status: "Under Review"
- Click on student application to open

### Step 3: Generate Credentials

**Option A: Auto-Generate (Recommended)**
```
1. Click "Generate Credentials" button
2. System creates:
   - Student ID: VVA-[COUNTRY]-[6-DIGIT]
   - Password: [FirstName][5-DIGIT]
3. Copy both values
4. ✅ Automatically saved to Supabase
```

**Option B: Manual Generation**
```
1. Enter Student ID: VVA-UAE-123456
2. Enter Password: John12345
3. Click "Save Credentials"
4. ✅ Synced to cloud immediately
```

### Step 4: Send to Student

**Email Template:**
```
Dear [Student Name],

Congratulations! You're approved for enrollment at Visioner Virtual Academy.

Your login credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Student ID:  VVA-UAE-123456
🔐 Password:    John12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Login here: https://your-domain.com/login

⚠️ IMPORTANT:
- Store these credentials securely
- Change password after first login
- Works on ANY device/laptop

Questions? Contact: visionervirtualacademy@gmail.com

Best regards,
Visioner Academy
```

---

## ✅ Verification Checklist

After generating credentials:

- [ ] Student ID format is `VVA-[3-LETTER]-[6-DIGIT]`
- [ ] Password is 8+ characters
- [ ] "✅ Saved to cloud" confirmation appears
- [ ] Supabase shows new record in `student_accounts` table
- [ ] Student can login from different device

---

## 🔧 Troubleshooting: Credentials Not Saving

### Scenario 1: "Failed to save credentials"

**Cause:** Supabase connection error

**Fix:**
1. Check `.env.local` has Supabase URL and key
2. Verify Supabase project is running
3. Try again in 30 seconds
4. If persistent, contact technical support

### Scenario 2: Student Can't Login After Generation

**Cause:** Credentials in local only, not synced to cloud

**Fix:**
1. Go back to student application
2. Click "Force Sync to Cloud"
3. Wait 30 seconds
4. Student tries login again

### Scenario 3: Different ID on Different Devices

**Cause:** Using browser cache instead of cloud database

**Fix:**
1. Ensure credentials were generated via "Generate Credentials" button
2. Check Supabase dashboard for the record
3. If missing: Regenerate using Step 3 above
4. Clear browser cache and try login again

---

## 📊 Credential Format Specifications

### Student ID Format
```
VVA-[COUNTRY_CODE]-[6_DIGITS]

Examples:
✅ VVA-UAE-123456     (Dubai student)
✅ VVA-USA-789012     (US student)
✅ VVA-PAK-456789     (Pakistan student)
✅ VVA-INT-999999     (International)

❌ VVA123456          (Missing country)
❌ VVAUAE123456       (No hyphens)
❌ vva-uae-123456     (Lowercase not allowed in UI)
```

### Password Format
```
[FirstName][RandomDigits]

Examples:
✅ John12345      (8 chars)
✅ Sarah98765     (8 chars)
✅ Muhammad45678  (11 chars)

❌ 12345678       (No name)
❌ J12345         (Too short)
```

---

## 📱 Cross-Device Testing

After generating credentials, test on multiple devices:

### Test 1: Same Browser, Different Device
```
1. Generate credentials on Laptop A
2. Open incognito/private window on Laptop B
3. Go to: https://your-domain.com/login
4. Enter Student ID and Password
5. ✅ Should login successfully
```

### Test 2: Different Browser, Same Device
```
1. Login on Chrome with credentials
2. Logout
3. Open Firefox
4. Go to login page
5. ✅ Should work (using cloud, not local cache)
```

### Test 3: Network Offline
```
1. Login normally to sync cache
2. Turn OFF WiFi/Network
3. Try to login again
4. ⚠️ Will use cached credentials (still works offline!)
5. Turn network back ON
6. ✅ Cloud syncs when connection restored
```

---

## 🔐 Security Best Practices

### For You (Admin):
- [ ] Never share Supabase credentials with students
- [ ] Use strong admin password
- [ ] Enable 2FA on Supabase account
- [ ] Log out after generating credentials
- [ ] Review access logs regularly

### For Students:
- [ ] Change password after first login
- [ ] Never share Student ID or Password
- [ ] Use strong password for account
- [ ] Clear browser cache if device shared

---

## 📞 Support

If credentials won't generate:
1. Check Supabase connection status
2. Verify application data is complete
3. Review browser console for errors
4. Contact: visionervirtualacademy@gmail.com
