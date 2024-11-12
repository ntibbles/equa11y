export function revealViewportTag(isChecked) {
    const viewportTag = document.querySelector('meta[name="viewport"]');
    const viewportTextElement = document.createElement('div');
    if (isChecked) {
        const viewportText = viewportTag.outerHTML;
        viewportTextElement.innerText = viewportText;
        viewportTextElement.id = 'vp'
        viewportTextElement.style.position = 'fixed';
        viewportTextElement.style.zIndex = 10000;
        viewportTextElement.style.backgroundColor = 'blue';
        viewportTextElement.style.color = 'white';
        viewportTextElement.style.border = '2px solid blue';
        document.body.prepend(viewportTextElement);
    } else {
        document.getElementById('vp')?.remove();
    }
}