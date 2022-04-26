import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import GoToDialog from '../component/goto.dialog';
import { useWindowSize } from '../util/use.windowsize';
import { useInterval } from '../util/use.interval';

import * as BoardService from '../service/board.service';
import * as BoardValidation from '../validation/board.validation';
import * as Config from '../util/config';

import { toggleCaret, updateBoard, resetCell, renderCaret, clearBoard } from '../aid/canvas.aid';
import { isLeftArrow, isUpArrow, isRightArrow, isDownArrow, isCtrl, isEnter, isBackspace, getNewLine, setCtrlDown, isCtrlDown, setAltGrDown, isAltGrDown, isAltGr } from '../aid/keyboard.aid';

import { render } from '../settings/render.settings';
import { board, grid, drag, frame, position } from '../data/board.data';

let zoomTimer = {};

const BoardView = () => {
    const [update, triggerUpdate] = useState(false);
    const [goToOpen, setGoToOpen] = useState(false);

    const windowSize = useWindowSize();
    const content = useRef();
    board.canvas = useRef();

    let user = Config.getUser();
    position.x = position.x ?? user.x;
    position.y = position.y ?? user.y;

    useInterval(toggleCaret, 300);

    const connectBoardHub = useCallback(() => {
        if (board.hub.connection) {
            board.hub.connection.stop();
        }

        let user = Config.getUser();
        let hubUrl = `${Config.apiURL()}hubs/board?x=${frame.ox}&y=${frame.oy}&dx=${frame.dx}&dy=${frame.dy}&userId=${user.id}`;
        board.hub.connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        if (board.hub.connection) {
            board.hub.connection.start()
                .then(() => {
                    board.hub.connection.on('BoardUpdate', boardCell => {
                        updateBoardCell(boardCell.x - frame.ix, boardCell.y - frame.iy, boardCell.l, boardCell.u);
                    });
                }).catch(e => console.log('Connection failed: ', e));
        }
    }, [])

    const updateGrid = useCallback(() => {
        let columns = Math.floor(content.current.offsetWidth / (board.zoom * render.widthFactor));
        let rows = Math.floor(content.current.offsetHeight / board.zoom);

        grid.columns = columns;
        grid.rows = rows;
        updateFrame();
    }, [])

    useEffect(() => {
        if (content.current) {
            updateGrid();
            position.caret.x = Math.floor(grid.columns / 2);
            position.caret.y = Math.floor(grid.rows / 2);
            triggerUpdate(true);
        }
    }, [windowSize, updateGrid]);

    const updateFrame = () => {
        frame.ox = position.x - Math.floor((grid.columns * 3) / 2);
        frame.oy = position.y - Math.floor((grid.rows * 3) / 2);
        frame.ix = position.x - Math.floor(grid.columns / 2);
        frame.iy = position.y - Math.floor(grid.rows / 2);
        frame.dx = grid.columns * 3;
        frame.dy = grid.rows * 3;
    }

    useEffect(() => {
        if (frame.dx > 0 && frame.dy > 0 && update === true) {
            triggerUpdate(false);
            let unsavedChanges = BoardService.getUnsavedChanges();
            BoardService.getBoardCells(frame.ox, frame.oy, frame.dx, frame.dy).then((result) => {

                unsavedChanges.forEach(_ => {
                    let cell = result.find(c => c.x === _.x && c.y === _.y);
                    let cellIndex = result.indexOf(cell);
                    result.splice(cellIndex, 1);
                });
                board.cells = result.concat(unsavedChanges);
                board.cells.forEach(_ => {
                    _.vx = _.x - frame.ix;
                    _.vy = _.y - frame.iy;
                    _.r = false;
                });

                clearBoard();
                updateBoard();
                connectBoardHub();
                updatePosition(position.caret.x, position.caret.y);
                setGoToOpen(false);

                drag.enabled = true;
                board.input.enabled = true;
            });
        }
    }, [update, connectBoardHub]);

    const selectPosition = (e) => {
        var x = Math.floor(e.clientX / (board.zoom * render.widthFactor));
        var y = Math.floor(e.clientY / board.zoom);
        updatePosition(x, y);
    }

    const updatePosition = (x, y) => {
        resetCell(position.caret.x, position.caret.y);
        position.caret.x = x;
        position.caret.y = y;
        document.title = `gibbr ${x + frame.ix} : ${y + frame.iy}`;
        Config.setUserPosition(x + frame.ix, y + frame.iy);
        renderCaret(x, y);
    }

    const updateBoardCell = (x, y, letter, userId) => {
        if (!userId) {
            userId = Config.getUser().id;
        }
        let cell = board.cells.find(_ => _.vx === x && _.vy === y);
        if (!cell && letter !== '') {
            cell = { x: x + frame.ix, y: y + frame.iy, vx: x, vy: y, l: letter, u: userId, r: false };
            board.cells.push(cell);
        } else if (cell && letter !== cell.l) {
            cell.l = letter;
            cell.u = userId;
            cell.r = false;
        }

        updateBoard();
        return cell;
    }

    const goTo = useCallback((x, y) => {
        board.input.enabled = false;
        position.x = x;
        position.y = y;
        updateFrame();
        triggerUpdate(true);
    }, [])

    const handleScroll = useCallback(() => {
        let offsetX = 0;
        let offsetY = 0;

        if (position.caret.x < 0) {
            offsetX = -1 * Math.floor(grid.columns / 6);
        } else if (position.caret.x > grid.columns) {
            offsetX = Math.floor(grid.columns / 6);
        } else if (position.caret.y < 0) {
            offsetY = -1 * Math.floor(grid.rows / 6);
        } else if (position.caret.y > grid.rows) {
            offsetY = Math.floor(grid.rows / 6);
        }

        if (offsetX !== 0 || offsetY !== 0) {
            let centerX = frame.ix + Math.floor(grid.columns / 2);
            let centerY = frame.iy + Math.floor(grid.rows / 2);
            position.caret.x = position.caret.x - offsetX;
            position.caret.y = position.caret.y - offsetY;
            goTo(centerX + offsetX, centerY + offsetY);
        }
    }, [goTo])

    const handleKeyDown = useCallback((e) => {
        if (board.input.enabled) {
            if (isAltGr(e)) {
                setAltGrDown(true);
            }
            if (!isCtrlDown() && !goToOpen) {
                if (isCtrl(e)) {
                    setCtrlDown(true);
                } else if (isLeftArrow(e)) {
                    updatePosition(position.caret.x - 1, position.caret.y);
                } else if (isUpArrow(e)) {
                    updatePosition(position.caret.x, position.caret.y - 1);
                } else if (isRightArrow(e)) {
                    updatePosition(position.caret.x + 1, position.caret.y);
                } else if (isDownArrow(e)) {
                    updatePosition(position.caret.x, position.caret.y + 1);
                } else if (isBackspace(e)) {
                    if (BoardValidation.canEditCell(position.caret.x, position.caret.y)) {
                        let cell = updateBoardCell(position.caret.x - 1, position.caret.y, '');
                        BoardService.bufferSaveBoardCell(cell);
                    }
                    updatePosition(position.caret.x - 1, position.caret.y);
                } else if (isEnter(e)) {
                    let newLineX = getNewLine(position.caret.x, position.caret.y);
                    updatePosition(newLineX, position.caret.y + 1);
                } else if (e.key.length === 1) {
                    if (BoardValidation.canEditCell(position.caret.x, position.caret.y)) {
                        let cell = updateBoardCell(position.caret.x, position.caret.y, e.key);
                        BoardService.bufferSaveBoardCell(cell);
                    }

                    updatePosition(position.caret.x + 1, position.caret.y);
                }
                handleScroll();
            } else if (e.key === 'g') {
                e.preventDefault();
                drag.enabled = false;
                setGoToOpen(true);
            }
        } else {
            e.preventDefault();
        }
    }, [goToOpen, handleScroll])

    const handleKeyUp = useCallback((e) => {
        if (isCtrl(e)) {
            setCtrlDown(false);
        }
        if (isAltGr(e)) {
            setAltGrDown(false);
        }
    }, [])

    const handleZoom = useCallback((e) => {
        if (render.zoomEnabled) {
            let zoomChanged = false;
            if (e.deltaY > 0 && board.zoom > render.minZoom) {
                board.zoom = board.zoom - render.deltaZoom;
                zoomChanged = true;
            }
            else if (e.deltaY < 0 && board.zoom < render.maxZoom) {
                board.zoom = board.zoom + render.deltaZoom;
                zoomChanged = true;
            }

            if (zoomChanged) {
                clearBoard();
                updateGrid();
                board.cells.forEach(_ => {
                    _.vx = _.x - frame.ix;
                    _.vy = _.y - frame.iy;
                    _.r = false;
                });
                updateBoard();
                updatePosition(Math.floor(grid.columns / 2), Math.floor(grid.rows / 2));

                clearTimeout(zoomTimer);
                zoomTimer = setTimeout(() => triggerUpdate(true), render.delayZoom);
            }
        }
    }, [updateGrid]);

    const closeGoTo = () => {
        setGoToOpen(false);
        drag.enabled = true;
    }

    const handleMouseDown = useCallback((e) => {
        if (drag.enabled === true) {
            drag.mouseDown = true;
            drag.frameChanged = false;
            drag.mouseDownX = e.clientX;
            drag.mouseDownY = e.clientY;
        }
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (drag.mouseDown === true) {
            let dirX = drag.mouseDownX - e.clientX > 0 ? 1 : -1;
            let dirY = drag.mouseDownY - e.clientY > 0 ? 1 : -1;
            let mouseMoveDx = Math.floor(Math.abs(drag.mouseDownX - e.clientX) / (board.zoom * render.widthFactor)) * dirX;
            let mouseMoveDy = Math.floor(Math.abs(drag.mouseDownY - e.clientY) / board.zoom) * dirY;

            if (mouseMoveDx !== 0) {
                position.x = position.x + mouseMoveDx;
                drag.mouseDownX = e.clientX;
                drag.frameChanged = true;
            }
            if (mouseMoveDy !== 0) {
                position.y = position.y + mouseMoveDy;
                drag.mouseDownY = e.clientY;
                drag.frameChanged = true;
            }
            if (drag.frameChanged === true) {
                content.current.className = 'canvas-mouse-grab';

                clearBoard();
                updateGrid();
                board.cells.forEach(_ => {
                    _.vx = _.x - frame.ix;
                    _.vy = _.y - frame.iy;
                    _.r = false;
                });
                updateBoard();
            }
        }
    }, [updateGrid])

    const handleMouseUp = useCallback(() => {
        drag.mouseDown = false;
        content.current.className = 'canvas-mouse-normal';
        if (drag.frameChanged === true) {
            triggerUpdate(true);
        }
    }, [])

    useEffect(() => {
        window.addEventListener("wheel", handleZoom);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("wheel", handleZoom);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleKeyDown, handleKeyUp, handleZoom, handleMouseDown, handleMouseMove, handleMouseUp]);

    return (
        <div className='full-size' ref={content}>
            {grid.columns > 0 && grid.rows > 0 && <canvas
                ref={board.canvas}
                width={grid.columns * board.zoom * render.widthFactor}
                height={grid.rows * board.zoom}
                onClick={selectPosition} />}
            <GoToDialog
                open={goToOpen}
                goTo={goTo}
                close={closeGoTo} />
        </div>
    );
}

export default BoardView;
