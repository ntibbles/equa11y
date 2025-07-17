const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Text Zoom Feature', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Mock Chrome APIs
        await page.evaluate(() => {
            window.chrome = {
                runtime: {
                    connect: () => ({
                        postMessage: () => {},
                        onMessage: {
                            addListener: () => {},
                        },
                    }),
                },
                storage: {
                    sync: {
                        get: () => Promise.resolve({ zoomSlider: { slider: 2 } }),
                    },
                },
            };
        });

        let scriptContent = await fs.readFile('./scripts/text-zoom.js', 'utf8');
        scriptContent = scriptContent.replace('export ', '');
        await page.evaluate(scriptContent);
    });

    afterAll(async () => {
        await browser.close();
    });

    async function getFontSize(selector) {
        return await page.$eval(selector, el => getComputedStyle(el).fontSize);
    }

    it('should zoom in text and show label when enabled', async () => {
        const initialFontSize = await getFontSize('h1');
        await page.evaluate(() => toggleZoom(true));

        const newFontSize = await getFontSize('h1');
        expect(parseFloat(newFontSize)).toBeGreaterThan(parseFloat(initialFontSize));

        const label = await page.$('#equa11y_zoom');
        expect(label).not.toBeNull();
        const labelText = await page.evaluate(el => el.textContent, label);
        expect(labelText).toBe('Text resized: 200%');
    });

    it('should zoom out text and hide label when disabled', async () => {
        await page.evaluate(() => toggleZoom(true)); // ensure it's on
        const initialFontSize = await getFontSize('h1');

        await page.evaluate(() => toggleZoom(false));

        const newFontSize = await getFontSize('h1');
        expect(parseFloat(newFontSize)).toBeLessThan(parseFloat(initialFontSize));

        const label = await page.$('#equa11y_zoom');
        expect(label).toBeNull();
    });
});
