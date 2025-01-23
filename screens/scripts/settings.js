import { dispatch } from "./utils/helpers.js";
let fontSize = 1;

document.addEventListener('popup-settings', init);

function init() {
    getWordList();
    resetCheckboxes();
    resetDarkMode();
    setEventListeners();
    handleFontSize();
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
        setState(id, evt, evt?.target.id);
    });

    if(showBetaUtils) {
        document.body.classList.add('hide-beta');
    } else {
        document.body.classList.remove('hide-beta');
    }
}

function changeDarkMode(evt) {
    switch (evt.target.value) {
        case 'true': 
            document.body.classList.add('dark-mode');
            break;
        case 'false':
            document.body.classList.remove('dark-mode');
            break;
        default:
            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
    }

    getTabId().then(id => {
        const store = {};
        const value = evt.target.value;
        const btn = evt.target.id;
        store['darkMode'] = { value, btn };
        chrome.storage.sync.set( store );
    });
}

function setState(tabId, event, id) {
    const store = {};
    chrome.storage.sync.get(store[tabId]).then(() => {
        const isChecked = event?.target.checked;
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
        el.focus();
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

function restoreState(tabId, checkbox) {
    const cbId = checkbox.id;
    const store = {};
    chrome.storage.sync.get(store[cbId]).then((result) => {
        if( result[cbId] && result[cbId].tabId === tabId ){
            checkbox.checked = result[cbId].isChecked;
        }
        if(result['fontZoom']) {
            const percent = result['fontZoom'].value;
            document.getElementById('fontSize').value = percent;
            document.getElementById("sizeValue").value = `${Math.round(percent * 100)}%`;
        } 
    });
}

function setStatus(status) {
    const msg =  document.getElementById('statusMsg');
    msg.innerText = status.msg;
    msg.classList.add(status.type);
}

function handleFontSize() {
    const input = document.getElementById("fontSize");
    const value = document.getElementById("sizeValue");
    const store = {};
    fontSize = getComputedFontSize();

    input.addEventListener("input", (event) => {
        let percent = event.target.value;
        document.dispatchEvent(new CustomEvent('popup-font-size', { detail: percent }));
        value.textContent = `${Math.round(percent * 100)}%`;
        store['fontZoom'] = { value: input.value };
        chrome.storage.sync.set( store );
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

function resetDarkMode() {
    const store = {};
    getTabId().then(id => {
        chrome.storage.sync.get(store[id]).then((result) => {
            if(result['darkMode']) document.getElementById(result['darkMode'].btn).checked = true;
        });
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

    const darkMode = document.querySelectorAll('input[type="radio"]');
    for(let btn of darkMode) {
        btn.addEventListener('change', changeDarkMode);
    }
}

function getComputedFontSize() {
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    const fontSize = computedStyle.fontSize;
    
    return parseFloat(fontSize);
}
