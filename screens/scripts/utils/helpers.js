export function dispatch(type, data = null) {
    const evt = new CustomEvent(type, { detail: data });
    document.dispatchEvent(evt);
}

export function getTabId() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    })
}
