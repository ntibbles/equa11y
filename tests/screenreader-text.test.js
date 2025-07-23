const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Screen Reader Text Feature', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/sr-text.html');

        let scriptContent = await fs.readFile('./scripts/screenreader-text.js', 'utf8');
        scriptContent = scriptContent.replace('export ', '');
        await page.evaluate(scriptContent);
    });

    afterAll(async () => {
        await browser.close();
    });

    async function getSrText(selector) {
        const element = await page.$(selector);
        const srElement = await element.$('.equa11y-sr-text');
        if (!srElement) return null;
        return await page.evaluate(el => el.textContent, srElement);
    }

    it('should display text content when no ARIA attributes are present', async () => {
        await page.evaluate(() => toggleScreenReaderTextDisplay(true));
        expect(await getSrText('#btn-1')).toBe('Button with text');
    });

    it('should display aria-label when present', async () => {
        expect(await getSrText('#btn-2')).toBe('aria label');
    });

    it('should display aria-labelledby when present', async () => {
        expect(await getSrText('#btn-3')).toBe('aria labelledby');
    });

    it('should display aria-describedby when present', async () => {
        expect(await getSrText('#btn-4')).toBe('aria describedby');
    });

    it('should display aria-label and aria-describedby when both are present', async () => {
        expect(await getSrText('#btn-5')).toBe('aria label, aria describedby');
    });

    it('should display aria-labelledby and aria-describedby when both are present', async () => {
        expect(await getSrText('#btn-6')).toBe('aria labelledby, aria describedby');
    });

    it('should display placeholder text for text inputs', async () => {
        expect(await getSrText('#input-1')).toBe('placeholder text');
    });

    it('should prioritize aria-label over placeholder for text inputs', async () => {
        expect(await getSrText('#input-2')).toBe('input aria label');
    });

    it('should prioritize aria-labelledby over placeholder for text inputs', async () => {
        expect(await getSrText('#input-3')).toBe('input aria labelledby');
    });

    it('should use label text for text inputs', async () => {
        expect(await getSrText('#input-4')).toBe('input label');
    });
});
