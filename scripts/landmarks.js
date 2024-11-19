export function toggleLandmarkOutlines(isChecked) {
    const landmarks = [
        'section', 'header', 'nav', 'main', 'footer', 'aside', 'search', 'form',
        '[role="region"]', '[role="complementary"]', '[role="contentinfo"]', '[role="search"]', 
        '[role="main"]', '[role="contentinfo"]', '[role="banner"]', '[role="navigation"]'
    ];

    if (isChecked) {
        if(!document.body.classList.contains('at3-landmarks')) { // FIX ME: code stink
            landmarks.forEach(landmark => {
                document.querySelectorAll(landmark).forEach(element => {
                    const label = document.createElement('div');
                    // Add border and label
                    element.style.border = '2px solid blue';
                    ariaLabel = element.getAttribute('aria-label');

                    if(landmark.indexOf("role") > -1) {
                        landmark = landmark.substring(7, landmark.indexOf(']') - 1);
                    }

                    label.textContent = ariaLabel ? `${ariaLabel} (${landmark})` : landmark;
                    label.classList.add('at3-label');
                    
                    element.prepend(label);
                });
            });
        }
        document.body.classList.add('at3-landmarks');
    } else {
        // Remove all borders and labels
        landmarks.forEach(landmark => {
            document.querySelectorAll(landmark).forEach(element => {
                element.style.border = 'none';
            });

            // Remove existing label
            document.querySelectorAll('.at3-label').forEach(element => {
                element.remove();
            })
        });
        document.body.classList.remove('at3-landmarks');
    }
}
