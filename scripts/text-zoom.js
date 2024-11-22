export function toggleZoom(isChecked) {
    function getComputedFontSize() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const fontSize = computedStyle.fontSize;
        
        return parseFloat(fontSize);
    }

    const css = `* { font-size: ${getComputedFontSize() * 2}px !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'equa11y_zoom';
    const body = document.body;
    const zoomLabel = document.createElement('div');
    zoomLabel.innerHTML = 'Text zoomed 200%';
    zoomLabel.className = 'equa11y-label';
    
    if (isChecked) {
        // prevent reinit if ext is closed and reopened
        if(!document.getElementById('equa11y_zoom')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(zoomLabel);
        }
    } else {
        document.getElementById('equa11y_zoom').remove();
        document.querySelector('.equa11y-label').remove();
    }
}