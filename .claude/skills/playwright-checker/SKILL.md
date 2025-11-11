---
name: Playwright Browser Tester
description: Browser testing using Playwright MCP for HireXp UI components, interactions, and visual regression
---

# Playwright Browser Tester

Interactive browser testing for HireXp using Playwright MCP tools for UI component validation, user interactions, and visual testing directly in the browser.

## Context

Playwright MCP provides direct browser automation for testing:
- **Playwright MCP Tools** - Native browser automation via MCP protocol
- **Interactive Testing** - Test components and flows in real browser
- **Visual Testing** - Screenshots for regression detection
- **Accessibility Validation** - Snapshot-based accessibility verification
- **No Configuration** - No test file setup needed, use tools directly
- **Browser Control** - Full control over navigation, interaction, and inspection

## Available Playwright MCP Tools

### Navigation Tools
- `mcp__playwright__browser_navigate` - Navigate to URL
- `mcp__playwright__browser_navigate_back` - Go back to previous page
- `mcp__playwright__browser_tabs` - Manage browser tabs (list, new, close, select)

### Interaction Tools
- `mcp__playwright__browser_click` - Click elements
- `mcp__playwright__browser_type` - Type text into fields
- `mcp__playwright__browser_press_key` - Press keyboard keys
- `mcp__playwright__browser_hover` - Hover over elements
- `mcp__playwright__browser_select_option` - Select dropdown options
- `mcp__playwright__browser_drag` - Drag and drop elements
- `mcp__playwright__browser_fill_form` - Fill multiple form fields at once

### Inspection Tools
- `mcp__playwright__browser_snapshot` - Capture accessibility snapshot (BETTER than screenshot for testing)
- `mcp__playwright__browser_take_screenshot` - Take visual screenshot (png/jpeg)
- `mcp__playwright__browser_console_messages` - Get console logs/errors
- `mcp__playwright__browser_network_requests` - View network activity
- `mcp__playwright__browser_evaluate` - Execute JavaScript on page

### Control Tools
- `mcp__playwright__browser_resize` - Change viewport size
- `mcp__playwright__browser_close` - Close browser
- `mcp__playwright__browser_handle_dialog` - Handle alerts/confirms/prompts
- `mcp__playwright__browser_file_upload` - Upload files
- `mcp__playwright__browser_wait_for` - Wait for text or time

### Configuration
- `mcp__playwright__browser_install` - Install browser binaries if needed

## Playwright MCP vs E2E Testing

```markdown
Traditional E2E Testing:
- Write test files (.spec.ts files)
- Run test suite independently
- Tests are scripted and static
- Good for CI/CD automation
- Requires test maintenance

Playwright MCP Browser Testing:
- No test files needed
- Test interactively in real-time
- Dynamic and exploratory
- Perfect for immediate feedback
- Great for component validation
- Ideal for visual regression checking
- Better for debugging issues
```

**Use Playwright MCP when**:
✅ Testing individual components
✅ Verifying UI changes
✅ Debugging rendering issues
✅ Testing interactive features
✅ Validating accessibility
✅ Quick manual verification

## Testing Philosophy

### 1. Accessibility-First Testing
**ALWAYS use `browser_snapshot` instead of `take_screenshot` for testing**

```markdown
Why browser_snapshot is better:
✅ Returns structured accessibility tree
✅ Shows element roles, names, labels
✅ Includes keyboard navigation info
✅ Faster than visual screenshots
✅ Better for assertions
✅ No image processing needed

Use take_screenshot ONLY for:
- Visual regression testing
- Documentation
- Bug reports
```

### 2. Test User Flows, Not Implementation
Focus on what users do, not how the code works:

```typescript
❌ Bad - Testing implementation
test('useState updates correctly', () => {
  // Don't test React internals
});

✅ Good - Testing user behavior
test('user can submit registration form', () => {
  // Test actual user actions
});
```

### 3. Element Selection Best Practices
Use semantic selectors in order of preference:

```typescript
// 1. Role-based (best for accessibility)
{ element: 'Sign In button', ref: 'button[role="button"]' }

// 2. Label-based (good for forms)
{ element: 'Email input', ref: 'input[name="email"]' }

// 3. Text-based (for links/buttons)
{ element: 'Create Account link', ref: 'a:has-text("Create Account")' }

// 4. Test IDs (last resort)
{ element: 'Submit button', ref: '[data-testid="submit-btn"]' }
```

