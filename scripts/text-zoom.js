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
    style.id = 'aid_zoom';
    const body = document.body;
    const zoomLabel = document.createElement('div');
    zoomLabel.innerHTML = 'Text zoomed 200%';
    zoomLabel.id = 'aid_label';
    zoomLabel.style.position = 'fixed';
    zoomLabel.style.zIndex = '1000';
    zoomLabel.style.top = '10px';
    zoomLabel.style.left = '50%';
    zoomLabel.style.backgroundColor = 'blue';
    zoomLabel.style.color = 'white';
    zoomLabel.style.padding = '5px 10px';
    zoomLabel.style.fontSize = '16px';
    
    if (isChecked) {
        // prevent reinit if ext is closed and reopened
        if(!document.getElementById('aid_zoom')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(zoomLabel);
        }
    } else {
        document.getElementById('aid_zoom').remove();
        document.getElementById('aid_label').remove();
    }
}