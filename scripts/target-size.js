export function toggleTargetSize(isChecked) {
    const interactiveRoles = ['button', 'a', 'checkbox', 'radio', 'slider', 'textbox', 'combobox', 'menuitem', 'option', '[role="button"]', '[role="link"]'];
    const clsList = ['equa11y-label', 'equa11y-size'];

    isChecked ?  targetSize_checked() : targetSize_unchecked();

    function targetSize_checked() {
        document.querySelectorAll(interactiveRoles.join(',')).forEach(element => {
            element.style.border = '2px solid blue';
            element.style.position = 'relative';

            const dimensions = getComputedDimensions(element);
            const label = document.createElement('div');
            label.innerHTML = `${dimensions.width} w x ${dimensions.height} h`;
            label.classList.add(...clsList);

            element.prepend(label);
        });
    }

    function targetSize_unchecked() {

    }

    function getComputedDimensions(element) {
        const computedStyle = getComputedStyle(element);
        const dimensions = {
            width: computedStyle.width,
            height: computedStyle.height
        }
        
        return dimensions;
    }
}