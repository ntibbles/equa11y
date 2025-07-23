const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Landmarks Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let landmarksScriptContent = await fs.readFile(
            './scripts/landmarks.js',
            'utf8'
        );
        landmarksScriptContent = landmarksScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(landmarksScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should display landmark outlines when the feature is enabled', async () => {
        await page.evaluate(() => {
            toggleLandmarkOutlines(true);
        });

        const headerLabel = await page.$('header .equa11y-landmarks');
        expect(headerLabel).not.toBeNull();
        const headerLabelText = await page.evaluate(el => el.textContent, headerLabel);
        expect(headerLabelText).toContain('header');

        const navLabel = await page.$('nav .equa11y-landmarks');
        expect(navLabel).not.toBeNull();
        const navLabelText = await page.evaluate(el => el.textContent, navLabel);
        expect(navLabelText).toContain('nav');

        const mainLabel = await page.$('main .equa11y-landmarks');
        expect(mainLabel).not.toBeNull();
        const mainLabelText = await page.evaluate(el => el.textContent, mainLabel);
        expect(mainLabelText).toContain('main');

        const footerLabel = await page.$('footer .equa11y-landmarks');
        expect(footerLabel).not.toBeNull();
        const footerLabelText = await page.evaluate(el => el.textContent, footerLabel);
        expect(footerLabelText).toContain('footer');

        const customRegionLabel = await page.$('[role="region"] .equa11y-landmarks');
        expect(customRegionLabel).not.toBeNull();
        const customRegionLabelText = await page.evaluate(el => el.textContent, customRegionLabel);
        expect(customRegionLabelText).toContain('Custom Region [region]');
    });

    it('should remove landmark outlines when the feature is disabled', async () => {
        await page.evaluate(() => {
            toggleLandmarkOutlines(true); // Enable first
            toggleLandmarkOutlines(false); // Then disable
        });

        const headerLabel = await page.$('header .equa11y-landmarks');
        expect(headerLabel).toBeNull();
        const navLabel = await page.$('nav .equa11y-landmarks');
        expect(navLabel).toBeNull();
        const mainLabel = await page.$('main .equa11y-landmarks');
        expect(mainLabel).toBeNull();
        const footerLabel = await page.$('footer .equa11y-landmarks');
        expect(footerLabel).toBeNull();
        const customRegionLabel = await page.$('[role="region"] .equa11y-landmarks');
        expect(customRegionLabel).toBeNull();
    });
});