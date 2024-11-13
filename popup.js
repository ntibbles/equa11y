import { toggleAltTextDisplay } from "./scripts/alt-text.js";
import { revealViewportTag } from "./scripts/viewport.js";
import { toggleLandmarkOutlines } from "./scripts/landmarks.js";
import { toggleHeadingOutline } from "./scripts/headings.js";
import { toggleInteractiveRoles } from "./scripts/roles.js";
import { toggleZoom } from "./scripts/text-zoom.js";
import { processImages } from "./scripts/text-detection.js"
import { highlightNonInteractiveElements } from './scripts/event-listeners.js';

document.addEventListener('DOMContentLoaded', setEventListeners);

function getTabId() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    })
}

// explicitly converts function string name on data-func to a function
function getFunction(name) {
    switch(name) {
        case 'toggleAltTextDisplay': return toggleAltTextDisplay;
        case 'revealViewportTag': return revealViewportTag;
        case 'toggleLandmarkOutlines': return toggleLandmarkOutlines;
        case 'toggleHeadingOutline': return toggleHeadingOutline;
        case 'toggleInteractiveRoles': return toggleInteractiveRoles;
        case 'toggleZoom': return toggleZoom;
        case 'processImages': return processImages;
        case 'highlightNonInteractiveElements': return highlightNonInteractiveElements;
        default: return 'serviceWorker'
    }
}

function setEventHandlers(tabId, event, id, func) {
    const store = {};
    const isChecked = event.target.checked;
    store[tabId] = {id, isChecked};
    chrome.storage.sync.set( store );
    loadScript(func, isChecked);
}

async function loadScript(func, isChecked) {
    const id = await getTabId();
    chrome.scripting.executeScript({
        target: { tabId: id },
        function: func,
        args: [isChecked]
    });
} 

async function sendSWMessage(event) {
    const id = await getTabId();
    chrome.runtime.sendMessage({target: 'sw', type: 'event-listeners', isChecked: event.target.checked },  () => {
        if(!event.target.checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: id },
                    function: (function() {
                        document.location.reload();
                    })
                });
            });
        }
    });
}

async function setEventListeners() {
    const id = await getTabId();
    // grab all checkbox inputs
    let allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    for (const cb of allCheckboxes) {
        let func = getFunction(cb.dataset.func);
        restoreState(id, cb);
        if(func === 'serviceWorker') {
            document.getElementById(cb.id).addEventListener('change', (event) => {
                sendSWMessage(event);
            });
        } else {
            // set the handlers
            document.getElementById(cb.id).addEventListener('change', (event) => {
                setEventHandlers(id, event, cb.id, func);
            });
        }
    }
}

function restoreState(tabId, checkbox) {
    // Restore checkbox state
    const store = {};
    chrome.storage.sync.get(store[tabId]).then((result) => {
        if(checkbox.id === result[tabId].id){
            checkbox.checked = result[tabId].isChecked;
            if(checkbox.checked) {
                loadScript(func, checkbox.checked);
            }
        }
    });
}