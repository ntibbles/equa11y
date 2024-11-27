export function exclusiveText(isChecked) {
    const regex = /\bsee|view|look|watch|observe|gaze|notice|spto|peek|stare|glance|scan|sight|perceive\b/gi;
    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT
    );
    const nodesToUpdate = [];
    let node;

    (isChecked) ? addHighlight() : removeHighlight();

    function addHighlight() {
        while ((node = treeWalker.nextNode())) {
            let hasText = node.textContent.match(regex);
            if(hasText && isTextNode(node)) {
                nodesToUpdate.push(node);
            }
        }

        nodesToUpdate.map(el => {
            if(!el.classList.contains('equally-highlight')) {
                let content = el.textContent.replaceAll(regex, (word) => { return `<span class="equally-highlight">${word}</span>` });
                el.innerHTML = content;
            }
        });
    }

    function isTextNode(node) {
        return (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3);
    }

    function removeHighlight() {
        document.querySelectorAll('.equally-highlight').forEach(el => {
            let curContent = el.parentElement?.innerText;
            let content = el.textContent.replaceAll(regex, curContent);
            if(el.parentElement) el.parentElement.innerText = content;
        });
    }
}