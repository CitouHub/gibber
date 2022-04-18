import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowSize } from '../util/use.windowsize';
import { renderSettings } from '../setting/setting.render';
import Board from '../component/board';

import * as BoardService from '../service/board.service';

let mouseDown = false;
let mouseDownX = 0;
let mouseDownY = 0;
let mouseMoveDx = 0;
let mouseMoveDy = 0;
let centerX = 0;
let centerY = 0;

const Home = () => {
    const [dimension, setDimension] = useState({ columns: 0, rows: 0 });
    const [boardFrame, setBoardFrame] = useState({ cx: -1, cy: -1, x: 0, y: 0, dx: 0, dy: 0, ox: 0, oy: 0 });
    const [board, setBoard] = useState([]);

    const content = useRef();
    const windowSize = useWindowSize();

    document.title = `gibber ${centerX} : ${centerY}`;

    const updateBoardFrame = useCallback(() => {
        if (content.current) {
            let columns = Math.floor(content.current.offsetWidth / (renderSettings.zoomLevel * renderSettings.widthFactor));
            let rows = Math.floor(content.current.offsetHeight / renderSettings.zoomLevel);

            if (columns !== dimension.columns || rows !== dimension.rows) {
                setDimension({
                    columns: columns,
                    rows: rows
                });
            }

            setBoardFrame({
                cx: centerX,
                cy: centerY,
                ox: centerX - Math.round((columns * 3) / 2),
                oy: centerY - Math.round((rows * 3) / 2),
                ix: centerX - Math.round(columns / 2),
                iy: centerY - Math.round(rows / 2),
                dx: columns * 3,
                dy: rows * 3
            });
        }
    }, [dimension.columns, dimension.rows])

    const getVisibleBoard = () => {
        let visibleBoard = board.filter(_ =>
            _.x >= boardFrame.ix && _.x <= boardFrame.ix + dimension.columns &&
            _.y >= boardFrame.iy && _.y <= boardFrame.iy + dimension.rows);
        visibleBoard.forEach(_ => {
            _.vx = _.x - boardFrame.ix;
            _.vy = _.y - boardFrame.iy;
        });
        return visibleBoard;
    }

    const saveChanges = (boardCells) => {
        boardCells.forEach(_ => {
            _.x = _.vx + boardFrame.ix;
            _.y = _.vy + boardFrame.iy;
            let boardCell = board.find(cell => cell.x === _.x && cell.y === _.y);
            if (boardCell !== undefined) {
                boardCell.l = _.l;
            } else {
                board.push(_);
            }
        });
        BoardService.saveBoardCells(boardCells);
    }

    useEffect(() => {
        updateBoardFrame();
    }, [windowSize, updateBoardFrame]);

    useEffect(() => {
        if (boardFrame.dx > 0 && boardFrame.dy > 0 && mouseDown === false) {
            BoardService.getBoardCells(boardFrame.ox, boardFrame.oy, boardFrame.dx, boardFrame.dy).then((result) => {
                result.forEach(_ => _.r = false);
                setBoard(result);
            });
        }
    }, [boardFrame]);

    const handleZoom = useCallback((e) => {
        if (e.deltaY > 0) { // Zoom out
            if (renderSettings.zoomLevel > renderSettings.minZoomLevel) {
                renderSettings.zoomLevel = renderSettings.zoomLevel - renderSettings.deltaZoomLevel;
                updateBoardFrame();
            }
        }
        else if (e.deltaY < 0) { // Zoom out
            if (renderSettings.zoomLevel < renderSettings.maxZoomLevel) {
                renderSettings.zoomLevel = renderSettings.zoomLevel + renderSettings.deltaZoomLevel;
                updateBoardFrame();
            }
        }
    }, [updateBoardFrame]);

    const handleMouseDown = useCallback((e) => {
        mouseDown = true;
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        content.current.className = 'canvas-mouse-grab';
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (mouseDown === true) {
            mouseMoveDx = Math.round((mouseDownX - e.clientX) / renderSettings.zoomLevel);
            mouseMoveDy = Math.round((mouseDownY - e.clientY) / renderSettings.zoomLevel);
            if (mouseMoveDx !== 0 || mouseMoveDy !== 0) {
                centerX = centerX + mouseMoveDx;
                centerY = centerY + mouseMoveDy;
                mouseMoveDx = 0;
                mouseMoveDy = 0;
                mouseDownX = e.clientX;
                mouseDownY = e.clientY;
                updateBoardFrame();
            }
        }
    }, [updateBoardFrame]);

    const handleMouseUp = useCallback(() => {
        mouseDown = false;
        content.current.className = 'canvas-mouse-normal';
    }, []);

    useEffect(() => {
        window.addEventListener("wheel", handleZoom);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("wheel", handleZoom);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleZoom, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div className='full-size' ref={content}>
            {board && board.length >= 0 && <Board
                columns={dimension.columns}
                rows={dimension.rows}
                zoomLevel={renderSettings.zoomLevel}
                boardFrame={boardFrame}
                visibleBoard={getVisibleBoard()}
                saveChanges={saveChanges}
            />}
        </div>
    );
}

export default Home;
