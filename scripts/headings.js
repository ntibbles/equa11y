export function toggleHeadingOutline(isChecked = false) {
    const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const tagList = ['equa11y-border', 'equa11y-heading-label'];
    const clsList = ['equa11y-label', 'equa11y-headings'];
    const config = { childList: true, subtree: true };
    let structure = [];
    let label = {};

    isChecked ? heading_checked() : heading_unchecked();

    function heading_checked() {
        window.equa11y_observer = window.equa11y_observer || new MutationObserver(headingChange);
        window.equa11y_observer.observe(document.body, config);
        document.dispatchEvent(new CustomEvent('open-sidebar', { detail: { title: 'Headings' } }));
        buildHeadingTree();
    }

    function heading_unchecked() {
        window.equa11y_observer.disconnect();
        clearHeadingTree();
        document.dispatchEvent(new CustomEvent('close-sidebar'));
    }

    function buildHeadingTree() {
        findHeadingTags(document.body.querySelectorAll(headingTags.join(','))).forEach(tag => {
            addSidebarContent({ title: tag.el.textContent, level: tag.el.nodeName, isSkipped: tag.isSkipped, isHidden: isElementHidden(tag.el)});
            if (!tag.el.classList.contains('equa11y-heading-label')) {
                label = document.createElement('div');
                label.classList.add(...clsList);
                label.innerText = tag.el.nodeName.toUpperCase();

                // Append the label to the heading
                tag.el.classList.add(...tagList);
                tag.el.prepend(label);
            }

            if (tag.isSkipped && label.style) {
                label.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
                label.classList.add('skipped');
            }
        });

        document.dispatchEvent(new CustomEvent('update-sidebar', { detail: { content: structure } }));
    }

    function clearHeadingTree() {
        findHeadingTags(document.body.querySelectorAll(headingTags.join(','))).forEach(tag => {
            tag.el.style.border = '';
            const label = tag.el.querySelector('.equa11y-headings');
            if (label) {
                tag.el.classList.remove(...tagList);
                tag.el.removeChild(label);
                label.classList.remove('skipped');
            }
        });
        structure.splice(0, structure.length);
    }

    function headingChange(mutationList) {
        for (let list of mutationList) {
            let changedNodes = (list.addedNodes.length) ? list.addedNodes : list.removedNodes;
            if (changedNodes.length && isChecked) {
                if (findHeadingTags(changedNodes).length) {
                    clearHeadingTree();
                    buildHeadingTree();
                }
            }
        }
    }

    function findHeadingTags(nodeList) {
        const headings = []; // Array to store found heading elements
        const stack = Array.from(nodeList).reverse(); // Use a stack to process nodes iteratively
        let isSkipped = false;
        let i = 0;

        while (stack.length > 0) {
            const node = stack.pop();

            // Check if the current node is an element
            if (node.nodeType === Node.ELEMENT_NODE) {
                // If it's a heading tag, add it to the list
                if (headingTags.includes(node.tagName)) {
                    headings.push({ el: node });
                    if (headings.length > 1) {
                        let curHeading = parseInt(node.tagName.replace("H", ""), 10);
                        let prevHeading = parseInt(headings[i - 1].el.tagName.replace("H", ""), 10);
                        isSkipped = ((curHeading - prevHeading) > 1) ;
                    } 
                    headings.splice(headings.length - 1, 1, { el: node, isSkipped});

                    i++;
                }

                // Add child nodes to the stack for further processing
                if (node.hasChildNodes()) {
                    stack.push(...node.childNodes);
                }
            }
        }

        return headings;
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