## Quick Start: Browser Testing Workflow

### 1. Navigate to URL
```
mcp__playwright__browser_navigate({ url: 'http://localhost:3000' })
```

### 2. Inspect Current State
```
mcp__playwright__browser_snapshot() → Returns accessibility tree
```

### 3. Interact with Elements
```
mcp__playwright__browser_click({ element: 'Button name', ref: 'button.primary' })
mcp__playwright__browser_type({ element: 'Email input', ref: 'input[type="email"]', text: 'user@example.com' })
mcp__playwright__browser_fill_form({ fields: [...] })
```

### 4. Wait for Changes
```
mcp__playwright__browser_wait_for({ text: 'Success message' })
```

### 5. Verify Results
```
mcp__playwright__browser_snapshot() → Check updated state
mcp__playwright__browser_take_screenshot({ filename: 'result.png' })
mcp__playwright__browser_console_messages({ onlyErrors: true }) → Check for errors
```

## Testing Patterns

### Pattern 1: Component Interaction Testing

```markdown
## Test: Button Click Interaction

**What to test**: Button responds to clicks and updates UI

**Steps**:

1. Navigate to component
   - Use: mcp__playwright__browser_navigate({ url: 'http://localhost:3000/components/button' })

2. Get initial state
   - Use: mcp__playwright__browser_snapshot()
   - Note: Current button state

3. Click button
   - Use: mcp__playwright__browser_click({ element: 'Primary button', ref: 'button.primary' })

4. Wait for response
   - Use: mcp__playwright__browser_wait_for({ text: 'Button clicked' })

5. Verify new state
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Success message appears
   - Assert: Button state changed

6. Take screenshot
   - Use: mcp__playwright__browser_take_screenshot({ filename: 'button-clicked.png' })

**Result**: Button correctly handles clicks and updates UI
```

### Pattern 2: Form Validation Testing

```markdown
## Test: Form Input & Validation

**What to test**: Form validates input and prevents invalid submissions

**Steps**:

1. Navigate to form
   - Use: mcp__playwright__browser_navigate({ url: 'http://localhost:3000/register' })

2. Get initial snapshot
   - Use: mcp__playwright__browser_snapshot()

3. Try submitting empty form
   - Use: mcp__playwright__browser_click({ element: 'Submit button', ref: 'button[type="submit"]' })

4. Check for validation errors
   - Use: mcp__playwright__browser_snapshot()
   - Assert: "Email is required" error visible
   - Assert: Form not submitted

5. Fill in invalid email
   - Use: mcp__playwright__browser_type({ element: 'Email input', ref: 'input[type="email"]', text: 'invalid-email' })
   - Use: mcp__playwright__browser_press_key({ key: 'Tab' })

6. Verify email validation
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Email error message appears

7. Fill with valid data
   - Use: mcp__playwright__browser_fill_form({ fields: [
       { name: 'Email', type: 'textbox', ref: '...', value: 'user@example.com' },
       { name: 'Password', type: 'textbox', ref: '...', value: 'SecurePass123!' }
     ]})

8. Submit successfully
   - Use: mcp__playwright__browser_click({ element: 'Submit button', ref: 'button[type="submit"]' })
   - Use: mcp__playwright__browser_wait_for({ text: 'Account created' })

9. Verify success
   - Use: mcp__playwright__browser_snapshot()
   - Use: mcp__playwright__browser_console_messages({ onlyErrors: true })

**Result**: Form validates correctly and submits valid data
```

### Pattern 3: Modal/Dialog Testing

```markdown
## Test: Modal Opens and Closes

**What to test**: Modal dialog appears, can be interacted with, and closes properly

**Steps**:

1. Navigate to page with modal
   - Use: mcp__playwright__browser_navigate({ url: 'http://localhost:3000/components/modal' })

2. Get initial state
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Modal is not visible

3. Click button to open modal
   - Use: mcp__playwright__browser_click({ element: 'Open Modal button', ref: 'button[data-action="open-modal"]' })

4. Wait for modal to appear
   - Use: mcp__playwright__browser_wait_for({ text: 'Modal Title' })

5. Verify modal is visible
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Modal dialog is visible
   - Assert: Focus is on modal

6. Fill modal form (if applicable)
   - Use: mcp__playwright__browser_type({ element: 'Modal input', ref: '...', text: 'Test data' })

7. Submit or close modal
   - Use: mcp__playwright__browser_click({ element: 'Close button', ref: 'button[aria-label="Close"]' })

8. Verify modal closed
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Modal no longer visible
   - Assert: Focus returned to trigger button

**Result**: Modal opens, accepts interaction, and closes properly
```

