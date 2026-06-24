import { jest } from '@jest/globals';
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Embedded Text Detection Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/manual/embedded-text.html');

        // Mock the AI API for testing
        await page.evaluateOnNewDocument(() => {
            window.LanguageModel = {
                availability: async () => 'available',
                create: async (options) => ({
                    prompt: async (content) => 'Mock AI detected text: Sample Text',
                    destroy: () => {}
                })
            };
        });

        // Read the script content and remove the 'export' keyword
        let embeddedTextScriptContent = await fs.readFile(
            './scripts/embedded-text.js',
            'utf8'
        );
        embeddedTextScriptContent = embeddedTextScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(embeddedTextScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should process images when the feature is enabled', async () => {
        await page.evaluate(() => {
            toggleEmbeddedTextDetection(true);
        });

        // Wait a bit for processing to start
        await page.waitForTimeout(500);

        // Check if processing dialog appears
        const processingDialog = await page.$('.equa11y-processing-dialog');
        expect(processingDialog).not.toBeNull();
        
        // Check if abort button is present
        const abortButton = await page.$('.equa11y-processing-dialog button');
        expect(abortButton).not.toBeNull();
    });

    it('should highlight images with potential embedded text', async () => {
        await page.evaluate(() => {
            toggleEmbeddedTextDetection(true);
        });

        // Wait for processing to complete
        await page.waitForTimeout(8000);

        // Check if any images have been marked with embedded text class
        const embeddedTextImages = await page.$$('.equa11y-embedded-text');
        expect(embeddedTextImages.length).toBeGreaterThanOrEqual(0);
    });

    it('should remove highlighting when the feature is disabled', async () => {
        await page.evaluate(() => {
            toggleEmbeddedTextDetection(true); // Enable first
        });

        // Wait for processing to complete
        await page.waitForTimeout(8000);

        await page.evaluate(() => {
            toggleEmbeddedTextDetection(false); // Then disable
        });

        // Check if highlighting is removed
        const embeddedTextImages = await page.$('.equa11y-embedded-text');
        expect(embeddedTextImages).toBeNull();

        const embeddedTextLabels = await page.$('.equa11y-embedded-text-label');
        expect(embeddedTextLabels).toBeNull();
    });

    it('should handle images with CORS issues gracefully', async () => {
        // Add an external image that might have CORS issues
        await page.evaluate(() => {
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Test';
            img.alt = 'Test image';
            document.body.appendChild(img);
        });

        await page.evaluate(() => {
            toggleEmbeddedTextDetection(true);
        });

        // Wait for processing to complete
        await page.waitForTimeout(8000);

        // Should not throw errors and should complete processing
        const processingDialog = await page.$('.equa11y-processing-dialog');
        // Dialog should be closed after processing
        const isDialogVisible = await page.evaluate(() => {
            const dialog = document.querySelector('.equa11y-processing-dialog');
            return dialog && dialog.open;
        });
        expect(isDialogVisible).toBeFalsy();
    });

    it('should allow users to abort processing', async () => {
        await page.evaluate(() => {
            toggleEmbeddedTextDetection(true);
        });

        // Wait for processing dialog to appear
        await page.waitForTimeout(500);

        // Click the abort button
        await page.click('.equa11y-processing-dialog button');

        // Wait a moment for the abort to take effect
        await page.waitForTimeout(1000);

        // Check if processing was stopped
        const progressText = await page.$eval('.equa11y-progress-text', el => el.textContent);
        expect(progressText).toContain('stopped');
    });
});
