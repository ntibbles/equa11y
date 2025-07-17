export function toggleInteractiveRoles(isChecked) {
    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', '[type="checkbox"]', '[type="radio"]', '[type="slider"]', 'input[type="text"]', 'input[type="submit"]', 'textbox', 'option', '[role="button"]', '[role="link"]'];
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
                    if (role === 'input[type="text"]') {
                        roleText = 'textbox';
                    } else if (role === 'input[type="submit"]') {
                        roleText = 'submit';
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
                    if (role === 'input[type="submit"]') {
                        el.insertAdjacentElement('afterend', roleLabel);
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
