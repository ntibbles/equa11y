export function toggleInteractiveRoles(isChecked) {
    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];

    if (isChecked) {
        // Add border and label for each interactive element
        interactiveRoles.forEach(role => {
            const elements = document.querySelectorAll(role);

            elements.forEach(el => {
                // Create a label for the role
                const roleLabel = document.createElement('span');
                roleLabel.textContent = role;
                roleLabel.className = 'role-label';
                roleLabel.style.position = 'absolute';
                roleLabel.style.top = '0';
                roleLabel.style.left = '0';
                roleLabel.style.backgroundColor = 'blue';
                roleLabel.style.color = 'white';
                roleLabel.style.fontSize = '1em';
                roleLabel.style.padding = '2px';
                roleLabel.style.zIndex = '1000';

                // Position the label relative to the element
                el.style.position = 'relative';

                // Add the border and append the label
                el.style.border = '2px solid blue';
                el.classList.add('outlined-role'); // Add a class for later removal
                el.appendChild(roleLabel);
            });
        });
    } else {
        // Remove borders and labels
        const outlinedElements = document.querySelectorAll('.outlined-role');

        outlinedElements.forEach(el => {
            el.style.border = ''; // Remove border
            el.style.position = ''; // Remove relative positioning
            el.classList.remove('outlined-role'); // Remove the class
        });

        document.querySelectorAll('.role-label').forEach(el => {
            el.remove();
        });
    }
}
