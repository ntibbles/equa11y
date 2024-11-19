export function toggleHeadingOutline(isChecked) {
    // Define the list of heading tags
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const allTags = document.querySelectorAll(headingTags.join(','));
    const levels = [];
    let label = {};
    let isSkipped = false;

    // Loop through each heading tag
    allTags.forEach((tag, index) => {
        if (isChecked) {
            tag.style.border = '2px solid blue';
            tag.style.position = 'relative';  // Ensure relative positioning for label placement
            levels.push(Number(tag.nodeName.substring(1)));
            if(index === 0 && tag.nodeName !== 'H1') {
                isSkipped = true;
            } else {
                isSkipped = findSkippedNumbers([levels[index - 1], levels[index]]).length;
            }

            // Check if the label already exists, and avoid creating a new one
            if(!tag.querySelector('.heading-label')) {
                // Create a label for the heading level
                label = document.createElement('div');
                label.className = 'at3-label';  // Assign a class for easy identification
                label.innerText = tag.nodeName.toUpperCase();  // Heading level (e.g., H1, H2)
            
                // Append the label to the heading
                tag.prepend(label);
            }

            if(isSkipped) {
                label.style.cssText = 'background-color: darkred !important;  outline: 2px dashed black;';
            }
        } else {
            // If isChecked is false, remove border and label
            tag.style.border = '';  // Reset the border
            const label = tag.querySelector('.at3-label');
            if (label) {
                tag.removeChild(label);  // Remove the label
            }
        }
    });
    
    function findSkippedNumbers(arr) {
        // Sort the array in ascending order
        arr.sort((a, b) => a - b);

        const skippedNumbers = [];
        let start = arr[0];
        let end = arr[arr.length - 1];

        // Iterate through the range of numbers between the first and last elements
        for (let i = start + 1; i < end; i++) {
            if (!arr.includes(i)) {
                skippedNumbers.push(i);
            }
        }

        return skippedNumbers;
    }
}