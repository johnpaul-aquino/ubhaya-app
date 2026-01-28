import { test, expect } from '@playwright/test';

// Generate unique email for this test run
const timestamp = Date.now();
const testEmail = `ui.test.${timestamp}@example.com`;
const testPassword = 'TestPass123!';

test.describe('Authentication UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. Registration Page - Password Strength Indicator', async ({ page }) => {
    await page.goto('http://localhost:3001/register');

    // Wait for page to load
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();

    // Fill in name fields
    await page.fill('input[name="firstName"]', 'UI');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', testEmail);

    // Test password strength indicator with different passwords
    const passwordInput = page.locator('input[name="password"]');

    // Very Weak password
    await passwordInput.fill('abc');
    await expect(page.locator('text=Very Weak')).toBeVisible({ timeout: 2000 });
    console.log('✅ Very Weak password strength detected');

    // Weak password
    await passwordInput.fill('abcd1234');
    await expect(page.locator('text=Weak')).toBeVisible({ timeout: 2000 });
    console.log('✅ Weak password strength detected');

    // Fair password
    await passwordInput.fill('Abcd1234');
    await expect(page.locator('text=Fair')).toBeVisible({ timeout: 2000 });
    console.log('✅ Fair password strength detected');

    // Good password
    await passwordInput.fill('Abcd1234!');
    await expect(page.locator('text=Good')).toBeVisible({ timeout: 2000 });
    console.log('✅ Good password strength detected');

    // Strong password
    await passwordInput.fill('Abcd1234!@#$');
    await expect(page.locator('text=Strong')).toBeVisible({ timeout: 2000 });
    console.log('✅ Strong password strength detected');

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/password-strength.png' });
  });

  test('2. Registration Page - Password Visibility Toggle', async ({ page }) => {
    await page.goto('http://localhost:3001/register');

    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('TestPassword123!');

    // Initially password should be masked
    await expect(passwordInput).toHaveAttribute('type', 'password');
    console.log('✅ Password is masked initially');

    // Click eye icon to show password
    await page.locator('button:has(svg)').first().click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
    console.log('✅ Password is visible after clicking eye icon');

    // Click again to hide
    await page.locator('button:has(svg)').first().click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    console.log('✅ Password is masked again after clicking eye-off icon');

    await page.screenshot({ path: 'tests/screenshots/password-toggle.png' });
  });

  test('3. Registration Page - Form Validation Errors', async ({ page }) => {
    await page.goto('http://localhost:3001/register');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=First name must be at least 2 characters')).toBeVisible({ timeout: 3000 });
    console.log('✅ First name validation error shown');

    // Fill short first name
    await page.fill('input[name="firstName"]', 'A');
    await page.fill('input[name="lastName"]', 'B');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=First name must be at least 2 characters')).toBeVisible();
    console.log('✅ Short first name rejected');

    // Invalid email
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email address')).toBeVisible();
    console.log('✅ Invalid email rejected');

    // Password too short
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'weak');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
    console.log('✅ Short password rejected');

    // Password mismatch
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Passwords don\'t match')).toBeVisible();
    console.log('✅ Password mismatch detected');

    await page.screenshot({ path: 'tests/screenshots/validation-errors.png' });
  });

  test('4. Registration Flow - Complete Registration', async ({ page }) => {
    await page.goto('http://localhost:3001/register');

    // Fill in the registration form
    await page.fill('input[name="firstName"]', 'UI');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="whatsappNumber"]', '+639171234567');

    // Check terms checkbox
    await page.check('input[type="checkbox"]#terms');

    // Take screenshot before submit
    await page.screenshot({ path: 'tests/screenshots/registration-form-filled.png' });

    // Submit the form
    await page.click('button[type="submit"]:has-text("Create Account")');

    // Wait for success toast or redirect
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('✅ Registration successful - redirected to dashboard');

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Take screenshot of dashboard
    await page.screenshot({ path: 'tests/screenshots/dashboard-after-register.png' });
  });

  test('5. Login Flow - Successful Login', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Wait for page to load
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();

    // Fill in login credentials
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Take screenshot before submit
    await page.screenshot({ path: 'tests/screenshots/login-form-filled.png' });

    // Click sign in
    await page.click('button[type="submit"]:has-text("Sign In")');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('✅ Login successful - redirected to dashboard');

    // Verify we're logged in
    await expect(page).toHaveURL(/.*dashboard/);

    await page.screenshot({ path: 'tests/screenshots/dashboard-after-login.png' });
  });

  test('6. Login Flow - Invalid Credentials', async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    // Fill in wrong credentials
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'WrongPassword123!');

    // Submit
    await page.click('button[type="submit"]');

    // Should show error toast and stay on login page
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
    console.log('✅ Invalid credentials rejected with error message');

    // Still on login page
    await expect(page).toHaveURL(/.*login/);

    await page.screenshot({ path: 'tests/screenshots/login-invalid-credentials.png' });
  });

  test('7. Session Persistence - Page Refresh', async ({ page }) => {
    // First login
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    console.log('✅ Logged in successfully');

    // Refresh the page
    await page.reload();

    // Should still be on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    console.log('✅ Session persisted after page refresh');

    await page.screenshot({ path: 'tests/screenshots/session-persist-refresh.png' });
  });

  test('8. Protected Routes - Redirect to Login', async ({ page }) => {
    // Start with clean context (no session)
    await page.context().clearCookies();

    // Try to access dashboard directly
    await page.goto('http://localhost:3001/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    console.log('✅ Protected route redirected to login when not authenticated');

    await page.screenshot({ path: 'tests/screenshots/protected-route-redirect.png' });
  });

  test('9. Responsive Design - Mobile View', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3001/register');

    // Check if page renders correctly
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();

    // Check form fields are visible
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();

    console.log('✅ Registration form renders correctly on mobile');

    await page.screenshot({ path: 'tests/screenshots/mobile-registration.png' });

    // Test login page mobile
    await page.goto('http://localhost:3001/login');
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();

    console.log('✅ Login form renders correctly on mobile');

    await page.screenshot({ path: 'tests/screenshots/mobile-login.png' });
  });

  test('10. UI Elements - Links and Navigation', async ({ page }) => {
    await page.goto('http://localhost:3001/register');

    // Click "Already have an account? Sign in" link
    await page.click('text=Sign in');

    // Should navigate to login page
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Registration -> Login link works');

    // Click "Don't have an account? Sign up" link
    await page.click('text=Sign up');

    // Should navigate back to register
    await expect(page).toHaveURL(/.*register/);
    console.log('✅ Login -> Registration link works');

    // Check forgot password link
    await page.goto('http://localhost:3001/login');
    await expect(page.locator('text=Forgot password?')).toBeVisible();
    console.log('✅ Forgot password link is present');

    await page.screenshot({ path: 'tests/screenshots/navigation-links.png' });
  });
});
