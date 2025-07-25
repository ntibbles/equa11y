/**
 * @jest-environment puppeteer
 */

describe('Text Spacing', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/tests/text-spacing.html');
    });

    test('should apply text spacing styles', async () => {
        await page.evaluate(() => {
            window.toggleTextSpacing(true);
        });

        const style = await page.evaluate(() => {
            const p = document.querySelector('p');
            const computedStyle = getComputedStyle(p);
            return {
                lineHeight: computedStyle.lineHeight,
                wordSpacing: computedStyle.wordSpacing,
                letterSpacing: computedStyle.letterSpacing,
            };
        });

        expect(style.lineHeight).toBe('24px');
        expect(style.wordSpacing).toBe('2.56px');
        expect(style.letterSpacing).toBe('1.92px');
    });

    test('should remove text spacing styles', async () => {
        await page.evaluate(() => {
            window.toggleTextSpacing(false);
        });

        const style = await page.evaluate(() => {
            const p = document.querySelector('p');
            const computedStyle = getComputedStyle(p);
            return {
                lineHeight: computedStyle.lineHeight,
                wordSpacing: computedStyle.wordSpacing,
                letterSpacing: computedStyle.letterSpacing,
            };
        });

        expect(style.lineHeight).not.toBe('24px');
        expect(style.wordSpacing).toBe('0px');
        expect(style.letterSpacing).toBe('normal');
    });
});