### Pattern 4: Responsive Layout Testing

```markdown
## Test: Component at Different Viewports

**What to test**: Component layout adapts to different screen sizes

**Steps**:

1. Navigate to component
   - Use: mcp__playwright__browser_navigate({ url: 'http://localhost:3000/components/card' })

2. Test Desktop (1920x1080)
   - Use: mcp__playwright__browser_resize({ width: 1920, height: 1080 })
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Desktop layout correct
   - Use: mcp__playwright__browser_take_screenshot({ filename: 'card-desktop.png' })

3. Test Tablet (768x1024)
   - Use: mcp__playwright__browser_resize({ width: 768, height: 1024 })
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Tablet layout responsive
   - Use: mcp__playwright__browser_take_screenshot({ filename: 'card-tablet.png' })

4. Test Mobile (375x667)
   - Use: mcp__playwright__browser_resize({ width: 375, height: 667 })
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Mobile layout stacked
   - Assert: No horizontal scroll
   - Use: mcp__playwright__browser_take_screenshot({ filename: 'card-mobile.png' })

5. Verify functionality at all sizes
   - Use: mcp__playwright__browser_click({ element: 'Card button', ref: '...' })
   - Use: mcp__playwright__browser_snapshot()
   - Assert: Works on all sizes

**Result**: Component responsive and functional across all viewports
```

### Pattern 5: Dropdown/Select Testing

```markdown
## Test: Dropdown Selection

**What to test**: Dropdown opens, options appear, selection works

**Steps**:

1. Navigate to page with dropdown
   - Use: mcp__playwright__browser_navigate({ url: 'http://localhost:3000/components/select' })

2. Get initial state
   - Use: mcp__playwright__browser_snapshot()

3. Click dropdown to open
   - Use: mcp__playwright__browser_click({ element: 'Level dropdown', ref: 'select[name="level"]' })

4. Wait for options to appear
   - Use: mcp__playwright__browser_wait_for({ text: 'Beginner' })

5. Verify all options visible
   - Use: mcp__playwright__browser_snapshot()
   - Assert: "Beginner" option visible
   - Assert: "Intermediate" option visible
   - Assert: "Advanced" option visible

6. Select option
   - Use: mcp__playwright__browser_select_option({ element: 'Level dropdown', ref: 'select[name="level"]', values: ['intermediate'] })

7. Verify selection
   - Use: mcp__playwright__browser_snapshot()
   - Assert: "Intermediate" now selected
   - Assert: Dropdown closed

8. Take screenshot
   - Use: mcp__playwright__browser_take_screenshot({ filename: 'dropdown-selected.png' })

**Result**: Dropdown selection works correctly
```

## Visual Testing Strategies

### 1. Screenshot Comparison

```markdown
## Baseline Screenshot Creation

**Create baseline images**:
1. Navigate to component
2. Take screenshot: browser_take_screenshot({ filename: 'button-default.png' })
3. Store in .playwright-mcp/

**Regression testing**:
1. Take new screenshot: browser_take_screenshot({ filename: 'button-current.png' })
2. Compare with baseline manually
3. Update baseline if changes are intentional
```

### 2. Component State Testing

```markdown
## Test: Button Component States

**States to test**:
- Default
- Hover
- Active
- Disabled
- Loading

**For each state**:
1. Navigate to component demo
2. Set component state
   - Use: browser_hover() for hover state
   - Use: browser_click() for active state
   - Use: browser_evaluate() to set disabled/loading
3. Take screenshot
   - Use: browser_take_screenshot({ filename: 'button-{state}.png' })
4. Verify visual appearance
```

### 3. Responsive Design Testing

