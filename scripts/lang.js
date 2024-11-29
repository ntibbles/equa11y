export function revealLang(isChecked) {
    const langTags = document.querySelectorAll('[lang]');
    const langTextElement = document.createElement('div');
    langTextElement.className = 'equa11y-label';
    langTextElement.style.position = 'fixed';
    langTextElement.id = 'equa11y-lang';
    const clsList = ['equa11y-label', 'equa11y-lang'];

    (isChecked) ? langTag_checked() : langTag_unchecked();

    function langTag_checked() {
        for (let el of langTags) {
            let langAttr = el.getAttribute('lang');
            // show the html tag
            if(el.nodeName === 'HTML') {
                langTextElement.innerText = `lang="${langAttr}"`;
            } else {
                // show all other tags
                if(!el.querySelector('.equa11y-label')) {
                    let label = document.createElement('span');
                    label.classList.add(...clsList);
                    label.innerHTML = `lang="${langAttr}"`;
                    el.prepend(label);
                }   
            }
        }

        // if the list is missing HTML show message
        if(langTags[0].nodeName !== 'HTML') {
            langTextElement.innerText = 'No lang attribute on HTML tag.';
        }
         if(!document.getElementById('equa11y-lang')) document.body.prepend(langTextElement);
    }

    function langTag_unchecked() {
        document.getElementById('equa11y-lang').remove();
        const labels = document.getElementsByClassName('equa11y-lang');
        for(let element of labels) {
            element.remove();
        };
    }
}