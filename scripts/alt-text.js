export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    const altTextElements = document.querySelectorAll('.equa11y-alt');
    const clsList = ['equa11y-label', 'equa11y-alt'];
    const imgCls = ['equa11y-border', 'equa11y-alt-container'];

    isChecked ? altText_checked() : altText_unchecked();

    function altText_checked() {
        images.forEach(img => {
            if(!img.classList.contains('equa11y-alt-container')) {
                const altText = img.hasAttribute('alt') ? `alt="${img.alt}"` : 'missing alt attribute';
                const altTextElement = document.createElement('div');
                img.classList.add(...imgCls);
                altTextElement.innerText = altText;
                altTextElement.classList.add(...clsList);
                img.parentNode.dataset.orgStyle = img.parentNode.style.cssText;
                img.parentNode.style.cssText = (img.parentNode.style.cssText ? img.parentNode.style.cssText + '; ' : '') + 'overflow: visible !important; position: relative;';
                img.insertAdjacentElement('afterend', altTextElement);

                if(!img.hasAttribute('alt')) {
                    altTextElement.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
                }
            }
        });
    }

    function altText_unchecked() {
        images.forEach(img => {
            img.parentNode.style.cssText = img.parentNode.dataset.orgStyle || '';
            img.classList.remove(...imgCls);
        });
    
        altTextElements.forEach(label => {
            label.remove();
        });
    }
}
