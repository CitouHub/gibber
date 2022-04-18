import React, { useEffect, useRef, useCallback } from 'react';
import { Caret } from './caret'
import { useInterval } from '../util/use.interval';
import { renderSettings } from '../setting/setting.render';
import { saveSettings } from '../setting/setting.save';

let board = [];
let saveBuffer = [];
let saveTimer = {};
let caret = { x: 0, y: 0, lit: false };

const Board = ({ columns, rows, zoomLevel, boardFrame, visibleBoard, saveChanges }) => {
    const canvasRef = useRef();

    caret = {
        x: Math.round(columns / 2),
        y: Math.round(rows / 2),
        lit: false
    };

    const clearBoardCell = useCallback((x, y) => {
        var ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(
            x * (zoomLevel * renderSettings.widthFactor),
            y * zoomLevel - 1,
            zoomLevel * renderSettings.widthFactor,
            zoomLevel + 1);
    }, [zoomLevel])

    const updateBoard = useCallback(() => {
        var changedCells = board.filter(_ => _.r === false);

        if (changedCells.length > 0) {
            var ctx = canvasRef.current.getContext("2d");
            changedCells.forEach(_ => {
                clearBoardCell(_.vx, _.vy);
                ctx.font = `${zoomLevel * renderSettings.fontFactor}px Consolas`;
                ctx.fillText(_.l, _.vx * (zoomLevel * renderSettings.widthFactor), (_.vy * zoomLevel) + zoomLevel * 0.75);
                //ctx.beginPath();
                //ctx.rect(_.x * (zoomLevel * renderSettings.widthFactor), (_.y * zoomLevel), zoomLevel * renderSettings.widthFactor, zoomLevel);
                //ctx.stroke();
                _.r = true;
            });
        }
    }, [zoomLevel, clearBoardCell])

    const clearBoard = useCallback(() => {
        var ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0,
            columns * zoomLevel * renderSettings.widthFactor,
            rows * renderSettings.zoomLevel);
    }, [columns, rows, zoomLevel])

    const updateBoardCell = useCallback((x, y, newValue) => {
        board.forEach(_ => {
            if (_.vx === x && _.vy === y) {
                _.l = newValue ?? _.l;
                _.r = false;
            }
            return _;
        });

        updateBoard();
    }, [updateBoard]);

    const flushSaveBuffer = useCallback(() => {
        saveChanges(saveBuffer);
        saveBuffer = [];
    }, [saveChanges])

    const selectPosition = (e) => {
        var x = Math.floor(e.clientX / (zoomLevel * renderSettings.widthFactor));
        var y = Math.floor(e.clientY / zoomLevel);
        updatePosition(x, y);
    }

    const renderCaret = useCallback((x, y) => {
        var ctx = canvasRef.current.getContext("2d");
        Caret(ctx, x * (zoomLevel * renderSettings.widthFactor), y * zoomLevel, zoomLevel);
    }, [zoomLevel])

    const updatePosition = useCallback((x, y) => {
        updateBoardCell(caret.x, caret.y);
        caret.x = x;
        caret.y = y;
        document.title = `gibber ${caret.x + boardFrame.ix} : ${caret.y + boardFrame.iy}`;
        renderCaret(caret.x, caret.y);
    }, [updateBoardCell, boardFrame, renderCaret])

    const blinkCaret = () => {
        if (canvasRef.current) {
            if (caret.lit === true) {
                updateBoardCell(caret.x, caret.y);
            } else {
                renderCaret(caret.x, caret.y);
            }

            caret.lit = !caret.lit;
        }
    }

    const getNewLinePosition = (x, y) => {
        let emptyPositionFound = false;
        for (let i = x; i >= 0; i--) {
            var cell = board.find(_ => _.vx === i && _.vy === y);
            if (cell.l === '') {
                if (emptyPositionFound === false) {
                    emptyPositionFound = true;
                } else {
                    return i + 1;
                }
            }
        }
    }

    const addBoardCellToSaveBuffer = useCallback((x, y) => {
        var boardCell = board.find(_ => _.vx === x && _.vy === y);
        saveBuffer.push(boardCell);
        clearTimeout(saveTimer);
        if (saveBuffer.length >= saveSettings.saveBufferMaxSize) {
            flushSaveBuffer();
        } else {
            saveTimer = setTimeout(() => flushSaveBuffer(), saveSettings.saveTimeTrigger)
        }
    }, [flushSaveBuffer])

    const getBoardCell = useCallback((index) => {
        let visibleX = index % columns;
        let visibleY = Math.floor(index / columns);
        let visibleBoardCell = visibleBoard.find(_ => _.vx === visibleX && _.vy === visibleY);
        return {
            vx: visibleX,
            vy: visibleY,
            l: visibleBoardCell?.l ?? '',
            r: visibleBoardCell?.l !== undefined ? false : true
        }
    }, [columns, visibleBoard])

    const handleKeyDown = useCallback(e => {
        if (e.keyCode === 37) { //Left arrow
            updatePosition(caret.x - 1, caret.y);
        } else if (e.keyCode === 38) { //Up arrow
            updatePosition(caret.x, caret.y - 1);
        } else if (e.keyCode === 39) { //Right arrow
            updatePosition(caret.x + 1, caret.y);
        } else if (e.keyCode === 40) { //Down arrow
            updatePosition(caret.x, caret.y + 1);
        } else if (e.keyCode === 8) { //Backspace
            updateBoardCell(caret.x - 1, caret.y, '');
            updatePosition(caret.x - 1, caret.y);
        } else if (e.keyCode === 13) { //Enter
            var newLineX = getNewLinePosition(caret.x, caret.y);
            updatePosition(newLineX, caret.y + 1);
        } else if (e.key.length === 1) {
            updateBoardCell(caret.x, caret.y, e.key);
            addBoardCellToSaveBuffer(caret.x, caret.y);
            updatePosition(caret.x + 1, caret.y);
        }
    }, [addBoardCellToSaveBuffer, updateBoardCell, updatePosition]);

    useEffect(() => {
        board = Array.from({ length: columns * rows }, (_, i) => (getBoardCell(i)));
        clearBoard();
        updateBoard();
    }, [columns, rows, getBoardCell, clearBoard, updateBoard]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    useInterval(blinkCaret, 300);

    return (
        <canvas ref={canvasRef} width={columns * zoomLevel * renderSettings.widthFactor} height={rows * zoomLevel} onClick={selectPosition} />
    );
}

export default Board;