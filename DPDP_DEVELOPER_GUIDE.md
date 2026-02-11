# DPDP Compliance - Developer Implementation Guide

## Quick Reference Guide for DPDP Features

This guide helps developers understand and use the DPDP compliance features implemented in Aparajita.

---

## 1. CONSENT MANAGEMENT

### Component: `PrivacyConsentModal.tsx`

**Purpose:** Capture explicit user consent before data collection

**Features:**
- Modal dialog with privacy information
- Checkbox for explicit acceptance
- One-time display per user
- Consent timestamp recording

**Usage in AuthScreen:**
```typescript
import PrivacyConsentModal from './PrivacyConsentModal';

const [showPrivacyConsent, setShowPrivacyConsent] = useState(true);

// In JSX:
{showPrivacyConsent && (
  <PrivacyConsentModal 
    onConsentAccepted={() => setShowPrivacyConsent(false)} 
  />
)}
```

**User Flow:**
1. User opens app
2. Consent modal appears (if not already accepted)
3. User reads privacy information
4. User checks acceptance box
5. User clicks "Accept & Continue"
6. Consent recorded, modal closes

**Stored Data:**
```json
{
  "aparajita_consent": {
    "accepted": true,
    "timestamp": "2026-02-11T10:30:00Z",
    "version": "1.0",
    "consentType": "explicit",
    "dpdpCompliant": true
  }
}
```

---

## 2. DATA ENCRYPTION

### Service: `encryptionService.ts`

**Purpose:** Encrypt/decrypt sensitive data for secure storage

**Key Functions:**

#### A. Encrypt Data
```typescript
import { encryptData } from '../services/encryptionService';

const userData = { username: 'Jane', age: 25 };
const encrypted = encryptData(userData);
// Returns: "encrypted_base64_string"
```

#### B. Decrypt Data
```typescript
import { decryptData } from '../services/encryptionService';

const encrypted = localStorage.getItem('user_data');
const decrypted = decryptData(encrypted);
// Returns: original data object
```

#### C. Encrypted localStorage (Recommended)
```typescript
import { encryptedLocalStorage } from '../services/encryptionService';

// Store encrypted data
encryptedLocalStorage.setItem('aparajita_user', userData);

// Retrieve decrypted data
const user = encryptedLocalStorage.getItem('aparajita_user');

// Remove data
encryptedLocalStorage.removeItem('aparajita_user');

// Clear all data
encryptedLocalStorage.clear();
```

**Protected Data Types:**
- User profiles
- Emergency contacts
- Location history
- Safe exit configurations
- Community posts (future)
- Activity logs (future)

**Security Note:**
For production, upgrade to production-grade encryption library:
```bash
npm install crypto-js
```

---

## 3. USER DATA MANAGEMENT

### Component: `PrivacyDataManager.tsx`

**Purpose:** Provide user rights portal for data access, correction, and deletion

**Features:**
- 📋 **Your Rights** tab: Access, correction, erasure, portability
- 📧 **File Grievance** tab: Report privacy concerns
- ⏱️ **Data Retention** tab: View retention schedules

**Usage in App:**
```typescript
import PrivacyDataManager from './PrivacyDataManager';
import { useState } from 'react';

const [showPrivacy, setShowPrivacy] = useState(false);

{showPrivacy && (
  <PrivacyDataManager 
    onClose={() => setShowPrivacy(false)}
    userName={currentUser?.username}
  />
)}
```

**Typical Integration (Header Component):**
```typescript
<button onClick={() => setShowPrivacyManager(true)}>
  <Lock size={18} /> Privacy Settings
</button>
```

### User Rights Implementation:

#### 1. Right to Access (Download Data)
```typescript
import { exportUserDataAsFile } from '../services/encryptionService';

// User clicks "Download My Data" button
exportUserDataAsFile();
// Downloaded file: aparajita-user-data-[timestamp].json
```

**Exported Format:**
```json
{
  "userProfile": {...},
  "emergencyContacts": [...],
  "safeExitConfig": {...},
  "exportDate": "2026-02-11T10:30:00Z",
  "dpdpCompliant": true
}
```

#### 2. Right to Correction
Users edit profile directly in Dashboard:
- Settings → Profile → Edit Details
- Users can update: username, age, email
- Changes saved encrypted

