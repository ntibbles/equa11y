export function toggleHeadingOutline(isChecked) {
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const body = document.body;
    const allTags = body.querySelectorAll(headingTags.join(','));
    const levels = [];
    const structure = [];
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
                // send data to sidepanel
                addSidebarContent({level: tag.nodeName, title: tag.textContent, isSkipped, isHidden: isElementHidden(tag)});

                label = document.createElement('div');
                label.classList.add(...clsList);
                label.innerText = tag.nodeName.toUpperCase();
            
                // Append the label to the heading
                tag.classList.add(...tagList);
                tag.prepend(label);
            }

            if(isSkipped && label instanceof HTMLElement) {
                label.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
                label.classList.add('skipped');
            }
        });
       
        document.dispatchEvent(new CustomEvent('open-sidebar', { detail: { title: 'Headings', content: structure } }));
    }

    function heading_unchecked() {
        allTags.forEach(tag => {
            tag.style.border = ''; 
            const label = tag.querySelector('.equa11y-headings');
            if (label) {
                tag.classList.remove(...tagList);
                tag.removeChild(label); 
                label.classList.remove('skipped');
            }
        });

        document.dispatchEvent(new CustomEvent('close-sidebar'));
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

    function isElementHidden(element) {
        if (!element) {
            throw new Error("No element provided");
        }

        if (element.offsetParent === null) {
            return true;
        }
    
        const visibility = window.getComputedStyle(element).visibility;
        if (visibility === 'hidden' || visibility === 'collapse') {
            return true;
        }

        // check if the standard sr-only class is used to reduce the width to 1px
        const width = window.getComputedStyle(element).width;
        if (width === '1px') {
            return true;
        }
    
        const opacity = parseFloat(window.getComputedStyle(element).opacity);
        if (opacity === 0) {
            return true;
        }
    
        return false;
    }

    function addSidebarContent(details) {
        let div = document.createElement('div');
        let heading = document.createElement('strong');
        heading.classList.add('equa11y-label');
        heading.textContent = details.level;
        if(details.isSkipped) heading.classList.add('skipped');
        if(details.isHidden)  heading.classList.add('hidden');
        div.prepend(heading);
        div.innerHTML += `<span>${details.title}</span>`;
        structure.push(div);
    }
}