export function toggleLandmarkOutlines(isChecked) {
    const landmarks = [
        'nav', 'main', 'footer', 'aside', 'search', 'form', 'section',
        '[role="region"]', '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
        '[role="main"]', '[role="banner"]', '[role="navigation"]'
    ];
    const elCls = ['equa11y-border', 'equa11y-landmark'];
    const clsList = ['equa11y-label', 'equa11y-landmarks'];

    isChecked ? toggleLandmarks_checked() : toggleLandmarks_unchecked();

    function toggleLandmarks_checked() {
        landmarks.forEach(landmark => {
            document.querySelectorAll(landmark).forEach(element => {
               
                let ariaLabel = element.getAttribute('aria-label');
                let labelText = '';

                // Check for aria-labelledby and get the linked text
                if (!ariaLabel && element.hasAttribute('aria-labelledby')) {
                    const labelledbyIds = element.getAttribute('aria-labelledby').split(' ');
                    const linkedTexts = labelledbyIds
                        .map(id => {
                            const linkedElement = document.getElementById(id);
                            return linkedElement ? linkedElement.textContent.trim() : '';
                        })
                        .filter(text => text.length > 0);
                    
                    if (linkedTexts.length > 0) {
                        labelText = linkedTexts.join(' ');
                    }
                } else if (ariaLabel) {
                    labelText = ariaLabel;
                }

                if (landmark.indexOf("role") > -1) {
                    landmark = landmark.substring(7, landmark.indexOf(']') - 1);
                }

                // Check if footer is nested within article, aside, main, nav, or section
                if (element.tagName === 'FOOTER') {
                    const parentElement = element.closest('article, aside, main, nav, section');
                    if (parentElement) {
                        return; // Ignore nested footer elements
                    }
                }

                // Check if section element has a label, ignore if it doesn't
                if (element.tagName === 'SECTION' || element.getAttribute('role') === 'region') {
                    const hasLabel = element.hasAttribute('aria-label') || 
                                   element.hasAttribute('aria-labelledby') || 
                                   element.hasAttribute('title');
                    if (!hasLabel) {
                        return; // Ignore section elements without labels
                    }
                }

                if(!element.classList.contains('equa11y-landmark')) {
                    const label = document.createElement('div');
                    label.textContent = labelText ? `${labelText} [${landmark}]` : landmark;
                    label.classList.add(...clsList);

                    element.classList.add(...elCls);
                    element.prepend(label);
                }
            });
        });
    }

    function toggleLandmarks_unchecked() {
        landmarks.forEach(landmark => {
            document.querySelectorAll(landmark).forEach(element => {
                element.classList.remove(...elCls);
            });
    
            // Remove existing label
            document.querySelectorAll('.equa11y-landmarks').forEach(element => {
                element.remove();
            })
        });    
    }
}
