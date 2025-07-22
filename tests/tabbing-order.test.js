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
            'a : 1',
            'button : 2',
            'input : 3',
            'button : 4',
            'input : 3',
            'input : 2',
            'input : 1'
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