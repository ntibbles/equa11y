export let isDarkMode = false;
export let showBetaUtils = true;

export function toggleBetaUtils(evt) {
    showBetaUtils = evt.target.checked;

    if(showBetaUtils) {
        document.body.classList.remove('hide-beta');
    } else {
        document.body.classList.add('hide-beta');
    }
}

export function toggleDarkMode(evt) {
    isDarkMode = evt.target.checked;

    if(isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}
