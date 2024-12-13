export function toggleZoom(isChecked) {
    let zoomLevel = 2;
    const textElements = document.querySelectorAll("body *:not(style, script, noscript, iframe, link, embed, hr, br, img, video, canvas, footer, #equa11y_zoom)");
    const body = document.body;
    const prerender = [];
    const initialFontSize = getComputedInt(body, 'fontSize');
    const css = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    const port = chrome.runtime.connect({name: "text-zoom"});
    let zoomLabel = {};
    port.postMessage({status: 'connected'});
    port.onMessage.addListener(handleZoomChange);
    style.id = 'text_zoom_css';
    isChecked ? textZoom_checked() : textZoom_unchecked();

    function textZoom_checked() {
        if(!document.body.classList.contains('equa11y-zoom')) {
            chrome.storage.sync.get().then(result => {
                zoomLevel = result['zoomSlider']?.slider || 2;
                generateZoomLabel();
                getFontSize();
                setFontSize();
                document.body.classList.add('equa11y-zoom');
            });
        } else {
            getFontSize();
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom').remove();
        document.body.classList.remove('equa11y-zoom');
        removeFontSize();
    }

    function generateZoomLabel() {
        if(!document.getElementById('equa11y_zoom')) {
            zoomLabel = document.createElement('div');
            zoomLabel.innerHTML = `Text zoomed ${Math.round(zoomLevel*100)}%`;
            //zoomLabel.style.position = 'fixed';
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
                fontSize: getComputedInt(element, 'fontSize')
            };
            prerender.push(attr);
        });
    }

    function setFontSize() {
        prerender.forEach(el => {
            let { element, fontSize } = el;
            element.classList.add('equa11y-zoom-text');
            element.style['transition'] = 'font 0s';
            element.dataset.font = fontSize;
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });

        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    function removeFontSize() {
        document.querySelectorAll('.equa11y-zoom-text').forEach(el => {
            el.classList.remove('equa11y-text-zoom');
            el.style['font-size'] = null;
            el.style['line-height'] = null;
            el.style['transition'] = null;
        });
        document.getElementById('text_zoom_css').remove();
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
        document.getElementById('text_zoom_css').textContent = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
        document.getElementById('equa11y_zoom').innerHTML = `Text zoomed ${Math.round(zoomLevel*100)}%`;
        prerender.forEach(el => {
            let { element, fontSize } = el;
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });
    }

    function handleZoomChange(msg) {
        zoomLevel = msg.zoomLevel;
        updateFontSize();
    }
}