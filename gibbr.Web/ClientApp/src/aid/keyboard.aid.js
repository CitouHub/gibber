import { board } from '../data/board.data';

let ctrlDown = false;
let altGrDown = false;

export function isArrow(e) {
    return e.keyCode >= 37 && e.keyCode <= 40;
}

export function isLeftArrow(e) {
    return e.keyCode === 37;
}

export function isUpArrow(e) {
    return e.keyCode === 38;
}

export function isRightArrow(e) {
    return e.keyCode === 39;
}

export function isDownArrow(e) {
    return e.keyCode === 40;
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

export function isDash(e) {
    return e.key === '-';
}

export function isCtrl(e) {
    return e.keyCode === 17 && !altGrDown;
}

export function isAltGr(e) {
    return e.keyCode === 18;
}

export function isNumber(e) {
    return e.keyCode >= 48 && e.keyCode <= 57;
}

export function setCtrlDown(down) {
    ctrlDown = down;
}

export function isCtrlDown() {
    return ctrlDown && !altGrDown;
}

export function setAltGrDown(down) {
    altGrDown = down;
}

export function isAltGrDown() {
    return altGrDown;
}

export function getNewLine(x, y) {
    let emptyPositionFound = false;
    for (let i = x; i >= 0; i--) {
        var cell = board.cells.find(_ => _.vx === i && _.vy === y);
        if (!cell || cell.l === '') {
            if (emptyPositionFound === false) {
                emptyPositionFound = true;
            } else {
                return i + 1;
            }
        }
    }

    return x;
}