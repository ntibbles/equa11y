const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Grayscale Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let grayscaleScriptContent = await fs.readFile(
            './scripts/grayscale.js',
            'utf8'
        );
        grayscaleScriptContent = grayscaleScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(grayscaleScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should apply grayscale filter to the page when enabled', async () => {
        await page.evaluate(() => {
            grayscale(true);
        });

        const filterStyle = await page.evaluate(() => {
            const styleElement = document.getElementById('equa11y_gray');
            return styleElement ? styleElement.textContent : '';
        });
        expect(filterStyle).toContain('filter: grayscale(1) !important;');

        const label = await page.$('.equa11y-label');
        expect(label).not.toBeNull();
        const labelText = await page.evaluate(el => el.textContent, label);
        expect(labelText).toBe('Grayscale Page');
    });

    it('should remove grayscale filter from the page when disabled', async () => {
        await page.evaluate(() => {
            grayscale(true); // Enable first
            grayscale(false); // Then disable
        });

        const filterStyle = await page.evaluate(() => {
            const styleElement = document.getElementById('equa11y_gray');
            return styleElement ? styleElement.textContent : '';
        });
        expect(filterStyle).not.toContain('filter: grayscale(1) !important;');

        const label = await page.$('.equa11y-label');
        expect(label).toBeNull();
    });
});
