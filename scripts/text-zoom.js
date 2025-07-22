export function toggleZoom(isChecked) {
    let zoomLevel = 2;
    let zoomLabel = {};
    const body = document.body;
    let prerender = [];
    let initialFontSize = null;
    let style = null;
    const head = document.head || document.getElementsByTagName('head')[0];
    const port = chrome.runtime.connect({ name: "text-zoom" });
    port.postMessage({ status: 'connected' });
    port.onMessage.addListener(handleZoomChange);

    isChecked ? textZoom_checked() : textZoom_unchecked();

    function textZoom_checked() {
        if (!body.classList.contains('equa11y-zoom')) {
            chrome.storage.sync.get().then(result => {
                zoomLevel = result['zoomSlider']?.slider || 2;
                prerender = [];
                const textElements = document.querySelectorAll("body *:not(style, script, noscript, iframe, link, embed, hr, br, img, video, canvas, footer, #equa11y_zoom)");
                initialFontSize = getComputedInt(body, 'fontSize');
                generateZoomLabel();
                getFontSize(textElements);
                setFontSize();
                body.classList.add('equa11y-zoom');
            });
        } else {
            // Already zoomed, just update
            const textElements = document.querySelectorAll("body *:not(style, script, noscript, iframe, link, embed, hr, br, img, video, canvas, footer, #equa11y_zoom)");
            prerender = [];
            getFontSize(textElements);
            setFontSize();
        }
    }

    function textZoom_unchecked() {
        document.getElementById('equa11y_zoom')?.remove();
        document.getElementById('text_zoom_css')?.remove();
        body.classList.remove('equa11y-zoom');
        removeFontSize();
        prerender = [];
    }

    function generateZoomLabel() {
        if (!document.getElementById('equa11y_zoom')) {
            zoomLabel = document.createElement('div');
            zoomLabel.innerHTML = `Text resized: ${Math.round(zoomLevel * 100)}%`;
            zoomLabel.className = 'equa11y-label';
            zoomLabel.id = 'equa11y_zoom';
            zoomLabel.style.cssText = `position: fixed; font-size: 16px !important;`;
            body.prepend(zoomLabel);
        } else {
            document.getElementById('equa11y_zoom').innerHTML = `Text resized: ${Math.round(zoomLevel * 100)}%`;
        }
    }

    function getFontSize(textElements) {
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

        // Remove any previous style
        document.getElementById('text_zoom_css')?.remove();

        // Create and append new style
        style = document.createElement('style');
        style.id = 'text_zoom_css';
        style.appendChild(document.createTextNode(`* { font-size: ${initialFontSize * zoomLevel}px !important; }`));
        head.appendChild(style);
    }

    function removeFontSize() {
        document.querySelectorAll('.equa11y-zoom-text').forEach(el => {
            // Restore original font size and line height if available
            if (el.dataset.font) {
                el.style['font-size'] = `${el.dataset.font}px`;
            } else {
                el.style['font-size'] = null;
            }
            el.style['line-height'] = null;
            el.style['transition'] = null;
            el.classList.remove('equa11y-zoom-text');
            delete el.dataset.font;
        });
        document.getElementById('text_zoom_css')?.remove();
    }

    function getComputedInt(element, attr) {
        const computedStyle = getComputedStyle(element);
        const style = computedStyle[attr];
        return parseFloat(style);
    }

    function addStyle(el, name, value) {
        el.style.setProperty(name, `${value}px`, 'important');
    }

    function updateFontSize() {
        if (!initialFontSize) initialFontSize = getComputedInt(body, 'fontSize');
        document.getElementById('text_zoom_css').textContent = `* { font-size: ${initialFontSize * zoomLevel}px !important; }`;
        document.getElementById('equa11y_zoom').innerHTML = `Text resized: ${Math.round(zoomLevel * 100)}%`;
        prerender.forEach(el => {
            let { element, lineHeight, fontSize } = el;
            addStyle(element, 'line-height', lineHeight * zoomLevel);
            addStyle(element, 'font-size', fontSize * zoomLevel);
        });
    }

    function handleZoomChange(msg) {
        zoomLevel = msg.zoomLevel;
        updateFontSize();
    }
}