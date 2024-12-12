export function toggleZoom(isChecked) {
    let zoomLevel = 2;
    let css = '';
    const baseFont = getComputedFontSize();
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
            head.appendChild(style);
            body.prepend(zoomLabel);
            setFontSize(zoomLabel);
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom').remove();
        document.querySelector('.equa11y-label').remove();
    }

    function setFontSize() {
        css = `* { font-size: ${baseFont * zoomLevel}px !important; }`;
        style.appendChild(document.createTextNode(css));
    }

    function getComputedFontSize() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const fontSize = computedStyle.fontSize;
        
        return parseFloat(fontSize);
    }

    function handleZoomChange(evt) {

    }
}