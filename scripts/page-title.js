export function togglePageTitle(isChecked) {
    const titleTag = document.getElementsByTagName('title')[0];
    const titleTextElement = document.createElement('div');
    
    isChecked ? revealPageTitle_checked() : revealPageTitle_unchecked();

    function revealPageTitle_checked() {
        if(!document.getElementById('equa11y-page-label')) {
            const titleText = titleTag?.textContent;
            titleTextElement.innerText = titleText || "No title tag";
            titleTextElement.className = 'equa11y-label';
            titleTextElement.style.position = 'fixed';
            titleTextElement.id = 'equa11y-page-label';
            document.body.prepend(titleTextElement);
        }
    }

    function revealPageTitle_unchecked() {
        document.getElementById('equa11y-page-label')?.remove();
    }
}