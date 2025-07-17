const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Exclusive Text Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let exclusiveTextScriptContent = await fs.readFile(
            './scripts/exclusive-text.js',
            'utf8'
        );
        exclusiveTextScriptContent = exclusiveTextScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(exclusiveTextScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should highlight exclusive text when the feature is enabled', async () => {
        await page.evaluate(() => {
            exclusiveText(true);
        });

        const highlightedSee = await page.$('p .equa11y-highlight');
        expect(highlightedSee).not.toBeNull();
        const highlightedSeeText = await page.evaluate(el => el.textContent, highlightedSee);
        expect(highlightedSeeText).toBe('see');

        const highlightedView = await page.$('div .equa11y-highlight');
        expect(highlightedView).not.toBeNull();
        const highlightedViewText = await page.evaluate(el => el.textContent, highlightedView);
        expect(highlightedViewText).toBe('View');

        const highlightedLook = await page.$('span .equa11y-highlight');
        expect(highlightedLook).not.toBeNull();
        const highlightedLookText = await page.evaluate(el => el.textContent, highlightedLook);
        expect(highlightedLookText).toBe('Look');
    });

    it('should remove exclusive text highlighting when the feature is disabled', async () => {
        await page.evaluate(() => {
            exclusiveText(true); // Enable first
            exclusiveText(false); // Then disable
        });

        const highlightedSee = await page.$('p .equa11y-highlight');
        expect(highlightedSee).toBeNull();
        const highlightedView = await page.$('div .equa11y-highlight');
        expect(highlightedView).toBeNull();
        const highlightedLook = await page.$('span .equa11y-highlight');
        expect(highlightedLook).toBeNull();
    });
});
