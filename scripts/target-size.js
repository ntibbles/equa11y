export function toggleTargetSize(isChecked) {
    const interactiveRoles = ['button', 'a', '[type="checkbox"]', '[type="radio"]', '[type="slider"]', 'textbox', 'option', '[role="button"]', '[role="link"]'];
    const roleList =  document.querySelectorAll(interactiveRoles.join(','));
    const clsList = ['equa11y-label'];
    const elList = ['equa11y-border', 'equa11y-size'];

    isChecked ?  targetSize_checked() : targetSize_unchecked();

    function targetSize_checked() {
       roleList.forEach(element => {
            if(!element.classList.contains('equa11y-size')) {
                const dimensions = getComputedDimensions(element);
                // if dimensions are 0 don't add a label
                if(dimensions.height > 0 || dimensions.width > 0) {
                    const label = document.createElement('div');
                    label.innerHTML = `${dimensions.width}px w x ${dimensions.height}px h`;
                    label.classList.add(...clsList);

                    if(dimensions.width < 24 || dimensions.height < 24) {
                        label.style.cssText = 'background-color: #AB1B18 !important;  outline: 2px dashed black;';
                    }

                    element.classList.add(...elList);
                    element.parentNode.insertBefore(label, element);
                }
            }
        });
    }

    function targetSize_unchecked() {
        document.querySelectorAll('.equa11y-size').forEach(el => {
            el.classList.remove(...elList);
        });

        document.querySelectorAll('.equa11y-label').forEach(el => {
            el.remove();
        });
    }

    function getComputedDimensions(element) {
        const dimensions = {
            width: element.offsetWidth,
            height: element.offsetHeight
        }
        
        return dimensions;
    }
}