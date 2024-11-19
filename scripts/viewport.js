export function revealViewportTag(isChecked) {
    const viewportTag = document.querySelector('meta[name="viewport"]');
    const viewportTextElement = document.createElement('div');
    if (isChecked) {
        if(!document.getElementById('at3-label')) {  // FIX ME: code stink
            const viewportText = viewportTag.outerHTML;
            viewportTextElement.innerText = viewportText;
            viewportTextElement.className = 'at3-label';
            viewportTextElement.style.position = 'fixed';
            viewportTextElement.id = 'at3-label';
            document.body.prepend(viewportTextElement);
        }
    } else {
        document.getElementById('at3-label')?.remove();
    }
}