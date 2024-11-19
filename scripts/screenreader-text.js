export function toggleScreenReaderTextDisplay(isChecked) {
    // const elementsWithInnerText = document.querySelectorAll(':not(script):not(style)');
    // Get elements with innerText property
    // const allElements = document.querySelectorAll('*');
    // const elementsTextArray = Array.from(allElements).filter(
    //     element => element.innerText && element.innerText.trim() !== ""
    //   );
    // const elementsArray = Array.from(elementsWithInnerText);
    // const elementsTextArray = elementsArray.filter(element => element.innerText.trim().length > 0);

    // Get elements with aria labels
    const elementsWithAria = [ '[aria-label]', '[aria-labelledby]', '[aria-describedby]' ];
    const elementsAriaArray = document.querySelectorAll(elementsWithAria.join(','));

    // List of common interactive roles and their corresponding elements
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const roleSet = new Set(interactiveRoles.join().split(','));
    console.log('roles: ', roleSet.has('button')); // chedck if this el exists in the set

    // Combine arrays and remove duplicates
    // const elementsNoDuplicates = new Set([ ...elementsTextArray, ...elementsAriaArray] );
    // const elements = [...elementsNoDuplicates];

    elementsAriaArray.forEach(element => {
        element.style.border = isChecked ? '2px solid blue' : '';
        element.style.position= 'relative';

        if (isChecked) {
            let text = "";
            if (!element.ariaLabel && !element.getAttribute('aria-labelledby') && !element.getAttribute('aria-describedby')) {
                text = element.innerText;
            }
            else {
                const ariaLabel = element.ariaLabel ? element.ariaLabel : '';
                const ariaLabelledby = element.getAttribute('aria-labelledby') ? element.getAttribute('aria-labelledby') : '';
                const ariaDescribedby = element.getAttribute('aria-describedby') ? element.getAttribute('aria-describedby') : '';
                text = `${ariaLabel} ${ariaLabelledby} ${ariaDescribedby}`;
            }
            const srTextElement = document.createElement('div');
            srTextElement.innerText = `SR Text: ${text}`;
            srTextElement.className = 'at3-label';

            element.prepend(srTextElement);
        } else {
            const srTextElements = document.querySelectorAll('.at3-label');
            srTextElements.forEach(div => {
                div.remove();
            });
        }
    });

    // id can be multiple references (split by space)
    function getAriaText(id) {
        let idArr = id.split(" ");
        let value = document.getElementById(id).textContent;
        // if it's an array we need to loop and return the values
        if (idArr.length) {
            idArr.map();
        }
        return value;
    }
    
    // const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    // elements.forEach(element => {
    //     element.style.border = isChecked ? '2px solid red' : '';
    //     if (isChecked) {
    //         const ariaLabel = element.ariaLabel ? element.ariaLabel : '';
    //         const ariaLabelledby = element.getAttribute('aria-labelledby') ? element.getAttribute('aria-labelledby') : '';
    //         const ariaDescribedby = element.getAttribute('aria-describedby') ? element.getAttribute('aria-describedby') : '';

    //         const srTextElement = document.createElement('div');
    //         srTextElement.innerText = `aria-label="${ariaLabel}" \n aria-labelledby="${ariaLabelledby}" \n aria-describedby="${ariaDescribedby}"`;
    //         srTextElement.className = 'sr-name'; // what should class name be?
    //         srTextElement.style.backgroundColor = 'blue';
    //         srTextElement.style.color = 'white';
    //         srTextElement.style.padding = '3px';
    //         element.parentNode.insertBefore(srTextElement, element);
    //     } else {
    //         const srTextElements = document.querySelectorAll('.sr-name');
    //         srTextElements.forEach(div => {
    //             div.remove();
    //         });
    //     }
    // });


}
