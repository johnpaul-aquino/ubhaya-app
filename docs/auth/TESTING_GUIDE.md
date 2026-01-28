# Authentication Testing Guide

Quick reference guide for testing the authentication system.

---

## Prerequisites

1. **Start all services**:
```bash
# Terminal 1: PostgreSQL
docker-compose up

# Terminal 2: Development server
npm run dev

# Terminal 3: Prisma Studio (optional)
npx prisma studio
```

2. **Verify services are running**:
- Dev server: http://localhost:3001
- Prisma Studio: http://localhost:5555
- Database: localhost:5433

---

## Quick Manual Tests

### Test 1: Registration Flow (5 minutes)

1. Open http://localhost:3001/register in your browser
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe.testXXX@example.com` (use unique email)
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - WhatsApp: `+639171234567` (optional)
3. As you type the password, watch the strength indicator update
4. Check the "I agree to terms" checkbox
5. Click "Create Account"
6. Expected result:
   - ✅ Toast notification: "Account created successfully!"
   - ✅ Redirected to /dashboard
   - ✅ You're logged in

### Test 2: Password Strength Indicator (2 minutes)

1. Go to http://localhost:3001/register
2. Click in the password field
3. Type slowly and watch the indicator:

| Password | Expected Indicator |
|----------|-------------------|
| `abc` | Very Weak (red) |
| `abcd1234` | Weak (orange) |
| `Abcd1234` | Fair (yellow) |
| `Abcd1234!` | Good (light green) |
| `Abcd1234!@#$` | Strong (green) |

### Test 3: Validation Errors (3 minutes)

1. Go to http://localhost:3001/register
2. Try to submit empty form
   - ✅ All fields show error messages
3. Fill first name: `A` (too short)
   - ✅ Error: "First name must be at least 2 characters"
4. Fill email: `invalid-email`
   - ✅ Error: "Invalid email address"
5. Fill password: `weak`
   - ✅ Error: "Password must be at least 8 characters"
6. Fill password: `password123` (no uppercase)
   - ✅ Error: "Password must contain at least one uppercase letter"
7. Fill password: `Password` (no numbers)
   - ✅ Error: "Password must contain at least one number"
8. Fill password: `Pass123!`, confirm password: `Different123!`
   - ✅ Error: "Passwords don't match"

### Test 4: Duplicate Email (1 minute)

1. Register a user with email `duplicate@example.com`
2. Try to register again with the same email
   - ✅ Toast error: "Email already registered"

### Test 5: Login Flow (2 minutes)

1. Go to http://localhost:3001/login
2. Fill in credentials from Test 1
3. Click "Sign In"
4. Expected result:
   - ✅ Toast: "Welcome back!"
   - ✅ Redirected to /dashboard

### Test 6: Invalid Login (1 minute)

1. Go to http://localhost:3001/login
2. Enter invalid credentials
3. Click "Sign In"
   - ✅ Toast error: "Invalid email or password"
   - ✅ Stay on login page

### Test 7: Session Persistence (1 minute)

1. After logging in, refresh the page (F5)
   - ✅ Still logged in
   - ✅ Dashboard still loads
2. Close browser tab and reopen http://localhost:3001/dashboard
   - ✅ Still logged in (session persists)

### Test 8: Protected Routes (1 minute)

1. Log out (if logged in)
2. Try to access http://localhost:3001/dashboard
   - ✅ Redirected to /login
   - ✅ Cannot access without authentication

### Test 9: Password Visibility Toggle (30 seconds)

1. Go to http://localhost:3001/register
2. Type password: `TestPass123!`
3. Password should be masked: `••••••••••••`
4. Click the eye icon
   - ✅ Password becomes visible: `TestPass123!`
5. Click eye-off icon
   - ✅ Password masked again

### Test 10: Remember Me (1 minute)

1. Go to http://localhost:3001/login
2. Check "Remember me" checkbox
3. Login
4. Check cookies in browser dev tools
   - ✅ Session cookie created
   - ✅ Cookie has long expiration (30 days)

---

## Database Verification

### Check Created Users

```bash
# Via Prisma Studio
npx prisma studio
# Open http://localhost:5555
# Click on "users" table

# Via psql
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "SELECT id, email, \"firstName\", \"lastName\", role FROM users;"
```

### Verify Password Hashing

```bash
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "SELECT \"passwordHash\" FROM users LIMIT 1;"
```

Expected: Hash should start with `$2b$12$` (bcrypt)

---

## API Testing with curl

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "API",
    "lastName": "Test",
    "email": "api.test@example.com",
    "password": "ApiTest123!",
    "confirmPassword": "ApiTest123!"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "...",
    "email": "api.test@example.com",
    "firstName": "API",
    "lastName": "Test",
    "role": "MEMBER"
  }
}
```

### Test Duplicate Email
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Duplicate",
    "lastName": "Test",
    "email": "api.test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!"
  }'
```

Expected response:
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### Test Validation Errors
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "A",
    "lastName": "B",
    "email": "invalid",
    "password": "weak",
    "confirmPassword": "weak"
  }'
