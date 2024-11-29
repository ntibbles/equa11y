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
    const body = document.body;
    const zoomLabel = document.createElement('div');
    zoomLabel.style.position = 'fixed';
    zoomLabel.innerHTML = 'Text zoomed 200%';
    zoomLabel.className = 'equa11y-label';
    style.id = 'equa11y_zoom';
    
    isChecked ? textZoom_checked() : textZoom_unchecked();

    function textZoom_checked() {
        // prevent reinit if ext is closed and reopened
        if(!document.getElementById('equa11y_zoom')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(zoomLabel);
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom').remove();
        document.querySelector('.equa11y-label').remove();
    }
}