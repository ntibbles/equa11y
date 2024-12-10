import { dispatch } from "./utils/events.js";

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('popup-load-screen', evt => updateScreen(evt.detail));
document.addEventListener('popup-font-size', evt => setFontSize(evt.detail));

let fontSize = 1;

function init() {
    fontSize = getComputedFontSize();
    updateScreen('home');
    restoreState();
}

function updateScreen(screen) {
    removeLoadedScript();
    const screenPath = chrome.runtime.getURL(`./screens/${screen}.html`);
    fetch(screenPath)
        .then(response => response.text())
        .then(text => { 
            let script = document.createElement('script');
            script.type = 'module';
            script.src = `scripts/${screen}.js`;    
            document.head.appendChild(script);
            document.body.innerHTML = text;
            script.onload = () => { dispatch(`popup-${screen}`) };
        });
}

function removeLoadedScript() {
    document.getElementsByTagName('script')[1]?.remove();
}

function setFontSize(percent) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id="fontZoom";
    style.textContent = '';

    if(percent > 1) {
        document.getElementById('fontZoom')?.remove();
        let css = `* { font-size: ${ fontSize * percent }px !important; }`;
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    } else {
        document.getElementById('fontZoom')?.remove();
    }
}

function restoreState() {
    const cbId = 'fontZoom';
    const store = {};
    chrome.storage.sync.get(store[cbId]).then((result) => {
        if(result['fontZoom']) {
            const percent = result['fontZoom'].value;
            setFontSize(percent);
        } 
    });
}

function getComputedFontSize() {
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    const fontSize = computedStyle.fontSize;
    
    return parseFloat(fontSize);
}