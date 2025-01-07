export function toggleZoom(isChecked) {
    let zoomLevel = 2;
    let zoomLabel = {};
    const body = document.body;
    const prerender = [];
    const initialFontSize = getComputedInt(body, 'fontSize');
    const css = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'text_zoom_css';
    const port = chrome.runtime.connect({name: "text-zoom"});
    port.postMessage({status: 'connected'});
    port.onMessage.addListener(handleZoomChange);
    const textElements = document.querySelectorAll("body *:not(style, script, noscript, iframe, link, embed, hr, br, img, video, canvas, footer, #equa11y_zoom)");

    isChecked ? textZoom_checked() : textZoom_unchecked();

    function textZoom_checked() {
        if(!body.classList.contains('equa11y-zoom')) {
            chrome.storage.sync.get().then(result => {
                zoomLevel = result['zoomSlider']?.slider || 2;
                generateZoomLabel();
                getFontSize();
                setFontSize();
                body.classList.add('equa11y-zoom');
            });
        } else {
            getFontSize();
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom')?.remove();
        body.classList.remove('equa11y-zoom');
        removeFontSize();
    }

    function generateZoomLabel() {
        if(!document.getElementById('equa11y_zoom')) {
            zoomLabel = document.createElement('div');
            zoomLabel.innerHTML = `Text resized: ${Math.round(zoomLevel*100)}%`;
            zoomLabel.className = 'equa11y-label';
            zoomLabel.id = 'equa11y_zoom';
            zoomLabel.style.cssText = `position: fixed; font-size: 16px !important;`
            body.prepend(zoomLabel);
        }
    }

    function getFontSize() {
        textElements.forEach((element) => {
            let attr = {
                element,
                lineHeight: getComputedInt(element, 'line-height'),
                fontSize: getComputedInt(element, 'fontSize')
            };
            prerender.push(attr);
        });
    }

    function setFontSize() {
        prerender.forEach(el => {
            let { element, lineHeight, fontSize } = el;
            element.classList.add('equa11y-zoom-text');
            element.style['transition'] = 'font 0s';
            element.dataset.font = fontSize;
            addStyle(element, 'line-height', lineHeight * zoomLevel);
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });

        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    function removeFontSize() {
        document.querySelectorAll('.equa11y-zoom-text').forEach(el => {
            el.style['font-size'] = null;
            el.style['line-height'] = null;
            el.style['transition'] = null;
            el.classList.remove('equa11y-zoom-text');
        });
        document.getElementById('text_zoom_css').textContent = '';
    }

    function getComputedInt(element, attr) {
        if(element.dataset.font) return element.dataset.font;
        const computedStyle = getComputedStyle(element);
        const style = computedStyle[attr];
        
        return parseFloat(style);
    }

    function addStyle(el, name, value) {
        return el.style.cssText += ` ${name}: ${value}px !important;`;
    }

    function updateFontSize() {
        document.getElementById('text_zoom_css').cssText = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
        document.getElementById('equa11y_zoom').innerHTML = `Text resized: ${Math.round(zoomLevel*100)}%`;
        prerender.forEach(el => {
            let { element, lineHeight, fontSize } = el;
            addStyle(element, 'line-height', lineHeight * zoomLevel);
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });
        if(zoomLevel === 1) {
            removeFontSize();
        }
    }

    function handleZoomChange(msg) {
        zoomLevel = msg.zoomLevel;
        updateFontSize();
    }
}