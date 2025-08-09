const puppeteer = require('puppeteer');
const fs = require('fs').promises;

// Helper HTML for interactive elements
const html = `
<html><body>
  <button id="btn">Button</button>
  <a href="#" id="link">Link</a>
  <input type="checkbox" id="cb">
  <input type="radio" id="radio">
  <input type="text" id="text">
  <input type="submit" id="submit">
  <div role="button" id="rolebtn">Role Button</div>
  <div role="link" id="rolelink">Role Link</div>
</body></html>
`;

describe('toggleTargetSize', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.setContent(html);
    // Read the script content and remove the 'export' keyword
    let scriptContent = await fs.readFile('./scripts/target-size.js', 'utf8');
    scriptContent = scriptContent.replace('export ', '');
    await page.evaluate(scriptContent);
  });

  test('adds labels and classes when enabled', async () => {
    await page.evaluate(() => {
      window.toggleTargetSize(true);
    });
    // Check that labels are present for all interactive elements
    const labelCount = await page.$$eval('.equa11y-label', els => els.length);
    expect(labelCount).toBeGreaterThan(0);
    // Check that at least one element has the equa11y-size class
    const sizeClassCount = await page.$$eval('.equa11y-size', els => els.length);
    expect(sizeClassCount).toBeGreaterThan(0);
    // Check that at least one element has the equa11y-border class
    const borderClassCount = await page.$$eval('.equa11y-border', els => els.length);
    expect(borderClassCount).toBeGreaterThan(0);
    // Check that label text contains px
    const labelText = await page.$eval('.equa11y-label', el => el.textContent);
    expect(labelText).toMatch(/px w x \d+px h/);
  });

  test('removes labels and classes when disabled', async () => {
    await page.evaluate(() => {
      window.toggleTargetSize(true);
    });
    await page.evaluate(() => {
      window.toggleTargetSize(false);
    });
    // No labels or classes should remain
    const labelCount = await page.$$eval('.equa11y-label', els => els.length);
    expect(labelCount).toBe(0);
    const sizeClassCount = await page.$$eval('.equa11y-size', els => els.length);
    expect(sizeClassCount).toBe(0);
    const borderClassCount = await page.$$eval('.equa11y-border', els => els.length);
    expect(borderClassCount).toBe(0);
  });
}); 