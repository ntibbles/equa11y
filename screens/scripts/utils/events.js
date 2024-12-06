export function dispatch(type, data = null) {
    const evt = new CustomEvent(type, { detail: data });
    document.dispatchEvent(evt);
}
