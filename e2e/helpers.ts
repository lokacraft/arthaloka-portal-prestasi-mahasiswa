import { Page, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// ============================================================================
// CONSTANTS - Test Credentials (configure via .env.test or environment vars)
// ============================================================================

export const TEST_USERS = {
  mahasiswa: {
    email: process.env.E2E_MAHASISWA_EMAIL || 'mahasiswa.test@telkomuniversity.ac.id',
    password: process.env.E2E_MAHASISWA_PASSWORD || 'TestPassword123!',
    role: 'MAHASISWA',
    expectedRedirect: '/dashboard',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || 'admin.test@telkomuniversity.ac.id',
    password: process.env.E2E_ADMIN_PASSWORD || 'TestPassword123!',
    role: 'ADMIN',
    expectedRedirect: '/admin/dashboard',
  },
  wd: {
    email: process.env.E2E_WD_EMAIL || 'wd.test@telkomuniversity.ac.id',
    password: process.env.E2E_WD_PASSWORD || 'TestPassword123!',
    role: 'WD',
    expectedRedirect: '/wd1/dashboard',
  },
  kaprodi: {
    email: process.env.E2E_KAPRODI_EMAIL || 'kaprodi.test@telkomuniversity.ac.id',
    password: process.env.E2E_KAPRODI_PASSWORD || 'TestPassword123!',
    role: 'KAPRODI',
    expectedRedirect: '/kaprodi/dashboard',
  },
  akreditasi: {
    email: process.env.E2E_AKREDITASI_EMAIL || 'akreditasi.test@telkomuniversity.ac.id',
    password: process.env.E2E_AKREDITASI_PASSWORD || 'TestPassword123!',
    role: 'AKREDITASI',
    expectedRedirect: '/akreditasi/dashboard',
  },
};

export const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Login via UI form (Better Auth - email/password).
 * Handles both accounts with and without 2FA.
 */
export async function loginAs(
  page: Page,
  userType: keyof typeof TEST_USERS
): Promise<void> {
  const user = TEST_USERS[userType];

  await page.goto('/sign-in');
  await expect(page.locator('input[name="email"]')).toBeVisible();

  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');

  // If 2FA is triggered, the page shows a TOTP input
  const totpInput = page.locator('input[name="totp"]');
  const totpVisible = await totpInput.isVisible({ timeout: 3000 }).catch(() => false);

  if (totpVisible) {
    const totpCode = process.env[`E2E_${user.role}_TOTP`] || '';
    if (!totpCode) {
      throw new Error(
        `2FA required for ${userType} but E2E_${user.role}_TOTP env var not set.`
      );
    }
    await page.fill('input[name="totp"]', totpCode);
    await page.click('button[type="submit"]');
  }

  // Wait for redirect to dashboard
  await page.waitForURL((url) => url.pathname !== '/sign-in', { timeout: 15000 });
  await expect(page).toHaveURL(new RegExp(user.expectedRedirect.replace('/', '\\/')));
}

/**
 * Logout by navigating to settings and clicking logout,
 * or directly clearing cookies/storage.
 */
export async function logout(page: Page): Promise<void> {
  // Clear session by deleting cookies (fastest approach for test isolation)
  await page.context().clearCookies();
  await page.goto('/sign-in');
  await expect(page.locator('input[name="email"]')).toBeVisible();
}

// ============================================================================
// FILE HELPERS
// ============================================================================

/**
 * Create a dummy PDF file for upload testing.
 * Returns the path to the temp file.
 */
export function createDummyPdf(filename = 'test-sertifikat.pdf', sizeKb = 100): string {
  const tmpDir = path.join(process.cwd(), 'e2e', 'fixtures');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const filePath = path.join(tmpDir, filename);
  if (!fs.existsSync(filePath)) {
    // Create a minimal valid-looking PDF (for type validation)
    const pdfHeader = Buffer.from('%PDF-1.4\n%âãÏÓ\n');
    const padding = Buffer.alloc(sizeKb * 1024 - pdfHeader.length, 'A');
    fs.writeFileSync(filePath, Buffer.concat([pdfHeader, padding]));
  }
  return filePath;
}

/**
 * Create a dummy PNG file for upload testing.
 */
export function createDummyPng(filename = 'test-bukti.png', sizeKb = 50): string {
  const tmpDir = path.join(process.cwd(), 'e2e', 'fixtures');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const filePath = path.join(tmpDir, filename);
  if (!fs.existsSync(filePath)) {
    // Minimal valid PNG header + IEND chunk + padding
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const padding = Buffer.alloc(sizeKb * 1024 - pngSignature.length, 0);
    fs.writeFileSync(filePath, Buffer.concat([pngSignature, padding]));
  }
  return filePath;
}

/**
 * Create a large dummy file that exceeds 20MB for validation testing.
 */
export function createLargeFile(filename = 'test-oversized.pdf', sizeMb = 21): string {
  const tmpDir = path.join(process.cwd(), 'e2e', 'fixtures');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const filePath = path.join(tmpDir, filename);
  if (!fs.existsSync(filePath)) {
    const pdfHeader = Buffer.from('%PDF-1.4\n');
    const padding = Buffer.alloc(sizeMb * 1024 * 1024 - pdfHeader.length, 'A');
    fs.writeFileSync(filePath, Buffer.concat([pdfHeader, padding]));
  }
  return filePath;
}

// ============================================================================
// WAIT / ASSERTION HELPERS
// ============================================================================

/**
 * Wait for a toast/sonner notification to appear with specific text.
 */
export async function expectToast(page: Page, text: string | RegExp): Promise<void> {
  // Sonner renders toasts with [data-sonner-toast] attribute
  const toast = page.locator('[data-sonner-toast]').filter({ hasText: text });
  await expect(toast).toBeVisible({ timeout: 10000 });
}

/**
 * Wait for a success toast notification.
 */
export async function expectSuccessToast(page: Page): Promise<void> {
  const toast = page.locator('[data-sonner-toast][data-type="success"]');
  await expect(toast).toBeVisible({ timeout: 10000 });
}

/**
 * Wait for an error toast notification.
 */
export async function expectErrorToast(page: Page, message?: string | RegExp): Promise<void> {
  const toast = page.locator('[data-sonner-toast][data-type="error"]');
  await expect(toast).toBeVisible({ timeout: 10000 });
  if (message) {
    await expect(toast).toContainText(message);
  }
}

/**
 * Dismiss all visible toasts.
 */
export async function dismissToasts(page: Page): Promise<void> {
  const toasts = page.locator('[data-sonner-toast]');
  const count = await toasts.count();
  for (let i = 0; i < count; i++) {
    await toasts.nth(i).click({ force: true }).catch(() => {});
  }
}

// ============================================================================
// FORM HELPERS
// ============================================================================

/**
 * Select a date from the react-day-picker calendar popover.
 * Clicks the trigger button and selects the day number.
 */
export async function selectCalendarDate(
  page: Page,
  triggerSelector: string,
  day: number
): Promise<void> {
  await page.click(triggerSelector);
  // Wait for calendar to appear
  await page.waitForSelector('[role="grid"]', { timeout: 5000 });
  // Click on the day
  await page.click(`[role="gridcell"] >> text="${day}"`);
}
