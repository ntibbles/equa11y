(function sidebar() {
    const body = document.body;
    const config = { attributes: true, childList: true, subtree: true };
    let sidebarContainer = {};
    let sidebarContent = {};
    let closeBtn = {};
    let isInit = false;
   
    function initListeners() {
        console.log('init');
        document.addEventListener('open-sidebar', open);
        document.addEventListener('close-sidebar', close);
        closeBtn.addEventListener('click', close);
    }

    // const loaded = (mutationList, observer) => {
    //     //console.log('loaded: ', mutationList);
    //     sidebarContainer = document.getElementById("equa11y-sidebar");
    //     console.log('loaded: ', sidebarContainer);
    //     closeBtn = document.getElementById('sidebar-close');
    //     initListeners();
    // }

    // const observer = new MutationObserver(loaded);
    // observer.observe(body, config);

    // function generateSidebar() {
    //     sidebarContainer = document.createElement('div');
    //     sidebarContainer.id = "equa11y-sidebar";
    //     sidebarContainer.classList.add('equa11y-sidebar');
    //     head.after(sidebarContainer);
    //     body.style.position = 'relative';
    // }

    // function generateClose() {
    //     closeBtn = document.createElement('button');
    //     closeBtn.classList.add('sidebar-close');
    //     closeBtn.textContent = 'X';
    //     closeBtn.setAttribute('aria-label', 'close');
    //     closeBtn.addEventListener('click', close);
    //     sidebarContainer.prepend(closeBtn);
    // }

    function insertHeading(heading) {
        sidebarHeader.textContent = heading;
        sidebarContainer.appendChild(sidebarHeader);
    }

    function insertContent(content) {
        sidebarContent.classList.add('equa11y-sidebar_content');
        content.forEach(element => {
            sidebarContent.appendChild(element);
        });
        sidebarContainer.appendChild(sidebarContent);
    }

    function open(evt) {
        if(!isInit) {
            const { title, content } = evt.detail;
            isInit = true;

            insertHeading(title);
            insertContent(content);
        }
        sidebarContainer.classList.add('open');
        body.setAttribute('style', 'margin-left: 325px !important');
    }

    function close() {
        sidebarContainer.classList.remove('open');
        body.removeAttribute('style');
    }

    fetch(chrome.runtime.getURL('screens/sidebar.html')).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforebegin', html);
        sidebarContainer = document.getElementById("equa11y-sidebar");
        sidebarContent = document.getElementById("equa11y-sidebar_content");
        sidebarHeader = document.getElementById("equa11y-sidebar_header");
        closeBtn = document.getElementById('sidebar-close');
        initListeners();
    });
})();
