const puppeteer = require('puppeteer');
const fs = require('fs').promises;

describe('Roles Feature', () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: "new",
        });

        page = await browser.newPage();
        await page.goto('http://localhost:8080/tests/index.html');

        // Read the script content and remove the 'export' keyword
        let rolesScriptContent = await fs.readFile(
            './scripts/roles.js',
            'utf8'
        );
        rolesScriptContent = rolesScriptContent.replace('export ', '');

        // Inject the modified script content into the page
        await page.evaluate(rolesScriptContent);
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should display roles for interactive elements when enabled', async () => {
        await page.evaluate(() => {
            toggleInteractiveRoles(true);
        });

        const buttonLabel = await page.$('button .equa11y-roles');
        expect(buttonLabel).not.toBeNull();
        const buttonLabelText = await page.evaluate(el => el.textContent, buttonLabel);
        expect(buttonLabelText).toBe('button');

        const linkLabel = await page.$('a .equa11y-roles');
        expect(linkLabel).not.toBeNull();
        const linkLabelText = await page.evaluate(el => el.textContent, linkLabel);
        expect(linkLabelText).toBe('link [a]');

        const checkboxLabel = await page.$('input[type="checkbox"] .equa11y-roles');
        expect(checkboxLabel).not.toBeNull();
        const checkboxLabelText = await page.evaluate(el => el.textContent, checkboxLabel);
        expect(checkboxLabelText).toBe('checkbox');

        const radioLabel = await page.$('input[type="radio"] .equa11y-roles');
        expect(radioLabel).not.toBeNull();
        const radioLabelText = await page.evaluate(el => el.textContent, radioLabel);
        expect(radioLabelText).toBe('radio');

        const textInputLabel = await page.$('input[type="text"] .equa11y-roles');
        expect(textInputLabel).not.toBeNull();
        const textInputLabelText = await page.evaluate(el => el.textContent, textInputLabel);
        expect(textInputLabelText).toBe('textbox');

        const selectLabel = await page.$('select .equa11y-roles');
        expect(selectLabel).not.toBeNull();
        const selectLabelText = await page.evaluate(el => el.textContent, selectLabel);
        expect(selectLabelText).toBe('option');

        const submitInputLabel = await page.$('input[type="submit"] + .equa11y-roles');
        expect(submitInputLabel).not.toBeNull();
        const submitInputLabelText = await page.evaluate(el => el.textContent, submitInputLabel);
        expect(submitInputLabelText).toBe('submit');

        const ariaButtonLabel = await page.$('div[role="button"] .equa11y-roles');
        expect(ariaButtonLabel).not.toBeNull();
        const ariaButtonLabelText = await page.evaluate(el => el.textContent, ariaButtonLabel);
        expect(ariaButtonLabelText).toBe('button');

        const ariaLinkLabel = await page.$('div[role="link"] .equa11y-roles');
        expect(ariaLinkLabel).not.toBeNull();
        const ariaLinkLabelText = await page.evaluate(el => el.textContent, ariaLinkLabel);
        expect(ariaLinkLabelText).toBe('link');
    });

    it('should remove roles display when disabled', async () => {
        await page.evaluate(() => {
            toggleInteractiveRoles(true); // Enable first
            toggleInteractiveRoles(false); // Then disable
        });

        const buttonLabel = await page.$('button .equa11y-roles');
        expect(buttonLabel).toBeNull();
        const linkLabel = await page.$('a .equa11y-roles');
        expect(linkLabel).toBeNull();
        const checkboxLabel = await page.$('input[type="checkbox"] .equa11y-roles');
        expect(checkboxLabel).toBeNull();
        const radioLabel = await page.$('input[type="radio"] .equa11y-roles');
        expect(radioLabel).toBeNull();
        const textInputLabel = await page.$('input[type="text"] .equa11y-roles');
        expect(textInputLabel).toBeNull();
        const selectLabel = await page.$('select .equa11y-roles');
        expect(selectLabel).toBeNull();
        const submitInputLabel = await page.$('input[type="submit"] + .equa11y-roles');
        expect(submitInputLabel).toBeNull();
        const ariaButtonLabel = await page.$('div[role="button"] .equa11y-roles');
        expect(ariaButtonLabel).toBeNull();
        const ariaLinkLabel = await page.$('div[role="link"] .equa11y-roles');
        expect(ariaLinkLabel).toBeNull();
    });
});