```

Expected: Error message about first validation failure

---

## Browser Testing Checklist

### Registration Page (`/register`)
- [ ] Page loads without errors
- [ ] All form fields are visible
- [ ] Form fields have proper placeholders
- [ ] Password strength indicator appears
- [ ] Password visibility toggle works
- [ ] Validation errors appear inline
- [ ] Submit button shows loading state
- [ ] Toast notifications appear
- [ ] "Already have an account?" link works
- [ ] Dark mode works (if enabled)

### Login Page (`/login`)
- [ ] Page loads without errors
- [ ] Email and password fields visible
- [ ] Password visibility toggle works
- [ ] "Remember me" checkbox works
- [ ] "Forgot password?" link works
- [ ] Submit button shows loading state
- [ ] Toast notifications appear
- [ ] "Don't have an account?" link works
- [ ] Dark mode works (if enabled)

### Dashboard (`/dashboard`)
- [ ] Redirects to /login if not authenticated
- [ ] Loads correctly when authenticated
- [ ] User name displays correctly
- [ ] Logout button works

---

## Console Checks

### Open Browser Dev Tools (F12)

1. **Console tab**: Should see NO red errors
2. **Network tab**: Check API calls
   - POST `/api/auth/register` → 201 (success)
   - POST `/api/auth/register` → 400 (validation error)
3. **Application tab** → Cookies:
   - Should see NextAuth session cookie
   - Cookie should be httpOnly

---

## Performance Checks

### Registration Performance
- Initial page load: < 2 seconds
- Form submission: < 2 seconds (including bcrypt hashing)
- Password hashing time: ~150-250ms
- No layout shifts during load
- Smooth animations

### Login Performance
- Initial page load: < 2 seconds
- Form submission: < 1 second
- No console errors
- Smooth redirect to dashboard

---

## Accessibility Checks

### Keyboard Navigation
1. Press Tab repeatedly on registration page
   - ✅ All fields are reachable
   - ✅ Focus indicators are visible
   - ✅ Tab order is logical (top to bottom)
2. Press Enter on submit button
   - ✅ Form submits
3. Use Shift+Tab to go backwards
   - ✅ Works correctly

### Screen Reader (Optional)
1. Turn on VoiceOver (Mac: Cmd+F5) or NVDA (Windows)
2. Navigate through form
   - ✅ Labels are read correctly
   - ✅ Error messages are announced
   - ✅ Button states are announced

---

## Mobile Testing

### Responsive Design
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Cmd+Shift+M)
3. Test at different sizes:

#### Mobile (375x667)
- [ ] Form fits on screen
- [ ] No horizontal scroll
- [ ] Fields are touchable (not too small)
- [ ] Password toggle button is accessible
- [ ] Virtual keyboard doesn't obscure fields

#### Tablet (768x1024)
- [ ] Form adapts to width
- [ ] Proper spacing maintained
- [ ] All features work

#### Desktop (1920x1080)
- [ ] Form is centered
- [ ] Proper max-width applied
- [ ] No excessive whitespace

---

## Dark Mode Testing

1. Enable dark mode:
   - Mac: System Preferences → General → Appearance → Dark
   - Or use browser extension
2. Reload pages
3. Check:
   - [ ] Background is dark
   - [ ] Text is readable (light on dark)
   - [ ] Form fields have proper contrast
   - [ ] Password strength indicator colors are visible
   - [ ] All buttons are visible
   - [ ] No "flashing" during load

---

## Security Testing

### Password Storage
```bash
# Check that passwords are hashed
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "SELECT \"passwordHash\" FROM users LIMIT 1;"
```
- ✅ Should start with `$2b$12$`
- ✅ Should be 60 characters
- ✅ Should NOT be the plain password

### XSS Protection
1. Try to register with:
   - First Name: `<script>alert('xss')</script>`
   - Email: `test@example.com`
2. Expected:
   - ✅ Script tag is escaped/sanitized
   - ✅ No alert popup appears
   - ✅ Data is stored safely

---

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution**: Dev server automatically uses port 3001

### Issue: Database connection refused
**Solution**:
```bash
docker-compose up
# Wait for "database system is ready to accept connections"
```

### Issue: Prisma error "Can't reach database server"
**Solution**: Check DATABASE_URL in `.env` file

### Issue: CSRF token missing error
**Solution**: This is expected when testing login endpoint with curl. Use browser for login testing.

### Issue: "Email already registered" but I don't see the user
**Solution**: Check Prisma Studio (http://localhost:5555) to verify user exists

---

## Test Data Cleanup

### Delete test users
```bash
# Via Prisma Studio
npx prisma studio
# Select users → Delete

# Via SQL
docker exec ubhaya_postgres psql -U ubhaya_user -d ubhaya_db -c "DELETE FROM users WHERE email LIKE '%test%';"
```

### Reset database (CAUTION: Deletes all data)
```bash
npx prisma migrate reset
```

---

## Success Criteria

**All tests should pass if:**
- ✅ Users can register with valid data
- ✅ Validation prevents invalid data
- ✅ Passwords are hashed in database
- ✅ Users can login with correct credentials
- ✅ Invalid credentials are rejected
- ✅ Sessions persist across refreshes
- ✅ Protected routes redirect to login
- ✅ No console errors
- ✅ Password strength indicator works
- ✅ Forms work on mobile
- ✅ Dark mode works correctly

---

## Automated Test Results

See `test-results.md` for detailed API test results.

**Summary**: 21/21 tests passed (100%)

---

## Next Phase Testing

**Phase 3: Password Reset & Protection**
- Forgot password flow
- Password reset with tokens
- Email verification
- Rate limiting

---

**Last Updated**: 2025-11-13
**Test Coverage**: Phase 2 (Registration & Login)
**Status**: ✅ All tests passing
