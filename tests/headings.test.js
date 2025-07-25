const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Headings Feature', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                `--disable-extensions-except=${process.env.PWD}`,
                `--load-extension=${process.env.PWD}`,
            ],
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let headingsScriptContent = await fs.readFile(
            './scripts/headings.js',
            'utf8'
        );
        headingsScriptContent = headingsScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(headingsScriptContent);
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should display heading levels and highlight skipped levels', async () => {
        await page.evaluate(() => {
            toggleHeadingOutline(true);
        });

        // Check for H1 label
        const h1Label = await page.$('h1 .equa11y-headings');
        expect(h1Label).not.toBeNull();
        const h1LabelText = await page.evaluate(el => el.textContent, h1Label);
        expect(h1LabelText).toBe('H1');

        // Check for H3 label (skipped level) and its red styling
        const h3Label = await page.$('h3 .equa11y-headings');
        expect(h3Label).not.toBeNull();
        const h3LabelText = await page.evaluate(el => el.textContent, h3Label);
        expect(h3LabelText).toBe('H3');
        const h3LabelStyle = await page.evaluate(el => el.style.cssText, h3Label);
        expect(h3LabelStyle).toContain('background-color: rgb(171, 27, 24)'); // #AB1B18

        // Check for H2 label
        const h2Label = await page.$('h2 .equa11y-headings');
        expect(h2Label).not.toBeNull();
        const h2LabelText = await page.evaluate(el => el.textContent, h2Label);
        expect(h2LabelText).toBe('H2');
    });

    it('should remove heading outlines when the feature is disabled', async () => {
        await page.evaluate(() => {
            toggleHeadingOutline(true); // Enable first
            toggleHeadingOutline(false); // Then disable
        });

        const h1Label = await page.$('h1 .equa11y-headings');
        expect(h1Label).toBeNull();
        const h3Label = await page.$('h3 .equa11y-headings');
        expect(h3Label).toBeNull();
        const h2Label = await page.$('h2 .equa11y-headings');
        expect(h2Label).toBeNull();
    });
});