#### 3. Right to Erasure (Delete Account)
```typescript
import { deleteAllUserData } from '../services/encryptionService';

// User confirms deletion
const success = deleteAllUserData();

if (success) {
  // All data deleted, user redirected
  window.location.href = '/';
}
```

**Deleted Data Keys:**
- aparajita_user
- aparajita_contacts
- aparajita_safe_exit
- aparajita_consent
- aparajita_posts
- aparajita_location_history
- aparajita_sos_records

**Audit Record Created:**
```json
{
  "aparajita_deletion_record": {
    "deletionDate": "2026-02-11T10:30:00Z",
    "reason": "User requested data erasure under DPDP Act Section 3.3",
    "dataDeleted": true
  }
}
```

#### 4. Right to Data Portability
Same as "Right to Access" - download as JSON and import elsewhere

---

## 4. USER RIGHTS ACCESS

### Getting User Data Programmatically
```typescript
import { getAllUserData } from '../services/encryptionService';

const allData = getAllUserData();
console.log(allData.userProfile);
console.log(allData.emergencyContacts);
console.log(allData.safeExitConfig);
```

### Checking Retention Info
```typescript
import { getDataRetentionInfo } from '../services/encryptionService';

const retention = getDataRetentionInfo();
console.log(retention.userProfile); 
// "Active account duration + 90 days after inactivity"
```

---

## 5. CONSENT TRACKING

### Check if User Has Consented
```typescript
import { hasUserConsent } from '../services/encryptionService';

if (!hasUserConsent()) {
  // Show consent modal
  setShowConsent(true);
}
```

### Record Consent Programmatically
```typescript
import { recordUserConsent } from '../services/encryptionService';

recordUserConsent({
  acceptedAt: new Date().toISOString(),
  ipAddress: 'xxx.xxx.xxx.xxx',
  method: 'in-app'
});
```

### Retrieve Consent Record
```typescript
const consent = JSON.parse(localStorage.getItem('aparajita_consent'));
console.log(consent.timestamp); // When consent was given
console.log(consent.version);   // Policy version
```

---

## 6. GRIEVANCE FILING

### Component: `PrivacyDataManager.tsx` → "File Grievance" Tab

**Grievance Form Fields:**
- Type: Select from predefined options
- Email: Respondent's email
- Description: Detailed grievance text

**Types of Grievances:**
- Privacy concern
- Data breach report
- Consent related issue
- Access request denied
- Delayed response
- Other

**Backend Integration (Future):**
```typescript
const submitGrievance = async (grievanceData) => {
  const response = await fetch(
    'https://api.aparajita.com/grievances',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...grievanceData,
        referenceId: `APARAJITA-GRV-${Date.now()}`,
        timestamp: new Date().toISOString()
      })
    }
  );
  return response.json();
};
```

**Grievance Reference Format:**
- Pattern: `APARAJITA-GRV-[TIMESTAMP]`
- Example: `APARAJITA-GRV-1707612000000`
- Users can track using this ID

---

## 7. HEADER INTEGRATION

### Updated Header Component
```typescript
import { Lock } from 'lucide-react';
import PrivacyDataManager from './PrivacyDataManager';

<button
  onClick={() => setShowPrivacyManager(true)}
  title="Privacy & Data Rights"
  className="... lock icon button"
>
  <Lock size={18} />
</button>
```

**What Users See:**
- Lock icon in top right of header
- Easily accessible from any page
- Opens privacy management portal

---

## 8. DATA FLOW IN APPLICATION

### Signup/Authentication Flow
```
User Opens App
    ↓
Privacy Consent Modal Appears
    ↓
User Accepts Consent
    ↓
Consent Data Encrypted & Stored
    ↓
Auth Screen Shown
    ↓
User Logs In
    ↓
Encrypted User Data Stored
    ↓
Dashboard Accessible
```

### Daily Usage with Encryption
```
User Interaction
    ↓
Data Collection (location, settings, etc.)
    ↓
Encryption Service Encrypts Data
    ↓
Encrypted Data Stored in localStorage
    ↓
Data Retrieve Triggers Decryption
    ↓
User Sees Decrypted Data
```

