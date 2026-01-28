# Authentication Manual Test Plan

## Test Environment
- **Local Server**: http://localhost:3001
- **Database**: PostgreSQL on port 5433
- **Test Date**: 2025-11-13

---

## Phase 2 Testing: Registration & Login

### Test 1: Registration Form - Password Strength Indicator

**Objective**: Verify password strength indicator works correctly

**Steps**:
1. Navigate to http://localhost:3001/register
2. Focus on the password field
3. Test different password strengths:

| Password | Expected Strength | Expected Color |
|----------|------------------|----------------|
| `abc` | Very Weak | Red |
| `abcd1234` | Weak | Orange |
| `Abcd1234` | Fair | Yellow |
| `Abcd1234!` | Good | Light Green |
| `Abcd1234!@#$` | Strong | Green |

**Expected Result**:
- ✅ Strength indicator appears below password field
- ✅ Color changes based on password complexity
- ✅ Helpful hint text appears
- ✅ Strong passwords show "✓ Strong password" message

---

### Test 2: Registration Form - Field Validation

**Objective**: Verify form validation works correctly

#### Test 2a: Empty Form Submission
**Steps**:
1. Navigate to http://localhost:3001/register
2. Click "Create Account" without filling any fields
3. Observe validation errors

**Expected Result**:
- ✅ "First name must be at least 2 characters" error appears
- ✅ "Last name must be at least 2 characters" error appears
- ✅ "Invalid email address" error appears
- ✅ "Password must be at least 8 characters" error appears
- ✅ Form does not submit

#### Test 2b: Invalid Email Format
**Steps**:
1. Fill in first name: `John`
2. Fill in last name: `Doe`
3. Fill in email: `invalid-email` (no @ symbol)
4. Fill in password: `Test1234!`
5. Fill in confirm password: `Test1234!`
6. Click "Create Account"

**Expected Result**:
- ✅ "Invalid email address" error appears
- ✅ Form does not submit

#### Test 2c: Password Mismatch
**Steps**:
1. Fill in first name: `John`
2. Fill in last name: `Doe`
3. Fill in email: `john.doe@example.com`
4. Fill in password: `Test1234!`
5. Fill in confirm password: `DifferentPassword123!`
6. Click "Create Account"

**Expected Result**:
- ✅ "Passwords don't match" error appears under confirm password field
- ✅ Form does not submit

#### Test 2d: Weak Password
**Steps**:
1. Fill in first name: `John`
2. Fill in last name: `Doe`
3. Fill in email: `john.doe@example.com`
4. Fill in password: `weak` (no uppercase, no numbers)
5. Tab out of password field

**Expected Result**:
- ✅ "Password must contain at least one uppercase letter" error
- ✅ "Password must contain at least one number" error
- ✅ Password strength shows "Very Weak" with red color

#### Test 2e: WhatsApp Number Validation (Optional Field)
**Steps**:
1. Fill in required fields correctly
2. Fill in WhatsApp number: `invalid-phone`
3. Click "Create Account"

**Expected Result**:
- ✅ "Invalid phone number format (use +1234567890)" error appears
- ✅ Form does not submit

**Steps**:
1. Clear WhatsApp number field
2. Click "Create Account"

**Expected Result**:
- ✅ Form submits successfully (field is optional)

---

### Test 3: Registration Form - Password Visibility Toggle

**Objective**: Verify password visibility toggles work

**Steps**:
1. Navigate to http://localhost:3001/register
2. Type password: `Test1234!`
3. Observe password is masked (••••••••)
4. Click eye icon next to password field
5. Observe password is now visible: `Test1234!`
6. Click eye-off icon
7. Observe password is masked again

**Repeat for Confirm Password field**

**Expected Result**:
- ✅ Password field toggles between text and password type
- ✅ Confirm password field toggles independently
- ✅ Eye icon changes to eye-off icon when visible
- ✅ Both fields work correctly

---

### Test 4: Registration Form - Successful Registration

**Objective**: Verify user can register successfully and is auto-logged in

