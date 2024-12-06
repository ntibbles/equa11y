import { dispatch } from "./utils/events.js";

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('popup-load-screen', evt => updateScreen(evt.detail));

function init() {
    updateScreen('home');
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