export function toggleInteractiveRoles(isChecked) {
    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    // Remove borders and labels
    const outlinedElements = document.querySelectorAll('.outlined-role');
    const clsList = ['equa11y-label', 'equa11y-roles'];

    outlinedElements.forEach(el => {
        el.style.border = ''; // Remove border
        el.style.position = ''; // Remove relative positioning
        el.classList.remove('outlined-role'); // Remove the class
    });

    document.querySelectorAll('.equa11y-roles').forEach(el => {
        el.remove();
    });

    if (isChecked) {
        // Add border and label for each interactive element
        interactiveRoles.forEach(role => {
            const elements = document.querySelectorAll(role);

            elements.forEach(el => {
                // Create a label for the role
                const roleLabel = document.createElement('span');
                roleLabel.textContent = (role === 'a') ? 'link (a)' : role;
                roleLabel.classList.add(...clsList);
                
                // Add the border and append the label
                el.style.border = '2px solid blue';
                el.classList.add('outlined-role'); // Add a class for later removal
                el.prepend(roleLabel);
            });
        });
    }
}
