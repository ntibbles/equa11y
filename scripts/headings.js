export function toggleHeadingOutline(isChecked = false) {
    const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const tagList = ['equa11y-border', 'equa11y-heading-label'];
    const clsList = ['equa11y-label', 'equa11y-headings'];
    const config = { childList: true, subtree: true };
    let label = {};

    isChecked ? heading_checked() : heading_unchecked();

    function heading_checked() {
        buildHeadingTree();
        window.equa11y_observer = window.equa11y_observer || new MutationObserver(headingChange);
        window.equa11y_observer.observe(document.body, config);
    }

    function heading_unchecked() {
        window.equa11y_observer.disconnect();
        clearHeadingTree();
    }

    function buildHeadingTree() {
        findHeadingTags(document.querySelectorAll(headingTags.join(','))).forEach(tag => {
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
    }

    function clearHeadingTree() {
        findHeadingTags(document.querySelectorAll(headingTags.join(','))).forEach(tag => {
            tag.el.style.border = '';
            const label = tag.el.querySelector('.equa11y-headings');
            if (label) {
                tag.el.classList.remove(...tagList);
                tag.el.removeChild(label);
                label.classList.remove('skipped');
            }
        });
    }

    function headingChange(mutationList) {
        for (let list of mutationList) {
            if (list.addedNodes.length && isChecked) {
                if (findHeadingTags(list.addedNodes).length) {
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
}