/*
    Spec: No loss of content or functionality occurs when the user adapts paragraph spacing to 2 times the font size, 
    text line height/spacing to 1.5 times the font size, word spacing to .16 times the font size, 
    and letter spacing to .12 times the font size.
*/

export function toggleTextSpacing(isChecked) {
    const baseFontSize = getFontSize();
    const css = `* { line-height: 1.5 !important; word-spacing: ${baseFontSize * 0.16}px !important; letter-spacing: ${baseFontSize * 0.12}px !important; } p { margin-bottom: ${baseFontSize * 2}px !important; }`;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = 'text_spacing_css';

    isChecked ? textSpacing_checked() : textSpacing_unchecked();

    function textSpacing_checked() {
        if(!document.getElementById('text_spacing_css')) {
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }
    }

    function textSpacing_unchecked() {
        document.getElementById('text_spacing_css').remove();
    }

    function getFontSize() {
        const computedStyle = getComputedStyle(document.getElementsByTagName('html')[0]);
        const style = computedStyle['font-size'];
        
        return parseFloat(style);
    }
}