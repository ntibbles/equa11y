export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    const altTextElements = document.querySelectorAll('.equa11y-alt');
    const clsList = ['equa11y-label', 'equa11y-alt'];

    isChecked ? altText_checked() : altText_unchecked();

    function altText_checked() {
        images.forEach(img => {
            if(!img.classList.contains('equa11y-alt-container')) {
                const altText = img.alt ? img.alt : '';
                const altTextElement = document.createElement('div');
                img.style.border = '2px solid blue';
                img.style.position= 'relative';
                img.className = 'equa11y-alt-container';
        
                altTextElement.innerText = `alt="${altText}"`;
                altTextElement.classList.add(...clsList);
                img.parentNode.insertBefore(altTextElement, img);
            }
        });
    }

    function altText_unchecked() {
        images.forEach(img => {
            img.classList.remove('equa11y-alt-container')
            img.removeAttribute('style');
        });
    
        altTextElements.forEach(label => {
            label.remove();
        });
    }
}
