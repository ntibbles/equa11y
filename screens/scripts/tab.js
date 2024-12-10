import { getTabId } from "./utils/helpers.js";

export function tabController() {
    let index = 0;
    const btns = document.getElementsByTagName('button');
    const tabs = [ ...Array.from(document.querySelectorAll('.equa11y-tabs')) ];
    const panels = [ ...Array.from(document.querySelectorAll('.equa11y-tabpanel')) ];
    const totalTabs = tabs.length;

    restoreState();

    for (let btn of btns) {
        btn.addEventListener('click', handleClick);
        btn.addEventListener('keyup', handleKeyUp);
    };

    function handleClick(evt) {
        index = Number(evt.target.dataset.index);

        hidePanels();
        showPanel();
    }

    function handleKeyUp(evt) {
        let newIndex = index;

        if(evt.which === 39) {
            newIndex = (index < totalTabs - 1) ? index + 1 : 0;
        }

        if(evt.which === 37) {
            newIndex = (index > 0) ? index - 1: totalTabs - 1;
        }

        index = newIndex;

        hidePanels();
        showPanel();
    }

    function showPanel() {
        let curPanel = panels[index];
        let curTab = tabs[index];
        
        curTab.focus();
        curTab.setAttribute('aria-selected', 'true');
        curTab.setAttribute('tabindex', '0');

        curPanel.classList.add('visible');
        curPanel.setAttribute('aria-selected', 'true');

        setState(index);
    }
    
    function hidePanels() {
        tabs.map(el => {
            el.setAttribute('aria-selected', 'false');
            el.setAttribute('tabindex', '-1');
        });
        panels.map(el => {
            el.classList.remove('visible');
            el.setAttribute('aria-selected', 'false');
        });
    }

    async function setState(tabIndex) {
        const tabId = await getTabId();
        const store = {};
        chrome.storage.sync.get(store[tabId]).then(() => {
            const store = {};
            const index = tabIndex;
            store['tab'] = {index, tabId};
            chrome.storage.sync.set( store );
        })
    }

    async function restoreState() {
        const tabId = await getTabId();
        const store = {};
        chrome.storage.sync.get(store['tab']).then((result) => {
            if( result['tab'] && result['tab'].tabId === tabId){
                index = result['tab'].index;

                hidePanels();
                showPanel();
            }
        });
    }
}