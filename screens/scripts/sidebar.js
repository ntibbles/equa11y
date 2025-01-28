(function sidebar() {
    const body = document.body;
    let sidebarContainer = {};
    let sidebarContent = {};
    let closeBtn = {};
    let isInit = false;
   
    function initListeners() {
        document.addEventListener('open-sidebar', open);
        document.addEventListener('close-sidebar', close);
        document.addEventListener('update-sidebar', insertContent);
        closeBtn.addEventListener('click', close);
    }

    function insertHeading(heading) {
        sidebarHeader.textContent = heading;
        sidebarContainer.appendChild(sidebarHeader);
    }

    function insertContent(evt) {
        const { content } = evt.detail;
        sidebarContent.innerHTML = '';
        content.forEach(element => {
            sidebarContent.appendChild(element);
        });
        sidebarContainer.appendChild(sidebarContent);
    }

    function open(evt) {
        const { title } = evt.detail;
        if(!isInit) {
            isInit = true;
            insertHeading(title);
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
