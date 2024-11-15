export function toggleScreenReaderTextDisplay(isChecked) {
    const elementsWithInnerText = document.querySelectorAll(':not(script):not(style)');
    const elementsArray = Array.from(elementsWithInnerText);
    const elementsTextArray = elementsArray.filter(element => element.innerText.trim().length > 0);

    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    const elementsAriaArray = Array.from(elementsWithAria);

    const elementsNoDuplicates = new Set([ ...elementsTextArray, ...elementsAriaArray] );
    const elements = [...elementsNoDuplicates];

    elements.forEach(element => {
        element.style.border = isChecked ? '2px solid red' : '';
        if (isChecked) {
            let text = "";
            if (!element.ariaLabel && !element.getAttribute('aria-labelledby') && !element.getAttribute('aria-describedby')) {
                text = `visual label="${element.innerText}"`;
            }
            else {
                const ariaLabel = element.ariaLabel ? element.ariaLabel : '';
                const ariaLabelledby = element.getAttribute('aria-labelledby') ? element.getAttribute('aria-labelledby') : '';
                const ariaDescribedby = element.getAttribute('aria-describedby') ? element.getAttribute('aria-describedby') : '';
                text = `aria-label="${ariaLabel}" \n aria-labelledby="${ariaLabelledby}" \n aria-describedby="${ariaDescribedby}"`;
            }
            const srTextElement = document.createElement('div');
            srTextElement.innerText = text;
            srTextElement.className = 'sr-name'; // what should class name be?
            srTextElement.style.backgroundColor = 'blue';
            srTextElement.style.color = 'white';
            srTextElement.style.padding = '3px';
            element.parentNode.insertBefore(srTextElement, element);
        } else {
            const srTextElements = document.querySelectorAll('.sr-name');
            srTextElements.forEach(div => {
                div.remove();
            });
        }
    });
    
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
