export function toggleInteractiveRoles(isChecked) {
    // List of common interactive roles and their corresponding elements
    const interactiveRoles = [
        // Explicit roles must be checked first to handle overrides
        '[role="button"]',
        '[role="link"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[role="slider"]',
        '[role="textbox"]',
        '[role="option"]',
        '[role="menuitem"]',
        '[role="tab"]',
        '[role="switch"]',
        '[role="searchbox"]',
        '[role="combobox"]',
        '[role="treeitem"]',

        // Native HTML elements with implicit interactive roles
        'button',
        'a',
        'input[type="checkbox"]',
        'input[type="radio"]',
        'input[type="range"]', // Corrected from '[type="slider"]'
        'input[type="text"]',
        'input[type="submit"]',
        'textarea',
        'select',
        'option'
    ];
    const outlinedElements = document.querySelectorAll('.outlined-role');
    const elList = ['equa11y-border', 'outlined-role'];
    const clsList = ['equa11y-label', 'equa11y-roles'];

    isChecked ? interactiveRoles_checked() : interactiveRoles_unchecked();

    function interactiveRoles_checked() {
        interactiveRoles.forEach(role => {
            const elements = document.querySelectorAll(role);

            elements.forEach(el => {
                if(!el.classList.contains('outlined-role')) {
                    const roleLabel = document.createElement('span');
                    let roleText = role;
                    if (role === 'input[type="text"]' || role === 'textarea') {
                        roleText = 'textbox';
                    } else if (role === 'input[type="submit"]') {
                        roleText = 'submit';
                    } else if (role === 'input[type="range"]') {
                        roleText = 'slider';
                    } else if (role === 'select') {
                        roleText = 'listbox';
                    } else if (role.startsWith('[type="')) {
                        roleText = role.substring(7, role.indexOf('"]'));
                    } else if (role.startsWith('[role="')) {
                        roleText = role.substring(7, role.indexOf('"]'));
                    } else if (role === 'a') {
                        roleText = 'link [a]';
                    }
                    roleLabel.textContent = roleText;
                    roleLabel.classList.add(...clsList);
                  
                    el.classList.add(...elList);
                    if (role === 'input[type="text"]' || role === 'input[type="submit"]' || role.startsWith('[type="')) {
                        el.parentNode.insertAdjacentElement('afterbegin', roleLabel);
                    } else {
                        el.insertAdjacentElement('afterbegin', roleLabel);
                    }
                }
            });
        });
    }

    function interactiveRoles_unchecked() {
        outlinedElements.forEach(el => {
            el.classList.remove(...elList);
        });
    
        document.querySelectorAll('.equa11y-roles').forEach(el => {
            el.remove();
        });
    }
}