export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.border = isChecked ? '2px solid blue' : '';
        if (isChecked) {
            const altText = img.alt ? img.alt : '';
            const altTextElement = document.createElement('div');
            altTextElement.innerText = `alt="${altText}"`;
            altTextElement.className = 'alt-name';
            altTextElement.style.backgroundColor = 'blue';
            altTextElement.style.color = 'white';
            altTextElement.style.padding = '3px';
            img.parentNode.insertBefore(altTextElement, img);
        } else {
            const altTextElements = document.querySelectorAll('.alt-name');
            altTextElements.forEach(div => {
                div.remove();
            });
        }
    });
}
