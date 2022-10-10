import { render } from '../settings/render.settings';
import { board, position } from '../data/board.data';

function getFont() {
    return `${board.zoom * render.fontFactor}px Consolas`;
}

function renderCell(ctx, letter, x, y) {
    ctx.fillText(letter, x * (board.zoom * render.widthFactor), (y * board.zoom) + board.zoom * 0.75);
}

function clearBoardCell(ctx, x, y) {
    ctx.clearRect(
        x * (board.zoom * render.widthFactor),
        y * board.zoom - 1,
        board.zoom * render.widthFactor,
        board.zoom + 1);
}

export function updateBoard() {
    var changedCells = board.cells.filter(_ => _.r === false);

    if (changedCells.length > 0) {
        var ctx = board.canvas.current.getContext("2d");
        ctx.font = getFont(board.zoom);
        changedCells.forEach(_ => {
            clearBoardCell(ctx, _.vx, _.vy);
            renderCell(ctx, _.l, _.vx, _.vy)
            //ctx.beginPath();
            //ctx.rect(_.vx * (zoomLevel * render.widthFactor), (_.vy * zoomLevel), zoomLevel * render.widthFactor, zoomLevel);
            //ctx.stroke();
            _.r = true;
        });
    }
}

export function resetCell(x, y) {
    var ctx = board.canvas.current.getContext("2d");
    clearBoardCell(ctx, x, y);
    var cell = board.cells.find(_ => _.vx === x && _.vy === y);
    if (cell) {
        ctx.font = getFont();
        renderCell(ctx, cell.l, cell.vx, cell.vy);
    }
}

export function clearBoard() {
    var ctx = board.canvas.current.getContext("2d");
    ctx.clearRect(0, 0, board.canvas.current.width, board.canvas.current.height);
}

export function toggleCaret() {
    if (board.canvas.current) {
        if (position.caret.lit === true) {
            resetCell(position.caret.x, position.caret.y);
        } else {
            renderCaret(position.caret.x, position.caret.y);
        }

        position.caret.lit = !position.caret.lit;
    }
}

export function renderCaret(x, y) {
    let ctx = board.canvas.current.getContext("2d");
    let startX = x * (board.zoom * render.widthFactor)
    let startY = y * board.zoom

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX + 1, startY);
    ctx.lineTo(startX + 1, startY + board.zoom); 
    ctx.closePath();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}