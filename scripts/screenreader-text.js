export function toggleScreenReaderTextDisplay(isChecked) {
    const interactiveRoles = ['button', 'a', 'input[type="checkbox"]', 'input[type="radio"]', 'slider', 'input[type="text"]', 'select', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const ariaLabels = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    const elementsInteractiveRoles = document.querySelectorAll(interactiveRoles.join(','));
    const elList = ['equa11y-border'];
    const clsList = ['equa11y-label', 'equa11y-sr-text'];

    // List of common interactive roles and their corresponding elements
    isChecked ? srText_checked() : srText_unchecked();

    function srText_checked() {
        elementsInteractiveRoles.forEach(element => {
            if(!element.querySelector('.equa11y-sr-text')) {
                let labelText = '';
                let describedByText = '';

                if (element.hasAttribute('aria-labelledby')) {
                    labelText = getAriaText(element.getAttribute('aria-labelledby'));
                } else if (element.hasAttribute('aria-label')) {
                    labelText = element.getAttribute('aria-label');
                } else if (element.tagName.toLowerCase() === 'input' && document.querySelector(`label[for="${element.id}"]`)) {
                    labelText = document.querySelector(`label[for="${element.id}"]`).textContent;
                } else if (element.hasAttribute('placeholder')) {
                    labelText = element.getAttribute('placeholder');
                } else {
                    labelText = element.textContent;
                }

                if (element.hasAttribute('aria-describedby')) {
                    describedByText = getAriaText(element.getAttribute('aria-describedby'));
                }

                const fullText = [labelText, describedByText].filter(Boolean).join(', ');

                const srLabel = document.createElement('div');
                srLabel.innerText = fullText;
                srLabel.classList.add(...clsList);
                element.classList.add(...elList);
                element.appendChild(srLabel);
            }
        });
    }

    function srText_unchecked() {
        document.querySelectorAll('.equa11y-sr-text').forEach(el => {
            el.parentElement.classList.remove(...elList);
            el.remove();
        });
    }

    function getAriaText(id) {
        let idArr = id.split(' ');
        const ariaTextArr = idArr.map((elementId) => document.getElementById(elementId)?.innerText || '');
        return ariaTextArr.join(', ');
    }
}
