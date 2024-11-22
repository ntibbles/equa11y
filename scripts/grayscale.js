export function grayscale(isChecked) {
    const css = `* { filter: grayscale(1) !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'equa11y_gray';
    const body = document.body;
    const zoomLabel = document.createElement('div');
    zoomLabel.innerHTML = 'Grayscale Page';
    zoomLabel.style.position = 'fixed';
    zoomLabel.className = 'equa11y-label';
    
    if (isChecked) {
        // prevent reinit if ext is closed and reopened
        if(!document.getElementById('equa11y_gray')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(zoomLabel);
        }
    } else {
        document.getElementById('equa11y_gray').remove();
        document.querySelector('.equa11y-label').remove();
    }
}
