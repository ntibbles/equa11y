export function grayscale(isChecked) {
    const css = `* { filter: grayscale(1) !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    const body = document.body;
    const grayscaleLabel = document.createElement('div');
    grayscaleLabel.innerHTML = 'Grayscale Page';
    grayscaleLabel.style.position = 'fixed';
    grayscaleLabel.className = 'equa11y-label';

    style.id = 'equa11y_gray';
    
    isChecked ?  grayscale_checked() : grayscale_unchecked();

    function grayscale_checked() {
        if(!document.getElementById('equa11y_gray')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            body.prepend(grayscaleLabel);
        }
    }

    function grayscale_unchecked() {
        document.getElementById('equa11y_gray').remove();
        document.querySelector('.equa11y-label').remove();
    }
}
