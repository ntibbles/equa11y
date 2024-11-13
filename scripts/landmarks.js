export function toggleLandmarkOutlines(isChecked) {
    const landmarks = [
        'header', 'nav', 'main', 'footer', 'aside', 'search', 'form', '[role="region"]', '[role="complementary"]'
    ];

    if (isChecked) {
        landmarks.forEach(landmark => {
            document.querySelectorAll(landmark).forEach(element => {
                // Add border and label
                element.style.border = '2px solid blue';
                element.style.position = 'relative';
                ariaLabel = element.getAttribute('aria-label');

                // Check if label already exists
                if (!element.querySelector('.landmark-label')) {
                    const label = document.createElement('div');
                    label.textContent = ariaLabel ? `${ariaLabel} (${landmark})` : landmark;
                    label.classList.add('landmark-label');
                    label.style.position = 'absolute';
                    label.style.top = '0';
                    label.style.left = '0';
                    label.style.backgroundColor = 'blue';
                    label.style.padding = '2px';
                    label.style.fontSize = '12px';
                    label.style.color = 'white';
                    label.style.border = '1px solid blue';
                    label.style.zIndex = '10000'; // Ensures label stays on top
                    element.appendChild(label);
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
            document.querySelectorAll('.landmark-label').forEach(element => {
                element.remove();
            })
        });
    }
}
