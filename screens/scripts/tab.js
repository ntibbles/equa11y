export function tabController() {
    let index = 0;
    const btns = document.getElementsByTagName('button');
    const tabs = [ ...Array.from(document.querySelectorAll('.equa11y-tabs')) ];
    const panels = [ ...Array.from(document.querySelectorAll('.equa11y-tabpanel')) ];
    const totalTabs = tabs.length;

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
        curPanel.setAttribute('tabindex', '0');
    }
    
    function hidePanels() {
        tabs.map(el => {
            el.setAttribute('aria-selected', 'false');
            el.setAttribute('tabindex', '-1');
        });
        panels.map(el => {
            el.classList.remove('visible');
            el.setAttribute('aria-selected', 'false');
            el.setAttribute('tabindex', '-1');
        });
    }
}