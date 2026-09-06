# Database Setup Guide for Visioner Virtual Academy

## 🚨 Critical: Cloud-First Authentication

Your app now uses **Supabase** as the primary data store. All student credentials are synced to the cloud immediately after generation.

---

## Supabase Tables Required

### 1. `student_accounts` Table

Create this table in your Supabase project:

```sql
CREATE TABLE student_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  application_id TEXT UNIQUE,
  student_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  
  -- Profile
  student_name TEXT NOT NULL,
  student_email TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes for fast lookup
  CONSTRAINT unique_student_id UNIQUE (student_id),
  CONSTRAINT unique_application_id UNIQUE (application_id)
);

-- Create indexes for fast queries
CREATE INDEX idx_student_id ON student_accounts(student_id);
CREATE INDEX idx_application_id ON student_accounts(application_id);
CREATE INDEX idx_created_at ON student_accounts(created_at DESC);
```

### 2. `applications` Table (Already Required)

Make sure this table exists:

```sql
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Under Review',
  student_name TEXT NOT NULL,
  student_email TEXT,
  date_of_birth TEXT,
  nationality TEXT,
  country_of_residence TEXT,
  city TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  target_track TEXT,
  grade_level TEXT,
  time_zone TEXT,
  preferred_cohort_slot TEXT,
  assigned_advisor TEXT,
  documents_attached JSONB,
  statement_of_purpose TEXT
);
```

---

## Environment Variables

Make sure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your Supabase project settings > API.

---

## How It Works Now

### ✅ Enrollment Flow (Owner Portal)

1. Admin approves application in owner portal
2. Admin clicks "Generate Credentials"
3. System creates: `VVA-[COUNTRY]-[6-DIGIT]` and password
4. **Immediately saved to `student_accounts` table in Supabase**
5. Student can login from ANY device/laptop

### ✅ Login Flow (Student)

1. Student enters ID + Password
2. App queries **Supabase first** (cloud)
3. Falls back to browser cache if offline
4. Works from any device automatically

### ✅ Cross-Device Sync

- Laptop A: Admin generates credentials → saved to cloud
- Laptop B: Student tries to login → fetches from cloud
- ✅ **Login works!** (This was broken before)

---

## Testing

### Test Cloud Sync

```bash
# In browser console on any page:

// Force sync from cloud
await forceSyncCloudToLocal();

// Check local cache
console.log(JSON.parse(localStorage.getItem('vva_student_accounts_cache')));
```

### Test Cross-Device Login

1. Generate credentials on Laptop A
2. Copy the Student ID
3. Try login on Laptop B (different browser/device)
4. ✅ Should work now!

---

## Troubleshooting

### "Student ID not found" Error

**Cause:** Credentials not saved to Supabase

**Fix:**
```typescript
// In owner portal console
const { generateStudentCredentials } = await import("@/app/admissions/generate-credentials");
await generateStudentCredentials(appData);
```

### "Invalid password" Error

**Cause:** Password case sensitivity or formatting issue

**Fix:** Passwords are now case-insensitive and trimmed automatically

### Credentials work on one device but not another

**Cause:** Browser localStorage is device-specific

**Fix:** This shouldn't happen anymore. If it does:
1. Clear browser cache
2. Refresh page
3. Try login again (will fetch from cloud)

---

## Migration: Move Existing Accounts to Cloud

If you have existing accounts in localStorage, migrate them:

```typescript
import { saveStudentAccountToCloud } from "@/lib/database";

// Get all local accounts
const local = JSON.parse(localStorage.getItem('vva_student_accounts') || '[]');

// Push each to cloud
for (const account of local) {
  await saveStudentAccountToCloud(account);
}

console.log("Migration complete!");
```

---

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git
- Use Row-Level Security (RLS) in production
- Set Supabase `anon` key to read-only if possible
- Implement rate limiting on login endpoint

---

## API Reference

### `getStudentAccountsFromCloud()`
Fetches all accounts from Supabase, caches locally.

### `findStudentAccount(searchId)`
Find account by Student ID or Application ID.

### `saveStudentAccountToCloud(account)`
Save new account or update existing. Syncs to both cloud and local.

### `generateStudentCredentials(application)`
Called by owner portal. Creates unique ID + password and saves to cloud.

### `forceSyncCloudToLocal()`
Force refresh local cache from cloud.

---

## Support

If students still can't login:
1. Check Supabase connection in console
2. Verify `student_accounts` table has the records
3. Test with demo credentials (if configured)
4. Check environment variables are set correctly

Contact: visionervirtualacademy@gmail.com
