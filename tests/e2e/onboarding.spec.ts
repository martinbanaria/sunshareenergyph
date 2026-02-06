import { test, expect } from '@playwright/test';

test.describe('SunShare Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('should complete full onboarding flow', async ({ page }) => {
    // Step 1: Account Creation
    await test.step('Step 1: Account Creation', async () => {
      await expect(page.locator('h1')).toContainText('Join SunShare');
      await expect(page.locator('text=Create Account')).toBeVisible();

      // Fill account details
      await page.fill('input[name="fullName"]', 'Test User Manila');
      await page.fill('input[name="email"]', `test+${Date.now()}@example.com`);
      await page.fill('input[name="phone"]', '+639171234567');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

      // Note: Skip hCaptcha in testing environment
      // You might need to mock this or use a test key
      
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    });

    // Step 2: ID Upload
    await test.step('Step 2: ID Upload', async () => {
      await expect(page.locator('text=Upload ID')).toBeVisible();

      // Select ID type
      await page.selectOption('select[name="idType"]', 'philid');

      // Upload test image (you'll need a test image file)
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./tests/fixtures/sample-id.jpg');

      // Wait for OCR processing
      await page.waitForSelector('text=Processing complete', { timeout: 30000 });

      await page.click('button:has-text("Continue")');
    });

    // Step 3: Property Details
    await test.step('Step 3: Property Details', async () => {
      await expect(page.locator('text=Property Details')).toBeVisible();

      await page.selectOption('select[name="propertyType"]', 'residential');
      await page.selectOption('select[name="propertyOwnership"]', 'owner');
      
      await page.fill('input[name="streetAddress"]', '123 Makati Avenue');
      await page.fill('input[name="barangay"]', 'Barangay San Antonio');
      await page.fill('input[name="city"]', 'Makati City');
      await page.fill('input[name="province"]', 'Metro Manila');
      await page.fill('input[name="zipCode"]', '1203');

      await page.click('button:has-text("Continue")');
    });

    // Step 4: Preferences
    await test.step('Step 4: Preferences', async () => {
      await expect(page.locator('text=Preferences')).toBeVisible();

      // Select multiple services
      await page.check('input[value="solar"]');
      await page.check('input[value="bess"]');

      // Select bill range
      await page.selectOption('select[name="monthlyBillRange"]', '5k_10k');

      // Select referral source
      await page.selectOption('select[name="referralSource"]', 'google');

      await page.click('button:has-text("Continue")');
    });

    // Step 5: Review & Submit
    await test.step('Step 5: Review & Submit', async () => {
      await expect(page.locator('text=Review & Submit')).toBeVisible();

      // Verify data is displayed correctly
      await expect(page.locator('text=Test User Manila')).toBeVisible();
      await expect(page.locator('text=123 Makati Avenue')).toBeVisible();

      // Accept terms
      await page.check('input[name="acceptTerms"]');
      await page.check('input[name="acceptPrivacy"]');
      
      // Optional: Subscribe to newsletter
      await page.check('input[name="subscribeNewsletter"]');

      // Submit form
      await page.click('button:has-text("Complete Registration")');

      // Wait for success page
      await page.waitForURL('**/onboarding/success');
      await expect(page.locator('text=Registration Complete')).toBeVisible();
    });
  });

  test('should handle form validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should save progress and restore on page reload', async ({ page }) => {
    // Fill some data
    await page.fill('input[name="fullName"]', 'Test Progress User');
    await page.fill('input[name="email"]', 'progress@test.com');
    
    // Reload page
    await page.reload();
    
    // Check if data is restored
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Test Progress User');
    await expect(page.locator('input[name="email"]')).toHaveValue('progress@test.com');
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test mobile-specific features
    await expect(page.locator('.mobile-menu')).toBeHidden();
    
    // Test form usability on mobile
    await page.fill('input[name="fullName"]', 'Mobile Test User');
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Mobile Test User');
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/**', route => route.abort());
    
    // Try to submit form
    await page.fill('input[name="fullName"]', 'Network Test User');
    await page.fill('input[name="email"]', 'network@test.com');
    await page.fill('input[name="phone"]', '+639171234567');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=registration failed')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('should load onboarding page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large file uploads', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Fill Step 1 first
    await page.fill('input[name="fullName"]', 'Performance Test User');
    await page.fill('input[name="email"]', 'perf@test.com');
    await page.fill('input[name="phone"]', '+639171234567');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Now test file upload
    await page.selectOption('select[name="idType"]', 'philid');
    
    // Test with maximum allowed file size (close to 10MB)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/large-id.jpg');
    
    // Should handle large file without crashing
    await page.waitForSelector('text=Processing', { timeout: 10000 });
  });
});