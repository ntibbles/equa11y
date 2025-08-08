export function toggleHeadingOutline(isChecked = false) {
    const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', '[role="heading"]'];
    const tagList = ['equa11y-border', 'equa11y-heading-label'];
    const clsList = ['equa11y-label', 'equa11y-headings'];
    const config = { childList: true, subtree: true };
    let label = {};

    isChecked ? heading_checked() : heading_unchecked();

    function heading_checked() {
        buildHeadingTree();
        if (window.equa11y_observer) {
            window.equa11y_observer.disconnect();
        }
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
                // Use aria-level if present, otherwise use tagName
                if (tag.el.hasAttribute('aria-level')) {
                    label.innerText = `H${tag.el.getAttribute('aria-level')}`;
                } else {
                    label.innerText = tag.el.nodeName.toUpperCase();
                }

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
    // Helper to get heading level from element (supports role="heading")
    function getHeadingLevel(el) {
        if (el.hasAttribute('aria-level')) {
            return parseInt(el.getAttribute('aria-level'), 10);
        }
        if (el.tagName && /^H[1-6]$/.test(el.tagName)) {
            return parseInt(el.tagName.replace('H', ''), 10);
        }
        if (el.getAttribute('role') === 'heading') {
            // Try to infer level if aria-level missing (default to 2)
            return el.hasAttribute('aria-level') ? parseInt(el.getAttribute('aria-level'), 10) : null;
        }
        return null;
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
                if (headingTags.includes(node.tagName) || (node.getAttribute('role') === 'heading')) {
                    // Determine the heading level
                    let currentLevel = getHeadingLevel(node);
                    if (!currentLevel) {
                        continue; // Skip if level cannot be determined
                    }

                    headings.push({ el: node });

                    if (headings.length > 1) {
                        let prevNode = headings[i - 1].el;
                        let prevLevel = prevNode.hasAttribute('aria-level')
                            ? parseInt(prevNode.getAttribute('aria-level'), 10)
                            : parseInt(prevNode.tagName.replace("H", ""), 10);

                        isSkipped = ((currentLevel - prevLevel) > 1);
                    }

                    headings.splice(headings.length - 1, 1, { el: node, isSkipped });

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