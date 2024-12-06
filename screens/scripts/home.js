import { toggleScreenReaderTextDisplay } from "../../scripts/screenreader-text.js";
import { toggleAltTextDisplay } from "../../scripts/alt-text.js";
import { revealViewportTag } from "../../scripts/viewport.js";
import { toggleLandmarkOutlines } from "../../scripts/landmarks.js";
import { toggleHeadingOutline } from "../../scripts/headings.js";
import { toggleInteractiveRoles } from "../../scripts/roles.js";
import { toggleZoom } from "../../scripts/text-zoom.js";
import { processImages } from "../../scripts/text-detection.js";
import { grayscale } from "../../scripts/grayscale.js";
import { exclusiveText } from "../../scripts/exclusive-text.js";
import { revealLang } from "../../scripts/lang.js";
import { toggleTargetSize } from "../../scripts/target-size.js";
import { tabController } from "./tab.js";
import { dispatch } from "./utils/events.js";

document.addEventListener('popup-home', init);

function init() {
    tabController();
    setEventListeners();
    checkCORS();
    checkSettings();
}

function getTabId() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    })
}

function checkSettings() {
    let store = {};
    getTabId().then(id => {
        chrome.storage.sync.get(store[id]).then((result) => {
            if(result['darkMode']?.isChecked) setDarkMode();
            if(result['showBeta']?.isChecked) setBetaUtils();
        });
    });
}

async function checkCORS() {
    const id = await getTabId();
    chrome.scripting.executeScript({
        target: { tabId: id },
        function: checkFirstImage
    }).then(result => {
        if (result[0].result.hasCors) {
            document.getElementById('displayEmbedded').setAttribute('disabled', true);
            document.getElementById('embeddedTextStatus').innerHTML = ' (<a href="about.html">Not Available</a>)';
        }
    });
}

function checkFirstImage() {
    return new Promise(resolve => {
        const images = document.getElementsByTagName('img');
        if (images.length > 0) {
            const firstImage = images[Math.round(images.length/2)];
            fetch(firstImage.src).then(resp => {
                if (resp.type === 'basic' && resp.url === window.location.origin+'/') {
                    resolve({ hasCors: true });
                } else {
                    resolve({ hasCors: false });
                }
            }).catch(() => {
                resolve({ hasCors: true });
            });
        }
    });
}

//insertCSS
async function injectCSS() {
    const id = await getTabId();
    chrome.scripting.insertCSS({
        target : {tabId : id},
        files : ['extension.css'],
    });
}

async function removeCSS() {
    const id = await getTabId();
    chrome.scripting.removeCSS({
        target : {tabId : id},
        files : ['extension.css'],
    });
}

// explicitly converts function string name on data-func to a function
function getFunction(name) {
    switch(name) {
        case 'toggleScreenReaderTextDisplay': return toggleScreenReaderTextDisplay;
        case 'toggleAltTextDisplay': return toggleAltTextDisplay;
        case 'revealViewportTag': return revealViewportTag;
        case 'toggleLandmarkOutlines': return toggleLandmarkOutlines;
        case 'toggleHeadingOutline': return toggleHeadingOutline;
        case 'toggleInteractiveRoles': return toggleInteractiveRoles;
        case 'toggleZoom': return toggleZoom;
        case 'processImages': return processImages;
        case 'grayscale' : return grayscale;
        case 'exclusiveText': return exclusiveText;
        case 'revealLang': return revealLang;
        case 'toggleTargetSize': return toggleTargetSize;
        case 'serviceWorker': return 'serviceWorker';
    }
}

function setDarkMode() {
    if(!document.body.classList.contains('dark-mode')) document.body.classList.add('dark-mode');
    document.getElementsByClassName('settings-icon')[0].setAttribute('src', './images/cog-white.svg');
    document.getElementsByClassName('logo')[0].setAttribute('src', './images/Equally_horizontal-white.svg');
}

function setBetaUtils() {
    if(!document.body.classList.contains('hide-beta')) document.body.classList.add('hide-beta');
}

function setState(tabId, event, id) {
    const store = {};
    chrome.storage.sync.get(store[tabId]).then(() => {
        const store = {};
        const isChecked = event.target.checked;
        store[id] = {isChecked, tabId};
        chrome.storage.sync.set( store );
    })
}

function restoreState(tabId, checkbox) {
    // Restore checkbox state
    const cbId = checkbox.id;
    const store = {};
    const func = getFunction(checkbox.dataset.func);
    chrome.storage.sync.get(store[cbId]).then((result) => {
        if( result[cbId] && result[cbId].tabId === tabId){
            checkbox.checked = result[cbId].isChecked;
            if(checkbox.checked && func !== "serviceWorker") {
                injectCSS();
                loadScript(func, checkbox.checked);
            }
        }
    });
}

async function loadScript(func, isChecked) {
    const list = await getUserList();
    const id = await getTabId();
    chrome.scripting.executeScript({
        target: { tabId: id },
        function: func,
        args: [isChecked, list]
    });
} 

async function sendSWMessage(event) {
    const id = await getTabId();
    await chrome.runtime.sendMessage({target: 'sw', type: 'event-listeners', isChecked: event.target.checked });
    
    if(!event.target.checked) {
        chrome.scripting.executeScript({
            target: { tabId: id },
            function: (function() {
                document.location.reload();
            })
        });
    }
}

async function setEventListeners() {
    const id = await getTabId();
    // grab all checkbox inputs
    let allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const cb of allCheckboxes) {
        let func = getFunction(cb.dataset.func);
        restoreState(id, cb);
        if (func === 'serviceWorker') {
            document.getElementById(cb.id).addEventListener('change', (event) => {
                setState(id, event, cb.id);
                sendSWMessage(event);
            });
        } else {
            // set the handlers
            document.getElementById(cb.id).addEventListener('change', (event) => {
                (cb.checked) ? injectCSS() : removeCSS();
                setState(id, event, cb.id);
                loadScript(func, cb.checked);
            });
        }
    }

    document.getElementById('settings')?.addEventListener('click', () => dispatch('popup-load-screen', 'settings'));
}

async function getUserList() {
    const tabId = await getTabId();
    const store = {};
    return new Promise(resolve => {
        chrome.storage.sync.get(store[tabId]).then((result) => {
            let pipeList = result['wordList']?.list.replaceAll(',', '|') || '';
            resolve(pipeList);
        });
    });
}