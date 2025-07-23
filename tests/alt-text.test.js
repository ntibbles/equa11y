const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Alt Text Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let altTextScriptContent = await fs.readFile(
            './scripts/alt-text.js',
            'utf8'
        );
        altTextScriptContent = altTextScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(altTextScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should display alt text when the feature is enabled', async () => {
        await page.evaluate(() => {
            toggleAltTextDisplay(true);
        });

        const altTextElement = await page.$('.equa11y-alt');
        expect(altTextElement).not.toBeNull();
    });

    it('should remove alt text when the feature is disabled', async () => {
        await page.evaluate(() => {
            toggleAltTextDisplay(true); // Enable first
            toggleAltTextDisplay(false); // Then disable
        });

        const altTextElement = await page.$('.equa11y-alt');
        expect(altTextElement).toBeNull();
    });
});