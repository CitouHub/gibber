export function Caret(ctx, x, y, height) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 1, y);
    ctx.lineTo(x + 1, y + height);
    ctx.closePath();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}