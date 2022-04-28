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

export function isHome(e) {
    return e.keyCode === 36;
}

export function isEnd(e) {
    return e.keyCode === 35;
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
    ctrlDown = false;
}

export function isAltGrDown() {
    return altGrDown;
}

export function getStartOfLine(x, y) {
    for (let i = x; i >= 0; i--) {
        var cell1 = board.cells.find(_ => _.vx === i - 1 && _.vy === y);
        var cell2 = board.cells.find(_ => _.vx === i - 2 && _.vy === y);
        if ((!cell1 || cell1.l === '') && (!cell2 || cell2.l === '')) {
            return i;
        }
    }

    return x;
}

export function getEndOfLine(x, y, columns) {
    for (let i = x; i <= columns; i++) {
        var cell1 = board.cells.find(_ => _.vx === i && _.vy === y);
        var cell2 = board.cells.find(_ => _.vx === i + 1 && _.vy === y);
        var cell3 = board.cells.find(_ => _.vx === i + 2 && _.vy === y);
        if ((!cell2 || cell2.l === '') && (!cell3 || cell3.l === '')) {
            if (!cell1 || cell1.l === '') {
                return i;
            } else {
                return i + 1;
            }
        }    
    }

    return columns - 1;
}