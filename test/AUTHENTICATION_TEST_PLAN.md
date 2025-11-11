# Authentication & Team Management - Comprehensive Test Plan

**Project:** Ubhaya Supply Chain Management Platform
**Test Type:** End-to-End Browser Testing with Playwright MCP
**Last Updated:** 2025-11-11

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Phase 1: User Registration](#phase-1-user-registration)
3. [Phase 2: User Login](#phase-2-user-login)
4. [Phase 3: Password Reset](#phase-3-password-reset)
5. [Phase 4: User Profile Management](#phase-4-user-profile-management)
6. [Phase 5: Password Change](#phase-5-password-change)
7. [Phase 6: Team Creation](#phase-6-team-creation)
8. [Phase 7: Team Member Management](#phase-7-team-member-management)
9. [Phase 8: Authorization & Permissions](#phase-8-authorization--permissions)
10. [Phase 9: Navigation & UI](#phase-9-navigation--ui)
11. [Phase 10: Security Tests](#phase-10-security-tests)

---

## Test Environment Setup

### Prerequisites
- [x] PostgreSQL database running (Docker)
- [x] Database migrations applied
- [x] Development server running on http://localhost:3006
- [x] Test user accounts created (see Test Data below)

### Test Data Required

```javascript
// Test Users
const testUsers = {
  newUser: {
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    password: "TestPass123!",
    whatsappNumber: "+1234567890"
  },
  existingUser: {
    firstName: "Existing",
    lastName: "Member",
    email: "existing@example.com",
    password: "ExistingPass123!"
  },
  teamLeader: {
    firstName: "Team",
    lastName: "Leader",
    email: "teamleader@example.com",
    password: "LeaderPass123!",
    role: "TEAM_LEADER"
  },
  admin: {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "AdminPass123!",
    role: "ADMIN"
  }
};

// Test Team
const testTeam = {
  name: "Test Supply Chain Team",
  slug: "test-supply-chain-team",
  description: "A test team for E2E testing"
};
```

---

## Phase 1: User Registration

### Test Case 1.1: Successful Registration
**Priority:** HIGH
**Description:** User can successfully register with valid information

**Steps:**
1. Navigate to http://localhost:3006/register
2. Verify registration form is displayed
3. Fill in first name: "Test"
4. Fill in last name: "User"
5. Fill in email: "testuser+[timestamp]@example.com"
6. Fill in password: "TestPass123!"
7. Fill in confirm password: "TestPass123!"
8. Fill in WhatsApp number (optional): "+1234567890"
9. Check "Terms & Privacy" checkbox
10. Click "Create Account" button

**Expected Results:**
- Success toast notification appears: "Account created successfully!"
- User is auto-logged in
- User is redirected to /dashboard
- Dashboard displays user's name

---

### Test Case 1.2: Validation - Weak Password
**Priority:** MEDIUM
**Description:** System rejects weak passwords

**Steps:**
1. Navigate to /register
2. Fill in first name: "Test"
3. Fill in last name: "User"
4. Fill in email: "test@example.com"
5. Fill in password: "weak"
6. Fill in confirm password: "weak"
7. Attempt to submit form

**Expected Results:**
- Error message displayed: "Password must be at least 8 characters"
- Form not submitted
- User remains on registration page

---

### Test Case 1.3: Validation - Password Mismatch
**Priority:** MEDIUM
**Description:** System detects password confirmation mismatch

**Steps:**
1. Navigate to /register
2. Fill in all fields correctly
3. Fill in password: "TestPass123!"
4. Fill in confirm password: "DifferentPass123!"
5. Attempt to submit form

**Expected Results:**
- Error message: "Passwords don't match"
- Form not submitted

---

### Test Case 1.4: Validation - Duplicate Email
**Priority:** HIGH
**Description:** System prevents duplicate email registration

**Steps:**
1. Register a user with email: "duplicate@example.com"
2. Logout
3. Navigate to /register again
4. Attempt to register with same email: "duplicate@example.com"

**Expected Results:**
- Error toast: "Email already registered"
- Form not submitted
- User remains on registration page

---

### Test Case 1.5: Validation - Invalid Email Format
**Priority:** MEDIUM
**Description:** System validates email format

**Steps:**
1. Navigate to /register
2. Fill in email: "notanemail"
3. Attempt to proceed

**Expected Results:**
- Error message: "Invalid email address"
- Email field highlighted in red

---

### Test Case 1.6: Validation - Missing Required Fields
**Priority:** MEDIUM
**Description:** System requires all mandatory fields

**Steps:**
1. Navigate to /register
2. Leave first name empty
3. Fill in other fields
4. Attempt to submit

**Expected Results:**
- Error message: "First name must be at least 2 characters"
- Form not submitted

**Repeat for:** lastName, email, password fields

---

### Test Case 1.7: Password Visibility Toggle
**Priority:** LOW
**Description:** Users can toggle password visibility

**Steps:**
1. Navigate to /register
2. Type password in password field
3. Verify password is masked (•••)
4. Click eye icon
5. Verify password is visible
6. Click eye icon again
7. Verify password is masked again

**Expected Results:**
- Password toggles between visible and masked
- Icon changes between Eye and EyeOff

---

### Test Case 1.8: Terms Checkbox Required
**Priority:** MEDIUM
**Description:** Terms checkbox must be checked

**Steps:**
1. Navigate to /register
2. Fill in all fields correctly
3. Leave terms checkbox unchecked
4. Attempt to submit

**Expected Results:**
- Form not submitted (HTML5 validation)
- Checkbox highlighted

---

### Test Case 1.9: WhatsApp Number Optional
**Priority:** LOW
**Description:** WhatsApp number is optional

**Steps:**
1. Navigate to /register
2. Fill in all required fields
3. Leave WhatsApp number empty
4. Submit form

**Expected Results:**
- Registration successful
- User created without WhatsApp number

---

### Test Case 1.10: Already Have Account Link
**Priority:** LOW
**Description:** Link to login page works

**Steps:**
1. Navigate to /register
2. Click "Sign in" link at bottom

**Expected Results:**
- Redirected to /login
- Login form displayed

---

## Phase 2: User Login

### Test Case 2.1: Successful Login
**Priority:** HIGH
**Description:** User can login with valid credentials

**Steps:**
1. Navigate to http://localhost:3006/login
2. Fill in email: "testuser@example.com"
3. Fill in password: "TestPass123!"
4. Click "Sign In" button

**Expected Results:**
- Success toast: "Welcome back!"
- Redirected to /dashboard
- User navbar displays user's name
- User menu shows correct email and role

---

### Test Case 2.2: Invalid Credentials
**Priority:** HIGH
**Description:** System rejects invalid credentials

**Steps:**
1. Navigate to /login
2. Fill in email: "testuser@example.com"
3. Fill in password: "WrongPassword123!"
4. Click "Sign In"

**Expected Results:**
- Error toast: "Invalid email or password"
- User remains on login page
- No session created

---

### Test Case 2.3: Non-existent User
**Priority:** MEDIUM
**Description:** System handles non-existent user login

**Steps:**
1. Navigate to /login
2. Fill in email: "nonexistent@example.com"
3. Fill in password: "AnyPassword123!"
4. Click "Sign In"

**Expected Results:**
- Error toast: "Invalid email or password"
- User remains on login page

---

### Test Case 2.4: Remember Me Functionality
**Priority:** MEDIUM
**Description:** Remember me checkbox extends session

**Steps:**
1. Navigate to /login
2. Fill in valid credentials
3. Check "Remember me" checkbox
4. Click "Sign In"
5. Close browser
6. Reopen browser and navigate to /dashboard

**Expected Results:**
- User remains logged in after browser restart
- Session persists for 30 days

---

### Test Case 2.5: Forgot Password Link
**Priority:** MEDIUM
**Description:** Forgot password link works

**Steps:**
1. Navigate to /login
2. Click "Forgot password?" link

**Expected Results:**
- Redirected to /forgot-password
- Forgot password form displayed

---

### Test Case 2.6: Don't Have Account Link
**Priority:** LOW
**Description:** Sign up link works

**Steps:**
1. Navigate to /login
2. Click "Sign up" link at bottom

**Expected Results:**
- Redirected to /register
- Registration form displayed

---

### Test Case 2.7: Callback URL Preservation
**Priority:** MEDIUM
**Description:** User redirected to original destination after login

**Steps:**
1. While logged out, navigate to /dashboard/profile
2. System redirects to /login with callbackUrl parameter
3. Login with valid credentials

**Expected Results:**
- After login, redirected to /dashboard/profile
- Not redirected to /dashboard

---

### Test Case 2.8: Already Logged In Redirect
**Priority:** MEDIUM
**Description:** Logged in users redirected from login page

**Steps:**
1. Login successfully
2. Navigate to /login

**Expected Results:**
- Automatically redirected to /dashboard
- Login form not accessible

---

### Test Case 2.9: Last Login Timestamp
**Priority:** LOW
**Description:** System updates last login timestamp

**Steps:**
1. Login successfully
2. Navigate to /dashboard/profile
3. Check "Last login" timestamp

**Expected Results:**
- Last login shows "a few seconds ago"
- Timestamp is current

---

### Test Case 2.10: Password Visibility Toggle
**Priority:** LOW
**Description:** Password visibility toggle works

**Steps:**
1. Navigate to /login
2. Type password
3. Click eye icon to show/hide

**Expected Results:**
- Password visibility toggles correctly
- Icon changes appropriately

---

## Phase 3: Password Reset

### Test Case 3.1: Successful Password Reset Request
**Priority:** HIGH
**Description:** User can request password reset

**Steps:**
1. Navigate to /forgot-password
2. Fill in email: "testuser@example.com"
3. Click "Send reset instructions"

**Expected Results:**
- Success toast: "Check your email for reset instructions"
- Success screen displayed
- Email sent (check console logs in development)
- Reset token generated in database

---

### Test Case 3.2: Non-existent Email Reset Request
**Priority:** MEDIUM
**Description:** System doesn't reveal if email exists

**Steps:**
1. Navigate to /forgot-password
2. Fill in email: "nonexistent@example.com"
3. Click "Send reset instructions"

**Expected Results:**
- Same success message shown
- No error revealing email doesn't exist (security)
- No email sent

---

### Test Case 3.3: Password Reset with Valid Token
**Priority:** HIGH
**Description:** User can reset password with valid token

**Steps:**
1. Request password reset for "testuser@example.com"
2. Get reset token from console logs or database
3. Navigate to /reset-password?token=[TOKEN]
4. Fill in new password: "NewTestPass123!"
5. Fill in confirm password: "NewTestPass123!"
6. Click "Reset Password"

**Expected Results:**
- Success toast: "Password reset successfully!"
- Redirected to /login
- Can login with new password
- Cannot reuse same token

---

### Test Case 3.4: Password Reset with Expired Token
**Priority:** MEDIUM
**Description:** System rejects expired tokens

**Steps:**
1. Use a token that's older than 1 hour (or manually expire in DB)
2. Navigate to /reset-password?token=[EXPIRED_TOKEN]
3. Fill in new password
4. Click "Reset Password"

**Expected Results:**
- Error toast: "Token expired"
- Password not reset
- Can still login with old password

---

### Test Case 3.5: Password Reset with Used Token
**Priority:** MEDIUM
**Description:** System rejects already-used tokens

**Steps:**
1. Complete password reset with a token
2. Try to use same token again
3. Navigate to /reset-password?token=[USED_TOKEN]

**Expected Results:**
- Error toast: "Invalid or expired token"
- Password not reset

---

### Test Case 3.6: Password Reset without Token
**Priority:** MEDIUM
**Description:** System redirects when no token provided

**Steps:**
1. Navigate to /reset-password (without ?token= parameter)

**Expected Results:**
- Redirected to /forgot-password
- Reset form not displayed

---

### Test Case 3.7: Back to Login from Forgot Password
**Priority:** LOW
**Description:** Back to login link works

**Steps:**
1. Navigate to /forgot-password
2. Click "Back to login" button

**Expected Results:**
- Redirected to /login
- Login form displayed

---

### Test Case 3.8: Try Another Email
**Priority:** LOW
**Description:** Can request reset for different email

**Steps:**
1. Navigate to /forgot-password
2. Submit email and see success screen
3. Click "Try another email" button

**Expected Results:**
- Back to forgot password form
- Form is reset and empty

---

## Phase 4: User Profile Management

### Test Case 4.1: View User Profile
**Priority:** HIGH
**Description:** User can view their complete profile

**Steps:**
1. Login as testuser@example.com
2. Navigate to /dashboard/profile

**Expected Results:**
- Profile page displays:
  - Avatar with initials
  - Full name
  - Email
  - Role badge (color-coded)
  - Account created date
  - Last login date
  - WhatsApp number (if provided)

---

### Test Case 4.2: Update Profile Information
**Priority:** HIGH
**Description:** User can update their profile

**Steps:**
1. Navigate to /dashboard/profile
2. In "Personal Information" section:
   - Change first name to "Updated"
   - Change last name to "Name"
   - Change WhatsApp to "+9876543210"
3. Click "Save Changes"

**Expected Results:**
- Success toast: "Profile updated successfully!"
- Page refreshes with new data
- Profile header shows "Updated Name"
- Changes persisted in database

---

### Test Case 4.3: Cancel Profile Changes
**Priority:** LOW
**Description:** Cancel button discards changes

**Steps:**
1. Navigate to /dashboard/profile
2. Change first name
3. Click "Cancel" button

**Expected Results:**
- Form resets to original values
- No changes saved
- Save button disabled (no changes)

---

### Test Case 4.4: Save Button Disabled When No Changes
**Priority:** LOW
**Description:** Save button only enabled when form is dirty

**Steps:**
1. Navigate to /dashboard/profile
2. Verify "Save Changes" button is disabled
3. Make a change to any field
4. Verify button becomes enabled
5. Undo the change
6. Verify button is disabled again

**Expected Results:**
- Button disabled when form is pristine
- Button enabled when form is dirty

---

### Test Case 4.5: Profile Form Validation
**Priority:** MEDIUM
**Description:** Profile form validates input

**Steps:**
1. Navigate to /dashboard/profile
2. Clear first name field
3. Attempt to save

**Expected Results:**
- Error message: "First name must be at least 2 characters"
- Form not submitted

---

### Test Case 4.6: View Team Information
**Priority:** MEDIUM
**Description:** Team info displayed on profile page

**Steps:**
1. Login as user who belongs to a team
2. Navigate to /dashboard/profile
3. Scroll to "Team" section

**Expected Results:**
- Team name displayed
- Team description shown
- Team slug visible
- If no team: section not displayed

---

## Phase 5: Password Change

### Test Case 5.1: Successful Password Change
**Priority:** HIGH
**Description:** User can change their password

**Steps:**
1. Login as testuser@example.com
2. Navigate to /dashboard/profile
3. Scroll to "Security" section
4. Fill in current password: "TestPass123!"
5. Fill in new password: "NewPassword123!"
6. Fill in confirm password: "NewPassword123!"
7. Click "Change Password"

**Expected Results:**
- Success toast: "Password changed successfully!"
- Form resets (all fields cleared)
- Can logout and login with new password
- Cannot login with old password

---

### Test Case 5.2: Wrong Current Password
**Priority:** HIGH
**Description:** System validates current password

**Steps:**
1. Navigate to /dashboard/profile
2. In Security section:
   - Current password: "WrongPassword123!"
   - New password: "NewPassword123!"
   - Confirm: "NewPassword123!"
3. Click "Change Password"

**Expected Results:**
- Error toast: "Current password is incorrect"
- Password not changed
- Can still login with actual current password

---

### Test Case 5.3: New Password Same as Current
**Priority:** MEDIUM
**Description:** System prevents reusing current password

**Steps:**
1. Navigate to /dashboard/profile
2. In Security section:
   - Current password: "TestPass123!"
   - New password: "TestPass123!"
   - Confirm: "TestPass123!"
3. Attempt to submit

**Expected Results:**
- Error message: "New password must be different from current password"
- Form not submitted

---

### Test Case 5.4: Password Confirmation Mismatch
**Priority:** MEDIUM
**Description:** New password confirmation must match

**Steps:**
1. Navigate to /dashboard/profile
2. In Security section:
   - Current password: "TestPass123!"
   - New password: "NewPassword123!"
   - Confirm: "DifferentPassword123!"
3. Attempt to submit

**Expected Results:**
- Error message: "Passwords don't match"
- Form not submitted

---

### Test Case 5.5: Weak New Password
**Priority:** MEDIUM
**Description:** New password must meet strength requirements

**Steps:**
1. Navigate to /dashboard/profile
2. Try to set new password to "weak"

**Expected Results:**
- Error message about password requirements
- Form not submitted

---

### Test Case 5.6: Password Visibility Toggles
**Priority:** LOW
**Description:** All three password fields have visibility toggles

**Steps:**
1. Navigate to /dashboard/profile
2. In Security section:
   - Type in current password field
   - Verify eye icon works
   - Repeat for new password field
   - Repeat for confirm password field

**Expected Results:**
- Each field has independent visibility toggle
- Icons change appropriately
- Text visibility toggles correctly

---

## Phase 6: Team Creation

### Test Case 6.1: Create Team Successfully
**Priority:** HIGH
**Description:** User can create a new team

**Steps:**
1. Login as user without a team
2. Navigate to /dashboard/team
3. Verify "Create Your Team" screen is shown
4. Fill in team name: "Test Supply Chain Team"
5. Verify slug auto-generated: "test-supply-chain-team"
6. Fill in description: "A test team for collaboration"
7. Click "Create Team"

**Expected Results:**
- Success toast: "Team created successfully!"
- Redirected to team management page
- User role upgraded to TEAM_LEADER
- User is team owner
- Team stats show 1 member

---

### Test Case 6.2: Auto-generated Slug
**Priority:** MEDIUM
**Description:** Slug auto-generates from team name

**Steps:**
1. Navigate to /dashboard/team (create team screen)
2. Type team name: "My Awesome Team!"
3. Observe slug field

**Expected Results:**
- Slug automatically becomes: "my-awesome-team"
- Special characters removed
- Lowercase conversion
- Spaces replaced with hyphens

---

### Test Case 6.3: Duplicate Team Slug
**Priority:** MEDIUM
**Description:** System prevents duplicate slugs

**Steps:**
1. Create team with slug: "test-team"
2. Logout and register new user
3. Try to create team with same slug: "test-team"

**Expected Results:**
- Error toast: "Team slug already taken. Please choose another."
- Team not created
- User remains on create form

---

### Test Case 6.4: User Already in Team
**Priority:** MEDIUM
**Description:** User in team cannot create another

**Steps:**
1. Login as user who is already in a team
2. Manually navigate to team creation (or try via API)

**Expected Results:**
- Error message or redirect
- Cannot create second team
- "One team per user" enforced

---

### Test Case 6.5: Cancel Team Creation
**Priority:** LOW
**Description:** Cancel button works

**Steps:**
1. Navigate to team creation form
2. Fill in some fields
3. Click "Cancel" button

**Expected Results:**
- Navigated back to previous page or dashboard
- Team not created

---

### Test Case 6.6: Team Creation Form Validation
**Priority:** MEDIUM
**Description:** Form validates required fields

**Steps:**
1. Navigate to team creation form
2. Leave team name empty
3. Attempt to submit

**Expected Results:**
- Error message: "Team name must be at least 2 characters"
- Form not submitted

---

## Phase 7: Team Member Management

### Test Case 7.1: View Team Members
**Priority:** HIGH
**Description:** Team leader can view all team members

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team

**Expected Results:**
- Team members list displayed
- Each member shows:
  - Avatar with initials
  - Full name
  - Email
  - Role badge (color-coded)
  - Last active time
- Current user marked with "(You)"
- Owner marked with "(Owner)"

---

### Test Case 7.2: Invite Member Successfully
**Priority:** HIGH
**Description:** Team leader can invite registered users

**Pre-requisites:**
- Create a test user: invitee@example.com (not in any team)

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team
3. In "Invite Team Member" section:
   - Fill in email: "invitee@example.com"
   - Select role: "MEMBER"
4. Click "Invite Member"

**Expected Results:**
- Success toast: "[Name] has been added to the team"
- Member appears in team list
- Form resets
- Team member count increases

---

### Test Case 7.3: Invite Non-existent User
**Priority:** MEDIUM
**Description:** Cannot invite unregistered users

**Steps:**
1. Login as team leader
2. Try to invite: "nonexistent@example.com"

**Expected Results:**
- Error toast: "User not found. They must register first before being invited."
- User not added to team

---

### Test Case 7.4: Invite User Already in Another Team
**Priority:** MEDIUM
**Description:** Cannot invite users already in teams

**Steps:**
1. Login as team leader of Team A
2. Try to invite a user who is in Team B

**Expected Results:**
- Error toast: "User is already a member of another team"
- User not added

---

### Test Case 7.5: Invite User Already in Same Team
**Priority:** MEDIUM
**Description:** Cannot invite existing team member

**Steps:**
1. Login as team leader
2. Try to invite a user already in the team

**Expected Results:**
- Error toast: "User is already a member of this team"
- No duplicate member created

---

### Test Case 7.6: Maximum Team Members Limit
**Priority:** MEDIUM
**Description:** Cannot exceed max members limit

**Steps:**
1. Create team with maxMembers: 3
2. Invite 2 members (total 3 with owner)
3. Try to invite 4th member

**Expected Results:**
- Error toast: "Team has reached maximum capacity (3 members)"
- Member not added

---

### Test Case 7.7: Update Member Role to TEAM_LEADER
**Priority:** HIGH
**Description:** Team leader can promote members

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team
3. Find a MEMBER in the list
4. Click three-dot menu
5. Select "Promote to Team Leader"

**Expected Results:**
- Success toast: "[Name]'s role updated to TEAM_LEADER"
- Member's badge changes to TEAM_LEADER (blue)
- Page refreshes with new data

---

### Test Case 7.8: Update Member Role to VIEWER
**Priority:** MEDIUM
**Description:** Team leader can demote members

**Steps:**
1. Login as team leader
2. Find a MEMBER in the list
3. Click menu → "Set as Viewer"

**Expected Results:**
- Success toast: "[Name]'s role updated to VIEWER"
- Badge changes to VIEWER (gray)
- Member can only view, not edit

---

### Test Case 7.9: Cannot Update Own Role
**Priority:** MEDIUM
**Description:** User cannot change their own role

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team
3. Find your own entry in member list

**Expected Results:**
- No three-dot menu for own entry
- Cannot access role management for self

---

### Test Case 7.10: Cannot Update Team Owner's Role
**Priority:** MEDIUM
**Description:** Cannot change owner's role

**Steps:**
1. Login as TEAM_LEADER (not owner)
2. Try to update team owner's role

**Expected Results:**
- Owner should not have action menu
- API should reject if attempted

---

### Test Case 7.11: Remove Team Member
**Priority:** HIGH
**Description:** Team leader can remove members

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team
3. Find a member to remove
4. Click three-dot menu → "Remove from Team"
5. Confirmation dialog appears
6. Click "Remove Member"

**Expected Results:**
- Confirmation dialog asks for confirmation
- Success toast: "[Name] has been removed from the team"
- Member removed from list
- Member count decreases
- Removed user's role reset to MEMBER

---

### Test Case 7.12: Cancel Member Removal
**Priority:** LOW
**Description:** Can cancel member removal

**Steps:**
1. Start removing a member
2. Confirmation dialog appears
3. Click "Cancel"

**Expected Results:**
- Dialog closes
- Member NOT removed
- Member still in list

---

### Test Case 7.13: Cannot Remove Self
**Priority:** MEDIUM
**Description:** User cannot remove themselves

**Steps:**
1. Login as team leader
2. Find own entry in member list

**Expected Results:**
- No "Remove from Team" option for self
- Must use "Leave Team" instead

---

### Test Case 7.14: Team Member Sees Limited Options
**Priority:** MEDIUM
**Description:** Regular members cannot manage others

**Steps:**
1. Login as MEMBER (not leader)
2. Navigate to /dashboard/team

**Expected Results:**
- Can see team members
- Cannot see "Invite Member" section
- No action menus on member list
- Cannot manage other members

---

### Test Case 7.15: Viewer Sees Limited Options
**Priority:** MEDIUM
**Description:** Viewers have read-only access

**Steps:**
1. Login as VIEWER
2. Navigate to /dashboard/team

**Expected Results:**
- Can see team members
- Cannot invite members
- Cannot manage members
- Read-only view

---

### Test Case 7.16: Leave Team as Member
**Priority:** HIGH
**Description:** Non-owner can leave team

**Steps:**
1. Login as MEMBER (not owner)
2. Navigate to /dashboard/team
3. Scroll to "Leave Team" section
4. Click "Leave Team" button

**Expected Results:**
- Success toast: "You have left the team"
- Redirected to create team page
- No longer member of team
- Role reset to MEMBER
- Can create or join another team

---

### Test Case 7.17: Owner Cannot Leave with Members
**Priority:** HIGH
**Description:** Owner must remove members first

**Steps:**
1. Login as team owner
2. Team has other members
3. Try to leave team

**Expected Results:**
- Error toast: "As the team owner, you must transfer ownership or remove all members before leaving"
- Owner remains in team

---

### Test Case 7.18: Owner Delete Team (Solo)
**Priority:** HIGH
**Description:** Solo owner can delete team

**Steps:**
1. Login as team owner
2. Remove all other members first
3. Navigate to "Danger Zone"
4. Click "Delete Team"

**Expected Results:**
- Team deleted from database
- Success toast: "Team deleted successfully"
- Redirected to create team page
- User role reset to MEMBER
- User can create new team

---

### Test Case 7.19: Team Stats Display
**Priority:** LOW
**Description:** Team stats are accurate

**Steps:**
1. Login as team leader
2. Navigate to /dashboard/team
3. Verify stats cards

**Expected Results:**
- Total Members: correct count
- Max Members: shows "of X maximum"
- Team Slug: displays correctly
- Your Role: shows correct role and "Team Owner" if applicable

---

### Test Case 7.20: Role Badge Colors
**Priority:** LOW
**Description:** Role badges are color-coded

**Steps:**
1. View team with members of different roles

**Expected Results:**
- ADMIN: Red badge
- TEAM_LEADER: Blue badge with Shield icon
- MEMBER: Green badge with Users icon
- VIEWER: Gray badge with Eye icon

---

## Phase 8: Authorization & Permissions

### Test Case 8.1: Protected Dashboard Routes
**Priority:** HIGH
**Description:** Unauthenticated users redirected

**Steps:**
1. Logout (or use incognito)
2. Navigate to /dashboard
3. Navigate to /dashboard/profile
4. Navigate to /dashboard/team

**Expected Results:**
- All routes redirect to /login
- Callback URL preserved
- After login, redirected back to original page

---

### Test Case 8.2: Auth Routes Redirect When Logged In
**Priority:** MEDIUM
**Description:** Logged-in users can't access auth pages

**Steps:**
1. Login successfully
2. Navigate to /login
3. Navigate to /register
4. Navigate to /forgot-password

**Expected Results:**
- All routes redirect to /dashboard
- Auth forms not accessible

---

### Test Case 8.3: Team Route Requires TEAM_LEADER
**Priority:** HIGH
**Description:** Only team leaders can access team management

**Steps:**
1. Login as MEMBER (not leader)
2. Navigate to /dashboard/team

**Expected Results:**
- Redirected to /dashboard?error=unauthorized
- Or: team page shows but with limited permissions
- Cannot access invite/management features

---

### Test Case 8.4: Admin Routes Require ADMIN Role
**Priority:** HIGH
**Description:** Admin routes protected

**Steps:**
1. Login as MEMBER
2. Navigate to /dashboard/admin (if exists)

**Expected Results:**
- Redirected to /dashboard?error=unauthorized
- Admin features not accessible

---

### Test Case 8.5: API Endpoint Authorization
**Priority:** HIGH
**Description:** API endpoints validate permissions

**Steps:**
1. Login as MEMBER
2. Try to call POST /api/team/invite via browser console

```javascript
fetch('/api/team/invite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    role: 'MEMBER'
  })
})
```

**Expected Results:**
- Response: 403 Forbidden
- Error: "Only team leaders can invite members"
- No member added

---

### Test Case 8.6: Cannot Access Other Teams
**Priority:** HIGH
**Description:** Users can only access their own team

**Steps:**
1. Login as member of Team A
2. Try to access Team B's data via API

**Expected Results:**
- Access denied
- Only own team data visible

---

### Test Case 8.7: Session Expiration
**Priority:** MEDIUM
**Description:** Expired sessions redirect to login

**Steps:**
1. Login
2. Manually expire session (or wait 30 days)
3. Try to access /dashboard

**Expected Results:**
- Redirected to /login
- Session invalid
- Must login again

---

### Test Case 8.8: Concurrent Session Handling
**Priority:** LOW
**Description:** Multiple browser sessions work

**Steps:**
1. Login in Browser A
2. Login same user in Browser B
3. Perform actions in both

**Expected Results:**
- Both sessions work
- Actions reflected across browsers
- No session conflicts

---

## Phase 9: Navigation & UI

### Test Case 9.1: User Menu Dropdown
**Priority:** MEDIUM
**Description:** User menu works correctly

**Steps:**
1. Login to dashboard
2. Click user avatar/name in navbar
3. Verify dropdown menu opens

**Expected Results:**
- Dropdown shows:
  - User avatar with initials
  - Full name
  - Email
  - Role badge
  - "Profile" link
  - "Settings" link
  - "Logout" button (red)

---

### Test Case 9.2: Navigate to Profile via Menu
**Priority:** MEDIUM
**Description:** Profile link works

**Steps:**
1. Click user menu
2. Click "Profile"

**Expected Results:**
- Navigated to /dashboard/profile
- Profile page loads

---

### Test Case 9.3: Logout via User Menu
**Priority:** HIGH
**Description:** Logout works from user menu

**Steps:**
1. Click user menu
2. Click "Logout"

**Expected Results:**
- Success toast: "Logged out successfully"
- Redirected to /login
- Session cleared
- Cannot access /dashboard

---

### Test Case 9.4: Mobile Responsive - Sidebar
**Priority:** MEDIUM
**Description:** Mobile menu works

**Steps:**
1. Resize browser to mobile width (<768px)
2. Verify hamburger menu appears
3. Click hamburger menu
4. Verify sidebar slides in

**Expected Results:**
- Mobile menu toggles correctly
- Sidebar accessible on mobile
- Overlay closes sidebar

---

### Test Case 9.5: Dark Mode Support
**Priority:** LOW
**Description:** All pages work in dark mode

**Steps:**
1. Enable dark mode (if toggle exists)
2. Visit all pages
3. Verify readability

**Expected Results:**
- All text readable
- Proper contrast ratios
- Forms functional
- No broken styling

---

### Test Case 9.6: Form Loading States
**Priority:** MEDIUM
**Description:** Forms show loading indicators

**Steps:**
1. Submit any form (login, register, etc.)
2. Observe button during submission

**Expected Results:**
- Button shows spinner icon
- Button text changes (e.g., "Creating account...")
- Button is disabled during submission
- Cannot double-submit

---

### Test Case 9.7: Toast Notifications
**Priority:** MEDIUM
**Description:** Toast notifications work

**Steps:**
1. Trigger various actions (success, error)
2. Observe toast notifications

**Expected Results:**
- Success toasts: green with checkmark
- Error toasts: red with X
- Auto-dismiss after a few seconds
- Can manually dismiss
- Positioned consistently (bottom-right)

---

### Test Case 9.8: Browser Back Button
**Priority:** MEDIUM
**Description:** Back button works correctly

**Steps:**
1. Navigate through: Login → Dashboard → Profile
2. Click browser back button twice

**Expected Results:**
- Properly navigates backward
- No broken states
- Session maintained

---

### Test Case 9.9: Page Refresh Maintains State
**Priority:** MEDIUM
**Description:** Refreshing page maintains session

**Steps:**
1. Login and navigate to profile
2. Press F5 to refresh

**Expected Results:**
- Session maintained
- User still logged in
- Page loads correctly

---

### Test Case 9.10: Direct URL Access
**Priority:** MEDIUM
**Description:** Direct URLs work correctly

**Steps:**
1. While logged in, copy /dashboard/profile URL
2. Close browser
3. Open browser and paste URL

**Expected Results:**
- If session valid: page loads
- If session expired: redirect to login with callback URL

---

## Phase 10: Security Tests

### Test Case 10.1: SQL Injection Prevention
**Priority:** HIGH
**Description:** Forms prevent SQL injection

**Steps:**
1. Try to register with email: `test@example.com'; DROP TABLE users; --`
2. Try to login with email: `' OR '1'='1`

**Expected Results:**
- No SQL errors
- Invalid input handled safely
- Database not affected
- Proper error messages

---

### Test Case 10.2: XSS Prevention
**Priority:** HIGH
**Description:** Forms prevent XSS attacks

**Steps:**
1. Register with name: `<script>alert('XSS')</script>`
2. Create team with name: `<img src=x onerror=alert('XSS')>`

**Expected Results:**
- Scripts not executed
- Content properly escaped
- Displayed as plain text

---

### Test Case 10.3: CSRF Protection
**Priority:** HIGH
**Description:** Forms have CSRF protection

**Steps:**
1. Inspect form requests in Network tab
2. Verify CSRF tokens present

**Expected Results:**
- NextAuth CSRF tokens included
- Requests validated
- Cross-origin requests blocked

---

### Test Case 10.4: Password Strength Enforcement
**Priority:** HIGH
**Description:** Weak passwords rejected

**Steps:**
1. Try passwords: "123456", "password", "abc"
2. Verify all rejected

**Expected Results:**
- Minimum 8 characters enforced
- Must have uppercase, lowercase, number
- Clear error messages

---

### Test Case 10.5: Rate Limiting (if implemented)
**Priority:** MEDIUM
**Description:** Repeated failed attempts limited

**Steps:**
1. Attempt login with wrong password 10 times rapidly

**Expected Results:**
- After 5 attempts, rate limited
- Temporary lockout (15 minutes)
- Error message shown

---

### Test Case 10.6: Sensitive Data in URLs
**Priority:** HIGH
**Description:** No passwords in URLs

**Steps:**
1. Submit forms
2. Check browser address bar and history

**Expected Results:**
- No passwords in URLs
- No sensitive data in query params
- Reset tokens okay (one-time use)

---

### Test Case 10.7: Session Fixation Prevention
**Priority:** HIGH
**Description:** New session on login

**Steps:**
1. Note session cookie before login
2. Login
3. Check session cookie after login

**Expected Results:**
- New session ID generated
- Old session invalidated

---

### Test Case 10.8: Secure Cookie Flags
**Priority:** HIGH
**Description:** Cookies have security flags

**Steps:**
1. Login
2. Inspect cookies in DevTools

**Expected Results:**
- httpOnly: true (prevents XSS)
- secure: true (in production, HTTPS only)
- sameSite: lax (CSRF protection)

---

### Test Case 10.9: Password Reset Token Security
**Priority:** HIGH
**Description:** Reset tokens are secure

**Steps:**
1. Request password reset
2. Inspect token

**Expected Results:**
- Token is hashed in database
- Token expires after 1 hour
- Token single-use (cannot reuse)
- Sufficient randomness (32 bytes)

---

### Test Case 10.10: Authorization Bypass Attempts
**Priority:** HIGH
**Description:** Cannot bypass permissions

**Steps:**
1. Login as VIEWER
2. Try to directly call admin API endpoints
3. Try to access other users' profiles

**Expected Results:**
- All attempts blocked
- 403 Forbidden returned
- No data leaked
- Proper error messages

---

## Test Execution Checklist

### Before Testing
- [ ] Database is fresh and migrations applied
- [ ] Development server running on port 3006
- [ ] PostgreSQL running (Docker)
- [ ] Playwright MCP browser ready
- [ ] Test data prepared

### During Testing
- [ ] Document all failures with screenshots
- [ ] Note performance issues
- [ ] Check console for errors
- [ ] Verify database state after tests
- [ ] Test in both light and dark mode

### After Testing
- [ ] Count: Passed / Failed / Skipped
- [ ] Create bug reports for failures
- [ ] Document unexpected behavior
- [ ] Note areas needing improvement

---

## Expected Test Results Summary

| Phase | Total Tests | Priority HIGH | Priority MEDIUM | Priority LOW |
|-------|-------------|---------------|-----------------|--------------|
| 1. Registration | 10 | 3 | 6 | 1 |
| 2. Login | 10 | 3 | 5 | 2 |
| 3. Password Reset | 8 | 3 | 3 | 2 |
| 4. Profile Management | 6 | 2 | 2 | 2 |
| 5. Password Change | 6 | 2 | 3 | 1 |
| 6. Team Creation | 6 | 1 | 4 | 1 |
| 7. Team Management | 20 | 8 | 8 | 4 |
| 8. Authorization | 8 | 5 | 2 | 1 |
| 9. Navigation & UI | 10 | 2 | 6 | 2 |
| 10. Security | 10 | 8 | 1 | 0 |
| **TOTAL** | **94** | **37** | **40** | **16** |

---

## Notes

- All tests assume development environment (http://localhost:3006)
- Email functionality logs to console in development
- Some security tests may need manual verification
- Performance benchmarks not included in this plan
- Accessibility tests (WCAG) should be added separately
- API testing can be done with Playwright or separate tools

---

**End of Test Plan**
