export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    const altTextElements = document.querySelectorAll('.equa11y-alt');
    const clsList = ['equa11y-label', 'equa11y-alt'];
    const imgCls = ['equa11y-border', 'equa11y-alt-container'];

    isChecked ? altText_checked() : altText_unchecked();

    function altText_checked() {
        images.forEach(img => {
            if(!img.classList.contains('equa11y-alt-container')) {
                const altText = img.alt ? img.alt : '';
                const altTextElement = document.createElement('div');
                img.classList.add(...imgCls);
                altTextElement.innerText = `alt="${altText}"`;
                altTextElement.classList.add(...clsList);
                img.parentNode.insertBefore(altTextElement, img);
            }
        });
    }

    function altText_unchecked() {
        images.forEach(img => {
            img.classList.remove(...imgCls);
        });
    
        altTextElements.forEach(label => {
            label.remove();
        });
    }
}
