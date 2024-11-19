export function grayscale(isChecked) {
    const css = `* { filter: grayscale(1) !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'at3_gray';
    const body = document.body;
    const zoomLabel = document.createElement('div');
    zoomLabel.innerHTML = 'Grayscale Page';
    zoomLabel.style.position = 'fixed';
    zoomLabel.className = 'at3-label';
    
    if (isChecked) {
        // prevent reinit if ext is closed and reopened
        if(!document.getElementById('at3_gray')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(zoomLabel);
        }
    } else {
        document.getElementById('at3_gray').remove();
        document.querySelector('.at3-label').remove();
    }
}
