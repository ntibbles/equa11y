export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.border = isChecked ? '2px solid blue' : '';
        img.style.position= 'relative';
        if (isChecked) {
            const altText = img.alt ? img.alt : '';
            const altTextElement = document.createElement('div');
            altTextElement.innerText = `alt="${altText}"`;
            altTextElement.className = 'at3-label';
            img.parentNode.insertBefore(altTextElement, img);
        } else {
            const altTextElements = document.querySelectorAll('.at3-label');
            altTextElements.forEach(div => {
                div.remove();
            });
        }
    });
}