**Steps**:
1. Navigate to http://localhost:3001/register
2. Fill in form with valid data:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe.test@example.com` (use unique email)
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - WhatsApp: `+639171234567` (optional)
3. Check "I agree to the Terms of Service and Privacy Policy" checkbox
4. Click "Create Account"

**Expected Result**:
- ✅ "Creating account..." loading state appears
- ✅ Submit button is disabled during submission
- ✅ Toast notification: "Account created successfully!" appears
- ✅ User is auto-logged in
- ✅ Redirected to http://localhost:3001/dashboard
- ✅ User data is visible in dashboard (name, etc.)

**Verification in Database**:
1. Open Prisma Studio: http://localhost:5555
2. Navigate to `users` table
3. Find the new user record

**Expected Database Record**:
- ✅ Email: `john.doe.test@example.com`
- ✅ First Name: `John`
- ✅ Last Name: `Doe`
- ✅ Password Hash: (bcrypt hash, not plain text)
- ✅ WhatsApp Number: `+639171234567`
- ✅ Role: `MEMBER` (default)
- ✅ Is Active: `true`
- ✅ Created At: (current timestamp)

---

### Test 5: Registration Form - Duplicate Email

**Objective**: Verify duplicate email handling

**Steps**:
1. Navigate to http://localhost:3001/register
2. Fill in form with email that already exists: `john.doe.test@example.com`
3. Fill in all other fields correctly
4. Click "Create Account"

**Expected Result**:
- ✅ Toast error: "Email already registered" appears
- ✅ User is NOT redirected
- ✅ User can correct email and retry

---

### Test 6: Registration Form - UI/UX Elements

**Objective**: Verify UI elements are present and functional

**Checks**:
- ✅ Page title: "Create an account"
- ✅ Subtitle: "Get started with Ubhaya Supply Chain"
- ✅ All form labels are visible
- ✅ All form fields have proper placeholders
- ✅ Terms checkbox is required
- ✅ "Terms of Service" link is clickable
- ✅ "Privacy Policy" link is clickable
- ✅ "Already have an account? Sign in" link works
- ✅ Clicking "Sign in" redirects to /login
- ✅ Form has proper white background with shadow
- ✅ Dark mode works correctly (if enabled)

---

### Test 7: Login Form - Successful Login

**Objective**: Verify registered user can login

**Steps**:
1. Navigate to http://localhost:3001/login
2. Fill in email: `john.doe.test@example.com`
3. Fill in password: `SecurePass123!`
4. Click "Sign In"

**Expected Result**:
- ✅ "Signing in..." loading state appears
- ✅ Submit button is disabled during submission
- ✅ Redirected to /dashboard
- ✅ User is logged in
- ✅ User name appears in dashboard
- ✅ Last login timestamp updated in database

---

### Test 8: Login Form - Invalid Credentials

**Objective**: Verify login fails with wrong credentials

#### Test 8a: Wrong Password
**Steps**:
1. Navigate to http://localhost:3001/login
2. Fill in email: `john.doe.test@example.com`
3. Fill in password: `WrongPassword123!`
4. Click "Sign In"

**Expected Result**:
- ✅ Toast error: "Invalid credentials" appears
- ✅ User is NOT logged in
- ✅ Stays on login page

#### Test 8b: Non-existent Email
**Steps**:
1. Navigate to http://localhost:3001/login
2. Fill in email: `nonexistent@example.com`
3. Fill in password: `AnyPassword123!`
4. Click "Sign In"

**Expected Result**:
- ✅ Toast error: "Invalid credentials" appears
- ✅ User is NOT logged in

---

### Test 9: Session Persistence

**Objective**: Verify user session persists across page refreshes

**Steps**:
1. Login as test user (john.doe.test@example.com)
2. Verify redirect to /dashboard
3. Refresh the page (F5 or Cmd+R)
4. Observe dashboard still loads

**Expected Result**:
- ✅ User remains logged in after refresh
- ✅ No redirect to login page
- ✅ Dashboard data loads correctly

**Steps**:
1. Close browser tab
2. Open new tab
3. Navigate to http://localhost:3001/dashboard

**Expected Result**:
- ✅ User is still logged in (session persists)
- ✅ Dashboard loads without login prompt

---

### Test 10: Protected Routes

**Objective**: Verify unauthenticated users cannot access dashboard

**Steps**:
1. Logout if logged in
2. Directly navigate to http://localhost:3001/dashboard

**Expected Result**:
- ✅ Redirected to /login
- ✅ Cannot access dashboard without authentication

---

### Test 11: Logout Functionality

**Objective**: Verify user can logout successfully

**Steps**:
1. Login as test user
2. Navigate to /dashboard
3. Click logout button (user menu or logout link)
4. Observe redirect

**Expected Result**:
- ✅ User is logged out
- ✅ Redirected to /login or homepage
- ✅ Session is destroyed
- ✅ Accessing /dashboard redirects to /login

---

### Test 12: Responsive Design

**Objective**: Verify registration/login forms work on mobile

**Test at Different Viewports**:

#### Desktop (1920x1080)
- ✅ Form is centered
- ✅ All fields are visible
- ✅ Password strength indicator is readable

#### Tablet (768x1024)
- ✅ Form adapts to smaller width
- ✅ All fields remain usable
- ✅ No horizontal scroll

#### Mobile (375x667)
- ✅ Form stacks vertically
- ✅ First name/last name in single column
- ✅ All fields are touchable
- ✅ Password visibility toggles work on mobile
- ✅ Virtual keyboard doesn't obscure fields

---

### Test 13: Accessibility

**Objective**: Verify forms are keyboard accessible

**Steps**:
1. Navigate to /register using only keyboard
2. Tab through all form fields
3. Fill in form using only keyboard
4. Submit using Enter key

**Expected Result**:
- ✅ All fields are reachable via Tab
- ✅ Focus indicators are visible
- ✅ Tab order is logical
- ✅ Form can be submitted with Enter
- ✅ Error messages are announced (screen reader)

---

### Test 14: Dark Mode

**Objective**: Verify forms work in dark mode

**Steps**:
1. Enable dark mode (system preference or toggle)
2. Navigate to /register
3. Observe color scheme

**Expected Result**:
- ✅ Background uses dark colors
- ✅ Text is readable (light on dark)
- ✅ Form fields have proper contrast
- ✅ Password strength colors are visible
- ✅ All elements follow dark theme

---

## Performance Checks

### Console Errors
- ✅ No console errors on page load
- ✅ No console errors during form interaction
- ✅ No console errors on submit
- ✅ No hydration errors

### Network Requests
- ✅ Registration POST to /api/auth/register returns 201
- ✅ Login POST to /api/auth/[...nextauth] succeeds
- ✅ No unnecessary API calls
- ✅ Proper error responses for failed requests

### Loading States
- ✅ Submit button shows loading spinner during submission
- ✅ Button is disabled to prevent double-submit
- ✅ Loading state clears on success/error

---

## Security Checks

### Password Storage
- ✅ Passwords are hashed with bcrypt (NOT stored as plain text)
- ✅ Password hash starts with `$2a$` or `$2b$` in database
- ✅ Original password is NOT visible in database

### Session Security
- ✅ JWT token is httpOnly cookie
- ✅ Token is not accessible via JavaScript
- ✅ Session expires after 30 days (check JWT payload)

### Input Sanitization
- ✅ Email is converted to lowercase
- ✅ Names are trimmed of whitespace
- ✅ XSS attempts are blocked (try `<script>alert('xss')</script>` in name)

---

## Test Summary

| Category | Test | Status |
|----------|------|--------|
| **Password Strength** | Visual indicator works | ⏳ Pending |
| **Validation** | Empty form blocked | ⏳ Pending |
| **Validation** | Invalid email blocked | ⏳ Pending |
| **Validation** | Password mismatch blocked | ⏳ Pending |
| **Validation** | Weak password warning | ⏳ Pending |
| **Validation** | Optional WhatsApp field | ⏳ Pending |
| **UI** | Password visibility toggle | ⏳ Pending |
| **Registration** | Successful account creation | ⏳ Pending |
| **Registration** | Auto-login after register | ⏳ Pending |
| **Registration** | Duplicate email handling | ⏳ Pending |
| **Login** | Valid credentials work | ⏳ Pending |
| **Login** | Invalid credentials blocked | ⏳ Pending |
| **Session** | Session persists on refresh | ⏳ Pending |
| **Routes** | Protected routes redirect | ⏳ Pending |
| **Logout** | User can logout | ⏳ Pending |
| **Responsive** | Works on mobile | ⏳ Pending |
| **Accessibility** | Keyboard navigation | ⏳ Pending |
| **Dark Mode** | Dark theme support | ⏳ Pending |
| **Performance** | No console errors | ⏳ Pending |
| **Security** | Passwords hashed | ⏳ Pending |

---

## Quick Test Commands

### Start Services
```bash
# Terminal 1: Start PostgreSQL
docker-compose up

