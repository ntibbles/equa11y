export function revealViewportTag(isChecked) {
    const viewportTag = document.querySelector('meta[name="viewport"]');
    const viewportTextElement = document.createElement('div');
    if (isChecked) {
        if(!document.getElementById('equa11y-label')) {  // FIX ME: code stink
            const viewportText = viewportTag.outerHTML;
            viewportTextElement.innerText = viewportText;
            viewportTextElement.className = 'equa11y-label';
            viewportTextElement.style.position = 'fixed';
            viewportTextElement.id = 'equa11y-label';
            document.body.prepend(viewportTextElement);
        }
    } else {
        document.getElementById('equa11y-label')?.remove();
    }
}