const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Page Title Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
    });

    afterEach(async () => {
        await browser.close();
    });

    async function injectPageTitleScript() {
        let pageTitleScriptContent = await fs.readFile(
            './scripts/page-title.js',
            'utf8'
        );
        pageTitleScriptContent = pageTitleScriptContent.replace('export ', '');
        await page.evaluate(pageTitleScriptContent);
    }

    it('should display the page title when the feature is enabled', async () => {
        await page.goto('http://localhost:8080/tests/index.html');
        await injectPageTitleScript();
        await page.evaluate(() => {
            togglePageTitle(true);
        });

        const titleElement = await page.$('#equa11y-page-label');
        expect(titleElement).not.toBeNull();
        const titleText = await page.evaluate(el => el.textContent, titleElement);
        expect(titleText).toBe('My Awesome Page');
    });

    it('should display "No title tag" if title is missing', async () => {
        await page.goto('http://localhost:8080/tests/index-no-title.html');
        await injectPageTitleScript();
        await page.evaluate(() => {
            togglePageTitle(true);
        });

        const titleElement = await page.$('#equa11y-page-label');
        expect(titleElement).not.toBeNull();
        const titleText = await page.evaluate(el => el.textContent, titleElement);
        expect(titleText).toBe('No title tag');
    });

    it('should remove the page title display when the feature is disabled', async () => {
        await page.goto('http://localhost:8080/tests/index.html');
        await injectPageTitleScript();
        await page.evaluate(() => {
            togglePageTitle(true); // Enable first
            togglePageTitle(false); // Then disable
        });

        const titleElement = await page.$('#equa11y-page-label');
        expect(titleElement).toBeNull();
    });
});