```markdown
## Test: Responsive Layout

**Viewport sizes to test**:
- Mobile: 375x667
- Tablet: 768x1024
- Desktop: 1920x1080

**For each size**:
1. Resize browser
   - Use: browser_resize({ width: 375, height: 667 })

2. Navigate to page
   - Use: browser_navigate('http://localhost:3000')

3. Take screenshot
   - Use: browser_take_screenshot({ filename: 'homepage-mobile-375.png' })

4. Verify layout
   - Use: browser_snapshot()
   - Assert: Mobile menu visible (not desktop nav)
   - Assert: Content stacks vertically
   - Assert: No horizontal scroll
```

## Accessibility Testing

### 1. ARIA Attributes Check

```markdown
## Test: Form Accessibility

**Steps**:

1. Navigate to form
   - Use: browser_navigate('http://localhost:3000/register')

2. Get accessibility snapshot
   - Use: browser_snapshot()

3. Verify ARIA attributes
   - Assert: All inputs have labels
   - Assert: Error messages have role="alert"
   - Assert: Required fields have aria-required="true"
   - Assert: Submit button has role="button"

4. Test keyboard navigation
   - Use: browser_press_key({ key: 'Tab' })
   - Use: browser_snapshot() (check focus indicators)
   - Assert: All form fields are keyboard accessible
   - Assert: Focus order is logical
```

### 2. Screen Reader Testing

```markdown
## Test: Screen Reader Compatibility

**Verify semantic HTML**:

1. Get page snapshot
   - Use: browser_snapshot()

2. Check structure
   - Assert: Headings use h1-h6 (not div with styles)
   - Assert: Buttons use <button> (not div with onClick)
   - Assert: Links use <a> with href
   - Assert: Lists use <ul>/<ol>
   - Assert: Forms have fieldset/legend

3. Check ARIA labels
   - Assert: Icon buttons have aria-label
   - Assert: Complex components have aria-describedby
   - Assert: Dynamic regions have aria-live
```

## Network Testing

### 1. API Request Monitoring

```markdown
## Test: Form Submission Network Activity

**Steps**:

1. Clear network log
   - Start with fresh page load

2. Fill and submit form
   - Use: browser_fill_form() and browser_click()

3. Check network requests
   - Use: browser_network_requests()
   - Assert: POST request to /api/register
   - Assert: Status code 200
   - Assert: Response contains expected data
   - Assert: No 4xx/5xx errors

4. Verify loading states
   - Use: browser_snapshot() (during submission)
   - Assert: Submit button shows loading spinner
   - Assert: Button is disabled during submission
```

### 2. Error Handling Testing

```markdown
## Test: Network Failure Handling

**Steps**:

1. Navigate to form
   - Use: browser_navigate('http://localhost:3000/contact')

2. Simulate network error (via browser_evaluate)
   - Use: browser_evaluate({
       function: '() => { window.fetch = () => Promise.reject(new Error("Network error")) }'
     })

3. Submit form
   - Use: browser_click({ element: 'Submit button', ref: '...' })

4. Verify error handling
   - Use: browser_snapshot()
   - Assert: Error message displayed
   - Assert: User can retry
   - Assert: Form data not lost
```

## Console Error Detection

```markdown
## Test: JavaScript Error Monitoring

**Run this check on every test**:

1. Perform test actions
   - (Any user interaction)

2. Check console errors
   - Use: browser_console_messages({ onlyErrors: true })

3. Assert no errors
   - No uncaught exceptions
   - No React errors
   - No network errors
   - No CORS issues

**Common errors to watch for**:
- "Cannot read property of undefined"
- "Failed to fetch"
- "Hydration failed"
- "Maximum update depth exceeded"
```

## Performance Testing

### 1. Page Load Testing

```markdown
## Test: Initial Page Load Performance

**Steps**:

1. Navigate to page
   - Use: browser_navigate('http://localhost:3000')

2. Wait for load
   - Use: browser_wait_for({ time: 1 }) // 1 second

3. Check console for performance warnings
   - Use: browser_console_messages()
   - Assert: No "Long task" warnings
   - Assert: No "Layout shift" warnings

4. Take screenshot when fully loaded
   - Use: browser_take_screenshot({ filename: 'page-loaded.png' })
```

### 2. Interaction Performance

