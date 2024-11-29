export function revealViewportTag(isChecked) {
    const viewportTag = document.querySelector('meta[name="viewport"]');
    const viewportTextElement = document.createElement('div');
    
    isChecked ? revealViewportTag_checked() : revealViewportTag_unchecked();

    function revealViewportTag_checked() {
        if(!document.getElementById('equa11y-label')) {
            const viewportText = viewportTag.outerHTML;
            viewportTextElement.innerText = viewportText;
            viewportTextElement.className = 'equa11y-label';
            viewportTextElement.style.position = 'fixed';
            viewportTextElement.id = 'equa11y-label';
            document.body.prepend(viewportTextElement);
        }
    }

    function revealViewportTag_unchecked() {
        document.getElementById('equa11y-label')?.remove();
    }
}