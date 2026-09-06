# Troubleshooting Guide - Visioner Virtual Academy

## 🔴 Student Can't Login

### Issue: "Student ID not found"

**Cause:** Credentials not saved to Supabase database

**Solutions:**

1. **Check Supabase Connection**
   - Verify `.env.local` has correct Supabase URL and key
   - Test connection in browser console:
   ```javascript
   const { supabase } = await import('/lib/supabase');
   const { data } = await supabase.from('student_accounts').select('count');
   console.log(data);
   ```

2. **Verify Credentials Exist**
   - Go to Supabase dashboard
   - Open `student_accounts` table
   - Search for student ID (case-insensitive)
   - Confirm `password` field is NOT empty

3. **Regenerate Credentials**
   - Go to owner portal
   - Find student application
   - Click "Regenerate Credentials"
   - Copy new ID and password
   - Send to student

---

### Issue: "Invalid password" Error

**Cause:** Password mismatch (case sensitivity, extra spaces)

**Solutions:**

1. **Password is Case-Insensitive**
   - "John12345" = "john12345" ✅
   - Password comparison removes case differences

2. **Check for Extra Spaces**
   - Password should have no leading/trailing spaces
   - ID format: `VVA-UAE-123456` (hyphens matter)

3. **Reset Password**
   - Owner portal > Student > "Reset Password"
   - New password emailed to student

---

## 🔴 Cross-Device Login Not Working

### Issue: Works on Laptop A, fails on Laptop B

**Root Cause:** Credentials only in browser cache (localStorage), not in cloud

**Why This Happens:**
- Admin generated credentials but didn't use "Generate Credentials" from owner portal
- Manually added to localStorage instead of Supabase
- Browser cache was cleared

**Solutions:**

1. **Check if Credentials in Supabase**
   ```bash
   # In Supabase dashboard:
   SELECT * FROM student_accounts WHERE student_id ILIKE '%YOUR-ID%';
   ```
   - If no results → credentials NOT synced to cloud
   - Follow "Regenerate Credentials" step above

2. **Force Cloud Sync**
   ```javascript
   // In browser console on any page:
   const { forceSyncCloudToLocal } = await import('/lib/database');
   const accounts = await forceSyncCloudToLocal();
   console.log('Synced accounts:', accounts);
   ```

3. **Clear Cache & Retry**
   - On Laptop B: Clear browser cache
   - Try login again (will fetch fresh from cloud)

---

### Issue: "Using Local Cache" Warning During Login

**Cause:** Supabase connection unavailable (network error, misconfigured key, etc.)

**Solutions:**

1. **Check Environment Variables**
   ```bash
   # In .env.local, verify:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # NOT localhost
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...  # Full key
   ```

2. **Check Supabase Status**
   - Visit [Supabase Status](https://status.supabase.com)
   - Verify your region is operational

3. **Test Network Connection**
   ```javascript
   // Browser console:
   const response = await fetch('https://your-project.supabase.co/rest/v1/');
   console.log(response.status);  // Should be 401 or 200, NOT error
   ```

4. **Regenerate Anon Key**
   - Supabase dashboard > Settings > API > Regenerate
   - Update `.env.local`
   - Redeploy

---

## 🔴 Admissions Portal Issues

### Issue: Can't Submit Application

**Cause:** Supabase `applications` table missing or misconfigured

**Solution:**
```sql
-- Create table in Supabase SQL editor:
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'Under Review',
  student_name TEXT NOT NULL,
  student_email TEXT,
  country_of_residence TEXT,
  -- ... other fields
);
```

---

## 🟡 Performance Issues

### Issue: Login Takes 5+ Seconds

**Cause:** Fetching all accounts from Supabase (slow query)

**Solution:**
```sql
-- Add index to Supabase:
CREATE INDEX idx_student_id ON student_accounts(student_id);
CREATE INDEX idx_created_at ON student_accounts(created_at DESC);
```

---

## 🟢 Testing Commands

### Generate Test Credentials
```javascript
const { generateStudentCredentials } = await import('/app/admissions/generate-credentials');
const result = await generateStudentCredentials({
  id: 'TEST-APP-001',
  studentName: 'Test Student',
  studentEmail: 'test@example.com',
  countryOfResidence: 'UAE',
});
console.log(result);
// Output: { studentId: 'VVA-UAE-123456', studentPassword: 'Test12345', ... }
```

### Verify Account Exists
```javascript
const { findStudentAccount } = await import('/lib/database');
const account = await findStudentAccount('VVA-UAE-123456');
console.log(account);
// Should show: { studentId: 'VVAUAE123456', password: 'Test12345', ... }
```

### Check Cloud Sync Status
```javascript
const { getStudentAccountsFromCloud } = await import('/lib/database');
const all = await getStudentAccountsFromCloud();
console.log(`${all.length} accounts synced from cloud`);
```

---

## 📞 Still Need Help?

**Contact:** visionervirtualacademy@gmail.com

**Include:**
- Student ID
- Error message (exact text)
- Device/browser used
- Steps you took
- Screenshot of error
