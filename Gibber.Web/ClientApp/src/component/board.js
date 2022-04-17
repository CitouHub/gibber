import React, { useEffect, useRef, useCallback } from 'react';
import { Caret } from './caret'
import { useInterval } from '../util/use.interval';
import { renderSettings } from '../setting/setting.render';
import { saveSettings } from '../setting/setting.save';

let board = [];
let saveBuffer = [];
let saveTimer = {};
let position = { x: 0, y: 0 };

const Board = ({ columns, rows, zoomLevel, visibleBoard, saveChanges }) => {
    const canvasRef = useRef();

    let caretLit = false;

    const updateBoard = () => {
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
    };

    const clearBoardCell = (x, y) => {
        var ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(
            x * (zoomLevel * renderSettings.widthFactor),
            y * zoomLevel - 1,
            zoomLevel * renderSettings.widthFactor,
            zoomLevel + 1);
    }

    const clearBoard = () => {
        var ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0,
            columns * zoomLevel * renderSettings.widthFactor,
            rows * renderSettings.zoomLevel);
    }

    const updateBoardCell = (x, y, newValue) => {
        board.forEach(_ => {
            if (_.vx === x && _.vy === y) {
                _.l = newValue ?? _.l;
                _.r = false;
            }
            return _;
        });

        updateBoard();
    }

    const flushSaveBuffer = () => {
        saveChanges(saveBuffer);
        saveBuffer = [];
    }

    const selectPosition = (e) => {
        var x = Math.floor(e.clientX / (zoomLevel * renderSettings.widthFactor));
        var y = Math.floor(e.clientY / zoomLevel);
        updatePosition(x, y);
    }

    const updatePosition = (x, y) => {
        updateBoardCell(position.x, position.y);
        position.x = x;
        position.y = y;
        renderCaret(position.x, position.y);
    }

    const renderCaret = (x, y) => {
        var ctx = canvasRef.current.getContext("2d");
        Caret(ctx, x * (zoomLevel * renderSettings.widthFactor), y * zoomLevel, zoomLevel);
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

    const handleKeyDown = useCallback(e => {
        if (e.keyCode === 37) { //Left arrow
            updatePosition(position.x - 1, position.y);
        } else if (e.keyCode === 38) { //Up arrow
            updatePosition(position.x, position.y - 1);
        } else if (e.keyCode === 39) { //Right arrow
            updatePosition(position.x + 1, position.y);
        } else if (e.keyCode === 40) { //Down arrow
            updatePosition(position.x, position.y + 1);
        } else if (e.keyCode === 8) { //Backspace
            updateBoardCell(position.x - 1, position.y, '');
            updatePosition(position.x - 1, position.y);
        } else if (e.keyCode === 13) { //Enter
            var newLineX = getNewLinePosition(position.x, position.y);
            updatePosition(newLineX, position.y + 1);
        } else if (e.key.length === 1) {
            updateBoardCell(position.x, position.y, e.key);
            addBoardCellToSaveBuffer(position.x, position.y);
            updatePosition(position.x + 1, position.y);
        }
    }, [board]);

    const addBoardCellToSaveBuffer = (x, y) => {
        var boardCell = board.find(_ => _.vx === x && _.vy === y);
        saveBuffer.push(boardCell);
        clearTimeout(saveTimer);
        if (saveBuffer.length >= saveSettings.saveBufferMaxSize) {
            flushSaveBuffer();
        } else {
            saveTimer = setTimeout(() => flushSaveBuffer(), saveSettings.saveTimeTrigger)
        }
    }

    const getBoardCell = (index) => {
        let visibleX = index % columns;
        let visibleY = Math.floor(index / columns);
        let visibleBoardCell = visibleBoard.find(_ => _.vx === visibleX && _.vy === visibleY);
        return {
            vx: visibleX,
            vy: visibleY,
            l: visibleBoardCell?.l ?? '',
            r: visibleBoardCell?.l !== undefined ? false : true
        }
    }

    useEffect(() => {
        board = Array.from({ length: columns * rows }, (_, i) => (getBoardCell(i)));
        position = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) };
        clearBoard();
        updateBoard();
    }, [visibleBoard]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const blinkCaret = () => {
        if (canvasRef.current) {
            if (caretLit === true) {
                updateBoardCell(position.x, position.y);
            } else {
                renderCaret(position.x, position.y);
            }

            caretLit = !caretLit;
        }
    }

    useInterval(blinkCaret, 300);

    return (
        <canvas ref={canvasRef} width={columns * zoomLevel * renderSettings.widthFactor} height={rows * zoomLevel} onClick={selectPosition} />
    );
}

export default Board;