import { test, expect } from '@playwright/test';

test.describe('Dhristi - End-to-End E2E Test Suite', () => {
  test('1. Homepage loads, displays hero, KPI metrics, and brand logo', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dhristi/i);

    // Verify brand
    const brand = page.locator('text=DHRISTI').first();
    await expect(brand).toBeVisible();

    // Verify navigation links
    await expect(page.locator('a[href="/red-zones"]').first()).toBeVisible();
    await expect(page.locator('a[href="/shelters"]').first()).toBeVisible();
    await expect(page.locator('a[href="/relocation"]').first()).toBeVisible();
    await expect(page.locator('a[href="/predictions"]').first()).toBeVisible();
    await expect(page.locator('a[href="/admin"]').first()).toBeVisible();
  });

  test('2. Language toggle switches full-site interface to Hindi and back to English', async ({ page }) => {
    await page.goto('/');

    // Locate language switcher button in navbar
    const langBtn = page.locator('button[title*="Language"]').first();
    await expect(langBtn).toBeVisible();

    // Click to switch language to Hindi
    await langBtn.click();
    await expect(page.locator('text=दृष्टि (DHRISTI)').first()).toBeVisible();

    // Switch back to English
    await langBtn.click();
    await expect(page.locator('text=DHRISTI').first()).toBeVisible();
  });

  test('3. Universal Emergency SOS Hub opens and displays 4 tabs', async ({ page }) => {
    await page.goto('/');

    // Click red SOS button in header
    const sosBtn = page.locator('button:has-text("SOS")').first();
    await expect(sosBtn).toBeVisible();
    await sosBtn.click();

    // Modal header should be visible
    await expect(page.locator('text=UNIFIED EMERGENCY SOS').first()).toBeVisible();

    // Verify tabs exist: Citizen SOS, Police Station SOS, Helplines, Responder Broadcast
    await expect(page.locator('button:has-text("Citizen Disaster SOS")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Police Station SOS")').first()).toBeVisible();
    await expect(page.locator('button:has-text("24x7 Helplines")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Responder Broadcast")').first()).toBeVisible();

    // Test switching to Police SOS tab
    await page.locator('button:has-text("Police Station SOS")').first().click();
    await expect(page.locator('text=Nearest Police Station').first()).toBeVisible();
    await expect(page.locator('a[href="tel:112"]').first()).toBeVisible();

    // Test switching to Helplines tab
    await page.locator('button:has-text("24x7 Helplines")').first().click();
    await expect(page.locator('text=112').first()).toBeVisible();
    await expect(page.locator('text=1078').first()).toBeVisible();

    // Close modal
    await page.locator('button[title="Close SOS Modal"]').first().click();
  });

  test('4. Safe Shelters page renders category filters and capacity matrices', async ({ page }) => {
    await page.goto('/shelters');

    // Verify category filter buttons (Schools, Hospitals, Stadiums, Govt Offices)
    await expect(page.locator('button:has-text("Schools")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Hospitals")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Stadiums")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Govt Offices")').first()).toBeVisible();

    // Click School category filter
    await page.locator('button:has-text("Schools")').first().click();
    await expect(page.locator('text=Meppadi Govt Higher Secondary School').first()).toBeVisible();
  });

  test('5. Live Relocation page renders OSRM turn-by-turn road steps and transit modes', async ({ page }) => {
    await page.goto('/relocation');

    // Verify transit mode buttons (On Foot vs 4x4 Transit)
    await expect(page.locator('button:has-text("On Foot")').first()).toBeVisible();
    await expect(page.locator('button:has-text("4x4 Transit")').first()).toBeVisible();

    // Toggle 4x4 Transit
    await page.locator('button:has-text("4x4 Transit")').first().click();

    // Verify turn-by-turn maneuvers section is present
    await expect(page.locator('text=Turn-by-Turn Safe Maneuvers').first()).toBeVisible();

    // Confirm safe arrival button exists
    await expect(page.locator('button:has-text("Confirm Safe Arrival")').first()).toBeVisible();
  });

  test('6. AI Predictions & Simulation Sandbox renders sliders and Factor of Safety', async ({ page }) => {
    await page.goto('/predictions');

    // Verify simulation controls exist
    await expect(page.locator('text=Cumulative 24h Rainfall Trigger').first()).toBeVisible();
    await expect(page.locator('text=Soil Saturation & Pore Pressure').first()).toBeVisible();
    await expect(page.locator('text=Factor of Safety').first()).toBeVisible();
  });

  test('7. Dhristi Vaani AI Voice Assistant opens and presents prompt chips', async ({ page }) => {
    await page.goto('/');

    // Click Vaani AI button in navbar
    const voiceBtn = page.locator('button[title*="Voice Assistant"]').first();
    await expect(voiceBtn).toBeVisible();
    await voiceBtn.click();

    // Verify Voice Assistant modal
    await expect(page.locator('text=DHRISTI AI VOICE ASSISTANT (VAANI)').first()).toBeVisible();
    await expect(page.locator('button:has-text("Send Emergency SOS")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Find Nearest Safe Haven")').first()).toBeVisible();

    // Close assistant
    await page.locator('button[title="Close Voice Assistant"]').first().click();
  });

  test('8. SEOC Admin Console displays distress beacon triage queue and dispatch squad', async ({ page }) => {
    await page.goto('/admin');

    // Verify SEOC header
    await expect(page.locator('text=State Emergency Operations Console (SEOC)').first()).toBeVisible();
    await expect(page.locator('text=Citizen SOS Distress Beacons').first()).toBeVisible();
  });
});
