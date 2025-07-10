export function toggleScreenReaderTextDisplay(isChecked) {
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const ariaLabels = ['aria-label', 'aria-labelledby', 'aria-describedby'];
    const elementsInteractiveRoles = document.querySelectorAll(interactiveRoles.join(','));
    const elList = ['equa11y-border'];
    const clsList = ['equa11y-label', 'equa11y-sr-text'];

    // List of common interactive roles and their corresponding elements
    isChecked ? srText_checked() : srText_unchecked();

    function srText_checked() {
        elementsInteractiveRoles.forEach(element => {
            if(!element.querySelector('.equa11y-sr-text')) {
                let ariaAttr = ariaLabels.map(aria => { 
                    if(element.hasAttribute(aria) && aria !== 'aria-label') {
                        return getAriaText(element.getAttribute(aria));
                    }
    
                    if(aria === 'aria-label') {
                        return element.getAttribute(aria);
                    }
                });
    
                let labelText = ariaAttr.toString().replace(/^\,+|\,+$/g, '');
                const srLabel = document.createElement('div');
                srLabel.innerText = `${(labelText.length > 0) ? labelText : element.textContent}`;
                srLabel.classList.add(...clsList);
                element.classList.add(...elList);
                element.prepend(srLabel);
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
        console.log('ariaTextArr: ',ariaTextArr);
        return ariaTextArr.join(', ');
    }
}
