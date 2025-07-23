/**
 * @jest-environment puppeteer
 */

describe('Tabbing Order', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8080/tests/tabbing-order.html');
    });

    test('should add tabbing order indicators', async () => {
        await page.evaluate(() => {
            window.toggleTabbingOrder(true);
        });

        const labels = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.equa11y-label')).map(el => el.textContent);
        });

        expect(labels).toEqual([
            '1 : <a>',
            '2 : <button>',
            '3 : <input>',
            '4 : <button>',
            '3 : <input>',
            '2 : <input>',
            '1 : <input>',
        ]);
    });

    test('should remove tabbing order indicators', async () => {
        await page.evaluate(() => {
            window.toggleTabbingOrder(false);
        });

        const labels = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.equa11y-label')).map(el => el.textContent);
        });

        expect(labels).toHaveLength(0);
    });
});