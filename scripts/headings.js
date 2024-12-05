export function toggleHeadingOutline(isChecked) {
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const allTags = document.querySelectorAll(headingTags.join(','));
    const levels = [];
    const tagList = ['equa11y-border', 'equa11y-heading-label'];
    const clsList = ['equa11y-label', 'equa11y-headings'];
    let label = {};
    let isSkipped = false;

    isChecked ? heading_checked() : heading_unchecked();

    function heading_checked() {
        allTags.forEach((tag, index) => {
            levels.push(Number(tag.nodeName.substring(1)));

            if(index === 0 && tag.nodeName !== 'H1') {
                isSkipped = true;
            } else {
                isSkipped = findSkippedNumbers([levels[index - 1], levels[index]]).length;
            }

            if(!tag.classList.contains('equa11y-heading-label')) {
                label = document.createElement('div');
                label.classList.add(...clsList);
                label.innerText = tag.nodeName.toUpperCase();
            
                // Append the label to the heading
                tag.classList.add(...tagList);
                tag.prepend(label);
            }

            if(isSkipped) {
                label.style.cssText = 'background-color: darkred !important;  outline: 2px dashed black;';
            }
        })

    }

    function heading_unchecked() {
<<<<<<< HEAD
        allTags.forEach(tag => {
            tag.style.border = ''; 
            const label = tag.querySelector('.equa11y-headings');
            if (label) {
                tag.classList.remove(...tagList);
=======
        allTags.forEach((tag, index) => {
            tag.style.border = ''; 
            const label = tag.querySelector('.equa11y-headings');
            if (label) {
                tag.classList.remove('equa11y-heading-label');
>>>>>>> main
                tag.removeChild(label); 
            }
        });
    }

    function findSkippedNumbers(arr) {
        arr.sort((a, b) => a - b);

        const skippedNumbers = [];
        let start = arr[0];
        let end = arr[arr.length - 1];

        for (let i = start + 1; i < end; i++) {
            if (!arr.includes(i)) {
                skippedNumbers.push(i);
            }
        }

        return skippedNumbers;
    }
}