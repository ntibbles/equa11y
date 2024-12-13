export function toggleZoom(isChecked) {
    let zoomLevel = 2;
    const textElements = document.querySelectorAll("body *:not(style, script, noscript, iframe, link, embed, hr, br, img, video, canvas, footer)");
    const body = document.body;
    const prerender = [];
    const initialFontSize = getComputedInt(body, 'fontSize');
    const css = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'text_zoom_css';
    const zoomLabel = document.createElement('div');
    zoomLabel.style.position = 'fixed';
    zoomLabel.innerHTML = `Text zoomed ${zoomLevel}%`;
    zoomLabel.className = 'equa11y-label';
    zoomLabel.id = 'equa11y_zoom';
    
    isChecked ? textZoom_checked() : textZoom_unchecked();

    function textZoom_checked() {
        if(!document.getElementById('equa11y_zoom')) {
            body.prepend(zoomLabel);
            getFontSize();
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom').remove();
        document.getElementById('text_zoom_css').remove();
        document.querySelectorAll('.equa11y-zoom-text').forEach(el => {
            el.classList.remove('equa11y-text-zoom');
            el.style['font-size'] = null;
            el.style['line-height'] = null;
            el.style['transition'] = null;
        });
    }

    function getFontSize() {
        textElements.forEach((element) => {
            let attr = {
                element,
                fontSize: getComputedInt(element, 'fontSize')
            };
            prerender.push(attr);
        });

        setFontSize();
    }

    function setFontSize() {
        prerender.forEach(el => {
            let { element, fontSize } = el;
            element.classList.add('equa11y-zoom-text');
            element.style['transition'] = 'font 0s';
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });

        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    function getComputedInt(element, attr) {
        const computedStyle = getComputedStyle(element);
        const style = computedStyle[attr];
        
        return parseFloat(style);
    }

    function addStyle(el, name, value) {
        return el.style.cssText += ` ${name}: ${value}px !important;`;
    }
}