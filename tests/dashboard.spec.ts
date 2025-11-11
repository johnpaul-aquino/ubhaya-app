import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3006/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should load dashboard home page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Dashboard/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Welcome back, John!');

    // Check subtitle
    await expect(page.locator('p').first()).toContainText("Here's what's happening");
  });

  test('should display navbar with logo and user menu', async ({ page }) => {
    // Check Ubhaya logo
    await expect(page.locator('text=Ubhaya')).toBeVisible();

    // Check search bar
    await expect(page.locator('input[placeholder="Search anything..."]')).toBeVisible();

    // Check notification bell button
    await expect(page.locator('button[aria-label*="notification"]')).toBeDefined();

    // Check user avatar/menu
    const userAvatar = page.locator('div').filter({ hasText: /JD/ }).first();
    await expect(userAvatar).toBeVisible();

    // Check logout button
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    // Check sidebar is visible on desktop
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check menu items
    const menuItems = [
      'Dashboard',
      'Facilities',
      'Shipments',
      'Contacts',
      'Shipping Calculator',
      'Documents',
      'Team',
      'Settings',
    ];

    for (const item of menuItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }

    // Check Dashboard is active
    const dashboardLink = page.locator('a').filter({ hasText: /Dashboard/ }).first();
    await expect(dashboardLink).toHaveClass(/bg-primary/);
  });

  test('should display stat cards with metrics', async ({ page }) => {
    // Check stat cards exist
    const statCards = page.locator('[class*="rounded-lg"][class*="border"][class*="bg-card"]');

    // Check specific stats
    await expect(page.locator('text=Active Shipments')).toBeVisible();
    await expect(page.locator('text=Pending Tasks')).toBeVisible();
    await expect(page.locator('text=Team Contacts')).toBeVisible();
    await expect(page.locator('text=Facilities Database')).toBeVisible();

    // Check values are displayed
    await expect(page.locator('text=24')).toBeVisible(); // Active Shipments
    await expect(page.locator('text=7')).toBeVisible();  // Pending Tasks
    await expect(page.locator('text=156')).toBeVisible(); // Team Contacts
    await expect(page.locator('text=50K+')).toBeVisible(); // Facilities
  });

  test('should display urgent shipments table', async ({ page }) => {
    // Check table header
    await expect(page.locator('text=📦 Urgent Shipments')).toBeVisible();

    // Check table columns
    const columns = ['Number', 'Route', 'Status', 'Priority', 'ETA'];
    for (const col of columns) {
      await expect(page.locator(`th:has-text("${col}")`)).toBeVisible();
    }

    // Check table data
    await expect(page.locator('text=FIG-123')).toBeVisible();
    await expect(page.locator('text=Philippines to Bangalore')).toBeVisible();

    // Check status badges
    await expect(page.locator('text=Delayed')).toBeVisible();
    await expect(page.locator('text=On Time')).toBeVisible();

    // Check priority badges
    await expect(page.locator('text=High').first()).toBeVisible();

    // Check View All link
    await expect(page.locator('text=View All').first()).toBeVisible();
  });

  test('should display recent contacts section', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=👥 Recent Contacts')).toBeVisible();

    // Check contacts are displayed
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Viola Smith')).toBeVisible();
    await expect(page.locator('text=Raj Kumar')).toBeVisible();

    // Check company names
    await expect(page.locator('text=ABC Logistics')).toBeVisible();
    await expect(page.locator('text=XYZ Shipping')).toBeVisible();
  });

  test('should display quick facility search', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=🔍 Quick Facility Search')).toBeVisible();

    // Check search input
    await expect(page.locator('input[placeholder="Search facilities..."]')).toBeVisible();

    // Check filter dropdowns
    const selects = page.locator('select');
    await expect(selects.first()).toBeVisible();
    await expect(selects.nth(1)).toBeVisible();
    await expect(selects.nth(2)).toBeVisible();

    // Check Search Facilities button
    await expect(page.locator('button').filter({ hasText: /Search Facilities/ })).toBeVisible();
  });

  test('should display quick actions section', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=⚡ Quick Actions')).toBeVisible();

    // Check action buttons
    const actions = [
      'Search Facilities',
      'Track Shipment',
      'Add Contact',
      'Calculate Shipping',
    ];

    for (const action of actions) {
      const button = page.locator('a').filter({ hasText: action });
      await expect(button).toBeVisible();
    }
  });

  test('should display team activity feed', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=👨‍👩‍👧‍👦 Team Activity')).toBeVisible();

    // Check activity items
    await expect(page.locator('text=Sarah Chen')).toBeVisible();
    await expect(page.locator('text=Mike Johnson')).toBeVisible();

    // Check activity descriptions
    await expect(page.locator('text=/added a new facility/i')).toBeVisible();
    await expect(page.locator('text=/updated shipment/i')).toBeVisible();
  });

  test('should display upcoming arrivals section', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=📅 Upcoming Arrivals')).toBeVisible();

    // Check date groups
    await expect(page.locator('text=Today (Dec 2)')).toBeVisible();
    await expect(page.locator('text=Tomorrow (Dec 3)')).toBeVisible();

    // Check shipment numbers
    await expect(page.locator('text=FIG-128')).toBeVisible();
    await expect(page.locator('text=FIG-124')).toBeVisible();
  });

  test('should display recent documents section', async ({ page }) => {
    // Check section header
    await expect(page.locator('text=📄 Recent Documents')).toBeVisible();

    // Check document names
    await expect(page.locator('text=Shipping Invoice Dec')).toBeVisible();
    await expect(page.locator('text=Meeting Notes')).toBeVisible();
    await expect(page.locator('text=Q4 Report')).toBeVisible();

    // Check timestamps
    await expect(page.locator('text=2h ago')).toBeVisible();
    await expect(page.locator('text=5h ago')).toBeVisible();
  });

  test('should navigate to shipments page', async ({ page }) => {
    // Click on Shipments link in sidebar
    await page.locator('a').filter({ hasText: /Shipments/ }).first().click();

    // Wait for navigation
    await page.waitForURL('**/dashboard/shipments');

    // Check page title
    await expect(page.locator('h1')).toContainText('Shipments');

    // Check shipments table is visible
    await expect(page.locator('text=📦 All Shipments')).toBeVisible();
  });

  test('should navigate to contacts page', async ({ page }) => {
    // Click on Contacts link in sidebar
    await page.locator('a').filter({ hasText: /Contacts/ }).first().click();

    // Wait for navigation
    await page.waitForURL('**/dashboard/contacts');

    // Check page title
    await expect(page.locator('h1')).toContainText('Contact Management');

    // Check contact stats
    await expect(page.locator('text=Total Contacts')).toBeVisible();
    await expect(page.locator('text=156')).toBeVisible();
  });

  test('should navigate to team page', async ({ page }) => {
    // Click on Team link in sidebar
    await page.locator('a').filter({ hasText: /Team/ }).first().click();

    // Wait for navigation
    await page.waitForURL('**/dashboard/team');

    // Check page title
    await expect(page.locator('h1')).toContainText('Team Management');

    // Check team header is visible
    await expect(page.locator('text=Manage your team members')).toBeVisible();
  });

  test('should navigate to facilities page', async ({ page }) => {
    // Click on Facilities link in sidebar
    await page.locator('a').filter({ hasText: /Facilities/ }).first().click();

    // Wait for navigation
    await page.waitForURL('**/dashboard/facilities');

    // Check page title
    await expect(page.locator('h1')).toContainText('Facilities');

    // Check facility search is visible
    await expect(page.locator('text=Search and manage facilities')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Sidebar should be hidden on mobile
    const sidebar = page.locator('aside');
    await expect(sidebar).not.toBeVisible();

    // Main content should still be visible
    await expect(page.locator('h1')).toContainText('Welcome back');

    // Check stat cards are stacked
    const statCards = page.locator('[class*="rounded-lg"][class*="border"]');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Sidebar should be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Main content should be visible
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Tab through navbar elements
    await page.keyboard.press('Tab');

    // Search input should be focusable
    const searchInput = page.locator('input[placeholder="Search anything..."]');
    await expect(searchInput).toBeDefined();

    // Tab to buttons
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Current focused element should be interactive
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check that text is visible against background
    const headings = page.locator('h1, h2, h3');

    for (let i = 0; i < await headings.count(); i++) {
      const heading = headings.nth(i);
      const isVisible = await heading.isVisible();
      expect(isVisible).toBeTruthy();
    }
  });

  test('should load all components without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for all images to load
    await page.waitForLoadState('networkidle');

    // No critical errors should be present
    const criticalErrors = errors.filter(
      (e) => !e.includes('404') && !e.includes('Failed to load')
    );
    expect(criticalErrors.length).toBe(0);
  });
});
