import { dispatch } from "./utils/events.js";

document.addEventListener('popup-settings', init);

function init() {
    console.log('settings init');
    resetCheckboxes();
    setEventListeners();
}

function getTabId() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    })
}

function toggleBetaUtils(evt) {
    let showBetaUtils = evt.target.checked;

    getTabId().then(id => {
        setState(id, evt, evt.target.id);
    });

    if(showBetaUtils) {
        document.body.classList.add('hide-beta');
    } else {
        document.body.classList.remove('hide-beta');
    }
}

function toggleDarkMode(evt) {
    let isDarkMode = evt.target.checked;

    getTabId().then(id => {
        setState(id, evt, evt.target.id);
    });

    if(isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
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
    const cbId = checkbox.id;
    const store = {};
    chrome.storage.sync.get(store[cbId]).then((result) => {
        console.log('restore: ', result);
        if( result[cbId] && result[cbId].tabId === tabId ){
            checkbox.checked = result[cbId].isChecked;
        }
    });
}

function resetCheckboxes() {
    let allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    getTabId().then(id => {
        for (const cb of allCheckboxes) {
            restoreState(id, cb);
        }
    });
}

function setEventListeners() {
    document.getElementById('back')?.addEventListener('click', () => dispatch('popup-load-screen', 'home'));
    document.getElementById('showBeta')?.addEventListener('click', toggleBetaUtils);
    document.getElementById('darkMode')?.addEventListener('click', toggleDarkMode);
}
