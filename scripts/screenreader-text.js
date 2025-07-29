export function toggleScreenReaderTextDisplay(isChecked) {
    const interactiveRoles = ['button', 'a', 'input[type="checkbox"]', 'input[type="radio"]', 'slider', 'input[type="text"]', 'select', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const ariaLabels = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    const elementsInteractiveRoles = document.querySelectorAll(interactiveRoles.join(','));
    const elList = ['equa11y-border'];
    const clsList = ['equa11y-label', 'equa11y-sr-text'];

    isChecked ? srText_checked() : srText_unchecked();

    function srText_checked() {
        elementsInteractiveRoles.forEach(element => {
            // Only skip if the element itself has aria-hidden="true"
            if (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true') return;

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
                    labelText = getVisibleText(element);
                }

                if (element.hasAttribute('aria-describedby')) {
                    describedByText = getAriaText(element.getAttribute('aria-describedby'));
                }

                const fullText = [labelText, describedByText].filter(Boolean).join(', ');

                const srLabel = document.createElement('div');
                srLabel.innerText = fullText;
                srLabel.classList.add(...clsList);
                element.classList.add(...elList);
                element.insertAdjacentElement('afterend', srLabel);
            }
        });
    }

    function srText_unchecked() {
        document.querySelectorAll('.equa11y-sr-text').forEach(el => {
            el.remove();
        });
         document.querySelectorAll('.equa11y-border').forEach(el => {
            el.classList.remove(...elList);
        });
    }

    function getAriaText(id) {
        let idArr = id.split(' ');
        const ariaTextArr = idArr.map((elementId) => document.getElementById(elementId)?.innerText || '');
        return ariaTextArr.join(', ');
    }

    function getVisibleText(element) {
        let text = '';
        for (const child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
            } else if (
                child.nodeType === Node.ELEMENT_NODE &&
                !(child.hasAttribute('aria-hidden') && child.getAttribute('aria-hidden') === 'true')
            ) {
                text += getVisibleText(child);
            }
        }
        return text;
    }
}