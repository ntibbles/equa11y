export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    const altTextElements = document.querySelectorAll('.equa11y-alt');
    const clsList = ['equa11y-label', 'equa11y-alt'];

    images.forEach(img => {
        img.removeAttribute('style');
    });

    altTextElements.forEach(label => {
        label.remove();
    });

    if(isChecked) {
        images.forEach(img => {
            const altText = img.alt ? img.alt : '';
            const altTextElement = document.createElement('div');
            img.style.border = '2px solid blue';
            img.style.position= 'relative';
    
            altTextElement.innerText = `alt="${altText}"`;
            altTextElement.classList.add(...clsList);
            img.parentNode.insertBefore(altTextElement, img);
        });
    }
}