```markdown
## Test: Form Input Responsiveness

**Steps**:

1. Navigate to form
   - Use: browser_navigate('http://localhost:3000/register')

2. Type rapidly
   - Use: browser_type({ element: 'Email field', ref: '...', text: 'test@example.com', slowly: false })

3. Check responsiveness
   - Use: browser_snapshot()
   - Assert: All characters appear
   - Assert: No lag or delay
   - Assert: Validation triggers immediately

4. Check console for performance issues
   - Use: browser_console_messages()
   - Assert: No "Forced reflow" warnings
```

## Multi-Tab Testing

```markdown
## Test: Multiple Tab Handling

**Steps**:

1. Open first tab
   - Use: browser_navigate('http://localhost:3000')

2. Open new tab
   - Use: browser_tabs({ action: 'new' })

3. Navigate in new tab
   - Use: browser_navigate('http://localhost:3000/login')

4. List all tabs
   - Use: browser_tabs({ action: 'list' })
   - Assert: Two tabs exist

5. Switch between tabs
   - Use: browser_tabs({ action: 'select', index: 0 })
   - Use: browser_snapshot()
   - Assert: On homepage

   - Use: browser_tabs({ action: 'select', index: 1 })
   - Use: browser_snapshot()
   - Assert: On login page

6. Close tab
   - Use: browser_tabs({ action: 'close', index: 1 })
   - Assert: Only one tab remains
```

## Dialog Handling

```markdown
## Test: Confirm Dialog Handling

**Steps**:

1. Navigate to page with dialogs
   - Use: browser_navigate('http://localhost:3000/dashboard')

2. Trigger confirmation dialog
   - Use: browser_click({ element: 'Delete button', ref: '...' })

3. Handle dialog
   - Use: browser_handle_dialog({ accept: false })
   - Assert: Action cancelled

4. Trigger again and accept
   - Use: browser_click({ element: 'Delete button', ref: '...' })
   - Use: browser_handle_dialog({ accept: true })
   - Assert: Item deleted
```

## File Upload Testing

```markdown
## Test: Profile Picture Upload

**Steps**:

1. Navigate to profile settings
   - Use: browser_navigate('http://localhost:3000/profile')

2. Click upload button
   - Use: browser_click({ element: 'Upload Photo button', ref: '...' })

3. Upload file
   - Use: browser_file_upload({ paths: ['/absolute/path/to/test-image.jpg'] })

4. Verify upload
   - Use: browser_wait_for({ text: 'Upload successful' })
   - Use: browser_snapshot()
   - Assert: Preview image appears
   - Assert: File name displayed

5. Check network request
   - Use: browser_network_requests()
   - Assert: POST to /api/upload/avatar
   - Assert: Response includes Cloudinary URL
```

## Best Practices

### 1. Always Use Descriptive Element Names

```markdown
❌ Bad:
browser_click({ element: 'button', ref: 'button[type="submit"]' })

✅ Good:
browser_click({ element: 'Create Account button', ref: 'button[type="submit"]' })
```

### 2. Wait for State Changes

```markdown
❌ Bad:
browser_click({ element: 'Submit', ref: '...' })
browser_snapshot() // Might run before action completes

✅ Good:
browser_click({ element: 'Submit', ref: '...' })
browser_wait_for({ text: 'Success' })
browser_snapshot()
```

### 3. Use Snapshots for Assertions, Screenshots for Visual Review

```markdown
✅ For testing logic:
browser_snapshot() // Returns structured data

✅ For visual review:
browser_take_screenshot({ filename: 'feature-x.png' })
```

### 4. Check Console After Every Interaction

```markdown
✅ Pattern:
1. Perform action
2. Check console: browser_console_messages({ onlyErrors: true })
3. Assert no errors
```

### 5. Test Real User Flows, Not Isolated Actions

```markdown
❌ Bad:
test('button renders')
test('button has correct class')
test('button is clickable')

✅ Good:
test('user can complete registration flow')
```

## Interactive Testing Workflow

### Step 1: Plan What to Test

Ask yourself:
1. What component or feature do I want to test?
2. What user interactions should I verify?
3. What should the output look like?
4. Are there error states to check?

### Step 2: Start Browser & Navigate

```
1. Navigate to component/page
   mcp__playwright__browser_navigate({ url: 'http://localhost:3000/...' })

2. Get initial state
   mcp__playwright__browser_snapshot()
   → Review accessibility tree to understand structure
```

