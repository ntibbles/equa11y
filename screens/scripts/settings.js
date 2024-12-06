import { dispatch } from "./utils/events.js";

document.addEventListener('popup-settings', init);

function init() {
    getWordList();
    resetCheckboxes();
    setEventListeners();
    document.getElementById('back').focus();
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
        const isChecked = event.target.checked;
        store[id] = {isChecked, tabId};
        chrome.storage.sync.set( store );
    })
}

function setWordList(evt) {
    evt.preventDefault();
    const el = document.getElementById('wordList');
    const list = el.value;
    const elId = el.id;
    const store = {};

    if(list.length === 0) {
        setStatus({msg: 'List cannot be empty.', type: 'error'});
        return;
    }

    getTabId().then(tabId => {
        chrome.storage.sync.get(store[tabId]).then(() => {
            store[elId] = {list, tabId};
            chrome.storage.sync.set( store );
            setStatus({msg: 'List updated successfully!', type: 'success'});
        });
    })
}

function setStatus(status) {
    const msg =  document.getElementById('statusMsg');
    msg.innerText = status.msg;
    msg.classList.add(status.type);
}

function restoreState(tabId, checkbox) {
    const cbId = checkbox.id;
    const store = {};
    chrome.storage.sync.get(store[cbId]).then((result) => {
        if( result[cbId] && result[cbId].tabId === tabId ){
            checkbox.checked = result[cbId].isChecked;
        }
    });
}

function getWordList() {
    const store = {};
    chrome.storage.sync.get(store['wordList']).then((result) => {
        (result['wordList']) ? document.getElementById('wordList').value = result['wordList'].list : "see,view,look,watch,peek,stare,glance,sight";
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

function resetWordList(evt) {
    evt.preventDefault();
    document.getElementById('wordList').value = "see,view,look,watch,peek,stare,glance,sight";
    setWordList(evt);
}

function setEventListeners() {
    document.getElementById('back').addEventListener('click', () => dispatch('popup-load-screen', 'home'));
    document.getElementById('updateBtn').addEventListener('click', setWordList);
    document.getElementById('resetBtn').addEventListener('click', resetWordList);
    document.getElementById('showBeta').addEventListener('click', toggleBetaUtils);
    document.getElementById('darkMode').addEventListener('click', toggleDarkMode);
}