# Terminal 2: Start Next.js dev server
npm run dev

# Terminal 3: Open Prisma Studio
npx prisma studio
```

### Access Points
- **Registration**: http://localhost:3001/register
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/dashboard
- **Prisma Studio**: http://localhost:5555

### Database Queries
```bash
# Check user count
npx prisma studio
# Navigate to 'users' table

# Or use psql:
docker exec -it ubhaya_postgres psql -U ubhaya_user -d ubhaya_db
SELECT COUNT(*) FROM users;
SELECT * FROM users WHERE email = 'john.doe.test@example.com';
```

---

## Notes for Testers

1. **Use unique emails** for each test run to avoid duplicate email errors
2. **Clear cookies** between tests if testing session behavior
3. **Check Prisma Studio** to verify database changes
4. **Monitor console** for any JavaScript errors
5. **Test in multiple browsers** (Chrome, Firefox, Safari)
6. **Test with browser dev tools** open to see network requests

---

## Known Issues

*None identified yet - to be updated after testing*

---

## Next Steps After Testing

- [ ] Fix any bugs found during testing
- [ ] Update password strength thresholds if needed
- [ ] Add rate limiting to prevent spam registrations
- [ ] Implement email verification (Phase 3)
- [ ] Add "Remember Me" checkbox (Phase 3)
- [ ] Create forgot password flow (Phase 3)
