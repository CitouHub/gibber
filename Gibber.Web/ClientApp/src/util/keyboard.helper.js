export function isArrow(e) {
    return e.keyCode >= 37 && e.keyCode <= 40;
}

export function isEnter(e) {
    return e.keyCode === 13;
}

export function isBackspace(e) {
    return e.keyCode === 8;
}

export function isTab(e) {
    return e.keyCode === 9;
}

export function isNumber(e) {
    return e.keyCode >= 48 && e.keyCode <= 57;
}