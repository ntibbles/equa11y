import { toggleAltTextDisplay } from "./scripts/alt-text.js";
import { revealViewportTag } from "./scripts/viewport.js";
import { toggleLandmarkOutlines } from "./scripts/landmarks.js";
import { toggleHeadingOutline } from "./scripts/headings.js";
import { toggleInteractiveRoles } from "./scripts/roles.js";
import { toggleZoom } from "./scripts/text-zoom.js";
import { processImages } from "./scripts/text-detection.js"
import { highlightNonInteractiveElements } from './scripts/event-listeners.js';

document.addEventListener('DOMContentLoaded', () => {
    // grab all checkbox inputs
    let allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    for (const cb of allCheckboxes) {
        let func = getFunction(cb.dataset.func);
        if(func === 'serviceWorker') {
            document.getElementById(cb.id).addEventListener('change', (event) => {
                chrome.runtime.sendMessage({target: 'sw', type: 'event-listeners', isChecked: event.target.checked },  () => {
                    if(!event.target.checked) {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                function: (function() {
                                    document.location.reload();
                                })
                            });
                        });
                    }
                });
            });
        } else {
            // set the handlers
            document.getElementById(cb.id).addEventListener('change', (event) => {
                setEventHandlers(event, cb.id, func);
            });
        }

        // Restore checkbox state
        chrome.storage.sync.get(cb.id).then((result) => {
            cb.checked = result[cb.id] || false;
            if(cb.checked) {
                loadScript(func, cb.checked);
            }
        });
    }
});

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

function setEventHandlers(event, id, func) {
    const store = {};
    const isChecked = event.target.checked;
    store[id] = isChecked;

    chrome.storage.sync.set( store );
    loadScript(func, isChecked);
}

function loadScript(func, isChecked) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: func,
            args: [isChecked]
        });
    });
} 