export function revealViewportTag(isChecked) {
    const viewportTag = document.querySelector('meta[name="viewport"]');
    const viewportTextElement = document.createElement('div');
    
    isChecked ? revealViewportTag_checked() : revealViewportTag_unchecked();

    function revealViewportTag_checked() {
        if(!document.getElementById('equa11y-label')) {
            const viewportText = viewportTag?.outerHTML;
            viewportTextElement.innerText = viewportText ||  "No viewport tag";
            viewportTextElement.className = 'equa11y-label';
            viewportTextElement.style.position = 'fixed';
            viewportTextElement.id = 'equa11y-label';

            // Detect if pinch-to-zoom is prevented
            if (viewportTag && /user-scalable\s*=\s*no/i.test(viewportTag.content) || /maximum-scale\s*=\s*1/i.test(viewportTag.content)) {
                viewportTextElement.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
            }

            document.body.prepend(viewportTextElement);
        }
    }

    function revealViewportTag_unchecked() {
        document.getElementById('equa11y-label')?.remove();
    }
}