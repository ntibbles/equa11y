export function toggleScreenReaderTextDisplay(isChecked) {

    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const roleSet = new Set(interactiveRoles.join().split(','));

    roleSet.forEach(role => {
        // Get all elements with the specified interactive role
        const elementsInteractiveRoles = document.querySelectorAll(role);

        elementsInteractiveRoles.forEach(element => {
            if (isChecked) {

                // If the element does not contain any aria labels, use visual label
                if (!element.ariaLabel && !element.getAttribute('aria-labelledby') && !element.getAttribute('aria-describedby')) {
                    // If isChecked is true, add border and label
                    element.style.border = '2px solid blue';
                    element.style.position = 'relative';  // Ensure relative positioning for label placement
                    
                    // Create a screen reader label for the element level
                    const srLabel = document.createElement('div');
                    srLabel.className = 'equa11y-label';  // Assign a class for easy identification
                    srLabel.innerText = `SR Text: ${element.innerText}`; 
                    element.prepend(srLabel);
                }
            } else {
                // If isChecked is false, remove border and label
                element.style.border = '';  // Reset the border
                const srLabel = element.querySelector('.equa11y-label');
                if (srLabel) {
                    element.removeChild(srLabel);  // Remove the label
                }
            }
        })

    })

    // Get elements with aria labels
    const ariaLabels = [ '[aria-label]', '[aria-labelledby]', '[aria-describedby]' ];
    const elementsAriaLabels = document.querySelectorAll(ariaLabels.join(','));

    // Loop through aria labels
    elementsAriaLabels.forEach(element => {
        if (isChecked) {
            // If isChecked is true, add border and label
            element.style.border = '2px solid blue';
            element.style.position = 'relative';  // Ensure relative positioning for label placement

            // Retrieve aria labels
            const ariaLabel = element.ariaLabel ? element.ariaLabel : '';
            const ariaLabelledby = element.getAttribute('aria-labelledby') ? getAriaText(element.getAttribute('aria-labelledby')) : '';
            const ariaDescribedby = element.getAttribute('aria-describedby') ? getAriaText(element.getAttribute('aria-describedby')) : '';

            // Create a screen reader label for the element level
            const srLabel = document.createElement('div');
            srLabel.innerText = `SR Text: ${ariaLabel} ${ariaLabelledby} ${ariaDescribedby}`;
            srLabel.className = 'equa11y-label'; // Assign a class for easy identification
            element.prepend(srLabel);
        } else {
            // If isChecked is false, remove border and label
            element.style.border = '';  // Reset the border
            const srLabel = element.querySelector('.equa11y-label');
            if (srLabel) {
                element.removeChild(srLabel);  // Remove the label
            }
        }
    });

    // id can be multiple references (split by space)
    function getAriaText(id) {
        let idArr = id.split(' ');

        // Retrieve the elements referenced
        const ariaTextArr = idArr.map((elementId) => document.getElementById(elementId).innerText);
        return ariaTextArr.join(', ');
    }
}
