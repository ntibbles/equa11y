export function toggleTabbingOrder(isChecked) {
    const tabbableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const clsList = ['equa11y-label', 'equa11y-tabbing-order'];
    const elList = ['equa11y-border', 'equa11y-tabbing'];
    let tabIndex = 1;

    isChecked ? tabbingOrder_checked() : tabbingOrder_unchecked();

    function isVisible(element) {
        return !!(
            element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length
        ) && window.getComputedStyle(element).visibility !== 'hidden';
    }

    function tabbingOrder_checked() {
        tabbableElements.forEach(element => {
            if (
                !element.classList.contains('equa11y-tabbing') &&
                isVisible(element)
            ) {
                const label = document.createElement('div');
                let tabIndex = getTabIndex(element);
                label.textContent = `${element.nodeName.toLowerCase()} : ${tabIndex}`;
                label.classList.add(...clsList);

                 // Set the label's style based on the tabIndex
                if (element.tabIndex > 0) {
                    label.style.cssText = 'background-color: #AB1B18 !important; outline: 2px dashed black;';
                }

                element.classList.add(...elList);
                element.parentNode.insertBefore(label, element);
            }
        });
    }

    function tabbingOrder_unchecked() {
        document.querySelectorAll('.equa11y-tabbing').forEach(el => {
            el.classList.remove(...elList);
        });

        document.querySelectorAll('.equa11y-label').forEach(el => {
            el.remove();
        });
    }
    
    function getTabIndex(element) {
        return (element.tabIndex < 1) ? tabIndex++ : element.tabIndex;
    }
}