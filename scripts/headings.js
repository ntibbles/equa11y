export function toggleHeadingOutline(isChecked) {
    // Define the list of heading tags
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // Loop through each heading tag
    headingTags.forEach(tag => {
        // Get all elements with the specified heading tag
        const headings = document.querySelectorAll(tag);

        // Iterate through each heading element
        headings.forEach(heading => {
            if (isChecked) {
                // If isChecked is true, add border and label
                heading.style.border = '2px solid blue';
                heading.style.position = 'relative';  // Ensure relative positioning for label placement

                // Check if the label already exists, and avoid creating a new one
                if (!heading.querySelector('.heading-label')) {
                    // Create a label for the heading level
                    const label = document.createElement('div');
                    label.className = 'at3-label';  // Assign a class for easy identification
                    label.innerText = tag.toUpperCase();  // Heading level (e.g., H1, H2)
                    // label.style.position = 'absolute';
                    // label.style.top = '0';
                    // label.style.left = '0';
                    // label.style.backgroundColor = 'blue';  // Background for readability
                    // label.style.color = 'white';  // Text color
                    // label.style.padding = '2px 5px';  // Padding around the text
                    // label.style.fontSize = '12px';  // Smaller font size
                    // label.style.fontWeight = 'bold';
                    // label.style.zIndex = '1000';  // Ensure it's above other content

                    // Append the label to the heading
                    heading.prepend(label);
                }
            } else {
                // If isChecked is false, remove border and label
                heading.style.border = '';  // Reset the border
                const label = heading.querySelector('.at3-label');
                if (label) {
                    heading.removeChild(label);  // Remove the label
                }
            }
        });
    });
}

// Example usage:
// Call toggleHeadingOutline(true) to add borders and labels
// Call toggleHeadingOutline(false) to remove borders and labels
