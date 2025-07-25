const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Lang Feature', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    async function injectLangScript() {
        let langScriptContent = await fs.readFile(
            './scripts/lang.js',
            'utf8'
        );
        langScriptContent = langScriptContent.replace('export ', '');
        await page.evaluate(langScriptContent);
    }

    it('should display lang attributes when the feature is enabled', async () => {
        await page.goto('http://localhost:8080/tests/index.html');
        await injectLangScript();
        await page.evaluate(() => {
            revealLang(true);
        });

        // Check for HTML lang attribute label
        const htmlLangLabel = await page.$('#equa11y-lang');
        expect(htmlLangLabel).not.toBeNull();
        const htmlLangLabelText = await page.evaluate(el => el.textContent, htmlLangLabel);
        expect(htmlLangLabelText).toBe('lang="en"');

        // Check for paragraph lang attribute label
        const pLangLabel = await page.$('p .equa11y-lang');
        expect(pLangLabel).not.toBeNull();
        const pLangLabelText = await page.evaluate(el => el.textContent, pLangLabel);
        expect(pLangLabelText).toBe('lang="fr"');

        // Check for span lang attribute label
        const spanLangLabel = await page.$('span .equa11y-lang');
        expect(spanLangLabel).not.toBeNull();
        const spanLangLabelText = await page.evaluate(el => el.textContent, spanLangLabel);
        expect(spanLangLabelText).toBe('lang="es"');
    });

    it('should remove lang attributes when the feature is disabled', async () => {
        await page.goto('http://localhost:8080/tests/index.html');
        await injectLangScript();
        await page.evaluate(() => {
            revealLang(true); // Enable first
            revealLang(false); // Then disable
        });

        const htmlLangLabel = await page.$('#equa11y-lang');
        expect(htmlLangLabel).toBeNull();
        const pLangLabel = await page.$('p .equa11y-lang');
        expect(pLangLabel).toBeNull();
        const spanLangLabel = await page.$('span .equa11y-lang');
        expect(spanLangLabel).toBeNull();
    });

    it('should display a message if HTML tag is missing lang attribute', async () => {
        await page.goto('http://localhost:8080/tests/index-no-lang.html');
        await injectLangScript();
        await page.evaluate(() => {
            revealLang(true);
        });

        const htmlLangLabel = await page.$('#equa11y-lang');
        expect(htmlLangLabel).not.toBeNull();
        const htmlLangLabelText = await page.evaluate(el => el.textContent, htmlLangLabel);
        expect(htmlLangLabelText).toBe('No lang attribute on HTML tag.');
    });
});