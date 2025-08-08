export function toggleAltTextDisplay(isChecked) {
    const images = document.querySelectorAll('img');
    const altTextElements = document.querySelectorAll('.equa11y-alt');
    const clsList = ['equa11y-label', 'equa11y-alt'];
    const imgCls = ['equa11y-border', 'equa11y-alt-container'];
    const config = { childList: true, subtree: true };

    isChecked ? altText_checked() : altText_unchecked();

    function altText_checked() {
        buildAltTextTree();
        // Create a MutationObserver to watch for changes in the DOM
        if (window.equa11y_observer) {
            window.equa11y_observer.disconnect();
        }
        // Initialize the observer to monitor changes in the document body
        // This will allow us to update the alt text display dynamically
        // when new images are added or existing ones are modified
        window.equa11y_observer = window.equa11y_observer || new MutationObserver(buildAltTextTree);
        window.equa11y_observer.observe(document.body, config);
    }

    function altText_unchecked() {
        window.equa11y_observer.disconnect();
        images.forEach(img => {
            img.parentNode.style.cssText = img.parentNode.dataset.orgStyle || '';
            img.classList.remove(...imgCls);
        });
    
        altTextElements.forEach(label => {
            label.remove();
        });
    }

    function buildAltTextTree() {
        console.log('Building alt text tree');
        images.forEach(img => {
            if(!img.classList.contains('equa11y-alt-container')) {
                const altText = img.hasAttribute('alt') ? `alt="${img.alt}"` : 'missing alt attribute';
                const altTextElement = document.createElement('div');
                img.classList.add(...imgCls);
                altTextElement.innerText = altText;
                altTextElement.classList.add(...clsList);
                altTextElement.style.cssText = 'position: relative; bottom: 0; left: 0; box-sizing: border-box; z-index: 10000;';
                img.parentNode.dataset.orgStyle = img.parentNode.style.cssText;
                img.parentNode.style.cssText = (img.parentNode.style.cssText ? img.parentNode.style.cssText + '; ' : '') + 'overflow: visible !important; position: relative;';
                img.insertAdjacentElement('beforebegin', altTextElement);

                if(!img.hasAttribute('alt')) {
                    altTextElement.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
                }
            }
        });
    }
}
