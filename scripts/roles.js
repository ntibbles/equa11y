export function toggleInteractiveRoles(isChecked) {
    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', '[type="checkbox"]', '[type="radio"]', '[type="slider"]', 'textbox', 'option', '[role="button"]', '[role="link"]'];
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
                    roleLabel.textContent = (role === 'a') ? 'link [a]' : role;
                    roleLabel.classList.add(...clsList);
                  
                    el.classList.add(...elList);
                    el.prepend(roleLabel);
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