### Step 3: Interact with Component

```
Use appropriate tool based on action:
- Click: mcp__playwright__browser_click()
- Type: mcp__playwright__browser_type()
- Select: mcp__playwright__browser_select_option()
- Hover: mcp__playwright__browser_hover()
- Drag: mcp__playwright__browser_drag()
- Fill form: mcp__playwright__browser_fill_form()
```

### Step 4: Wait & Verify

```
1. Wait for expected changes
   mcp__playwright__browser_wait_for({ text: 'Success message' })

2. Check new state
   mcp__playwright__browser_snapshot()

3. Take screenshot if needed
   mcp__playwright__browser_take_screenshot({ filename: 'result.png' })

4. Check for errors
   mcp__playwright__browser_console_messages({ onlyErrors: true })
```

### Step 5: Document Findings

Note what worked, what failed, and any issues:
- ✅ Component behaves as expected
- ❌ Issue found (describe)
- 🚨 Error in console (describe)
- 📸 Screenshots captured (list)

## HireXp-Specific Test Scenarios

### 1. Template Management Testing

```markdown
## Critical Flows to Test:

✅ Admin creates template via wizard
✅ Admin edits existing template
✅ Admin assigns template to trainees
✅ Admin clones template
✅ Admin archives template
✅ Trainee views assigned templates
✅ Trainee filters templates by type/difficulty
```

### 2. Authentication Testing

```markdown
## Critical Flows to Test:

✅ User registers (TRAINEE, COMPANY, INSTRUCTOR)
✅ User verifies email
✅ User logs in
✅ User resets password
✅ User logs out
✅ Protected routes redirect to login
✅ Session persistence
✅ Account lockout after 5 failed attempts
```

### 3. Dashboard Testing

```markdown
## Critical Flows to Test:

✅ Trainee dashboard displays progress
✅ Trainee completes training module
✅ Company views candidate pool
✅ Company filters candidates
✅ Admin manages users
✅ Admin views analytics
```

## Debugging Tips

### 1. Get Visual Context

```markdown
When test fails:
1. Take screenshot: browser_take_screenshot()
2. Get snapshot: browser_snapshot()
3. Check console: browser_console_messages()
4. Check network: browser_network_requests()
```

### 2. Slow Down Actions

```markdown
For flaky tests:
- Use: browser_type({ slowly: true })
- Add: browser_wait_for({ time: 1 })
- Check: browser_snapshot() between actions
```

### 3. Verify Element Exists Before Interacting

```markdown
Pattern:
1. browser_snapshot()
2. Verify element is in snapshot
3. Then: browser_click/type/etc
```

## Quick Checklist

Before testing:
- [ ] Development server is running (`npm run dev`)
- [ ] App is accessible at `http://localhost:3000`
- [ ] You know what component/page to test
- [ ] Browser can be installed if needed

## When to Use Each Tool

| Task | Tool | Example |
|------|------|---------|
| **Verify current state** | `browser_snapshot()` | Check what's on screen |
| **Navigate to page** | `browser_navigate()` | Go to new URL |
| **Click element** | `browser_click()` | Trigger button action |
| **Type in field** | `browser_type()` | Enter form data |
| **Select dropdown** | `browser_select_option()` | Choose from list |
| **Wait for text** | `browser_wait_for()` | Wait for response |
| **Check errors** | `browser_console_messages()` | Look for bugs |
| **Take screenshot** | `browser_take_screenshot()` | Document visual |
| **Check requests** | `browser_network_requests()` | Monitor API calls |

## Your Task

When testing with Playwright MCP:

1. **Identify what to test**:
   - Which component or page?
   - What's the user action?
   - What's the expected result?

2. **Execute interactively**:
   - Navigate to component
   - Get snapshot to see structure
   - Perform interactions
   - Wait for changes
   - Verify results

3. **Capture evidence**:
   - Use snapshots for verification
   - Take screenshots for documentation
   - Check console for errors
   - Note any issues found

4. **Report findings**:
   - ✅ What worked?
   - ❌ What failed?
   - 🚨 Any errors?
   - 📸 Visual proof?

**Pro tip**: Use `browser_snapshot()` for assertions, `browser_take_screenshot()` for visual documentation!