### Data Rights Access Flow
```
User Clicks Privacy Settings (Lock Icon)
    ↓
PrivacyDataManager Component Opens
    ↓
User Selects Rights Tab
    ↓
Download → exportUserDataAsFile()
    ↓
Delete → deleteAllUserData()
    ↓
With Confirmation Dialogs
```

---

## 9. STORAGE LOCATION REFERENCE

### All Data Storage Keys

| Key | Purpose | Encrypted | Retention |
|-----|---------|-----------|-----------|
| `aparajita_user` | User profile | ✅ Yes | 90 days after logout |
| `aparajita_contacts` | Emergency contacts | ✅ Yes | Active account |
| `aparajita_safe_exit` | Safe exit config | ✅ Yes | Active account |
| `aparajita_consent` | Consent record | ⚠️ No* | 3 years |
| `aparajita_posts` | Community posts | ✅ Yes | Account + 30 days |
| `aparajita_deletion_record` | Deletion audit | ⚠️ No* | 1 year |
| `aparajita_sos_records` | Emergency logs | ✅ Yes | 1 year |

*Consent and deletion records not encrypted to maintain audit integrity

---

## 10. API INTEGRATION NOTES

### Gemini API (Lawful Processor)
```typescript
// In geminiService.ts
export async function getLegalRights(query: string) {
  const response = await fetch(
    'https://api.gemini.google.com/...',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query, // Only query sent, no personal data
        // location, user_id, email NOT sent
      })
    }
  );
  // Response: AI-generated legal information
}
```

**Data NOT Shared with Gemini API:**
- User personal profile
- Location coordinates
- Emergency contacts
- Consent records
- Deletion history

---

## 11. TESTING DPDP COMPLIANCE

### Test Checklist

#### Consent
- [ ] Privacy modal appears on first use
- [ ] Modal cannot be bypassed
- [ ] Consent checkbox required
- [ ] Consent recorded in localStorage
- [ ] Modal doesn't appear on subsequent visits

#### Encryption
- [ ] User data stored encrypted
- [ ] Decryption works correctly
- [ ] Data unreadable in raw localStorage
- [ ] Encryption/decryption functions work

#### User Rights
- [ ] User can download all data
- [ ] Export format is valid JSON
- [ ] Data includes all fields
- [ ] Update profile works
- [ ] Delete account removes all data

#### Grievance
- [ ] Form submits without errors
- [ ] Reference ID generated
- [ ] Email field validates
- [ ] Description required
- [ ] Type selection works

#### Privacy Access
- [ ] Lock icon appears in header
- [ ] Privacy manager opens
- [ ] All tabs accessible
- [ ] Close button works

---

## 12. COMMON ISSUES & FIXES

### Issue: Encryption errors
**Solution:** Check encryptionService.ts has correct encoding
```typescript
const encrypted = btoa(encrypted); // Base64 encoding
```

### Issue: Consent modal infinite loop
**Solution:** Ensure hasUserConsent() checks localStorage
```typescript
if (!localStorage.getItem('aparajita_consent')) {
  showModal = true;
}
```

### Issue: Data not persisting
**Solution:** Use encryptedLocalStorage instead of localStorage
```typescript
// Wrong:
localStorage.setItem('aparajita_user', userData);

// Correct:
encryptedLocalStorage.setItem('aparajita_user', userData);
```

---

## 13. PRODUCTION DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Test all encryption/decryption
- [ ] Verify consent modal displays correctly
- [ ] Test all user rights (access, download, delete)
- [ ] Set up email for grievances (aparajita.grievance@example.com)
- [ ] Designate DPO (aparajita.dpo@example.com)
- [ ] Review privacy policy accuracy
- [ ] Test breach notification mechanism
- [ ] Set up audit logging
- [ ] Configure HTTPS everywhere
- [ ] Plan for security audits
- [ ] Document external processors
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness

---

## 14. REFERENCES

- [DPDP Act 2023](https://www.meity.gov.in/dpdp)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Compliance Documentation](./DPDP_COMPLIANCE.md)
- [Encryption Service](./services/encryptionService.ts)
- [Privacy Data Manager](./components/PrivacyDataManager.tsx)
- [Consent Modal](./components/PrivacyConsentModal.tsx)

---

**Document Version:** 1.0  
**Last Updated:** February 11, 2026  
**Status:** APPROVED FOR DEVELOPERS
