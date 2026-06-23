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
               
               
                ariaLabel = element.getAttribute('aria-label');

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

                if(!element.classList.contains('equa11y-landmark')) {
                    const label = document.createElement('div');
                    label.textContent = ariaLabel ? `${ariaLabel} [${landmark}]` : landmark;
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
