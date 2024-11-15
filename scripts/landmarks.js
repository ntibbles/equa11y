export function toggleLandmarkOutlines(isChecked) {
    const landmarks = [
        'header', 'nav', 'main', 'footer', 'aside', 'search', 'form', '[role="region"]', '[role="complementary"]'
    ];

    if (isChecked) {
        landmarks.forEach(landmark => {
            document.querySelectorAll(landmark).forEach(element => {
                // Add border and label
                element.style.border = '2px solid blue';
                ariaLabel = element.getAttribute('aria-label');

                if(landmark.indexOf("role") > -1) {
                    landmark = landmark.substring(7, landmark.indexOf(']') - 1);
                }

                // Check if label already exists
                if (!element.querySelector('.at3-label')) {
                    const label = document.createElement('div');
                    label.textContent = ariaLabel ? `${ariaLabel} (${landmark})` : landmark;
                    label.classList.add('at3-label');
                    
                    element.prepend(label);
                }
            });
        });
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
    }
}
