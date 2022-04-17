import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowSize } from '../util/use.windowsize';
import { renderSettings } from '../setting/setting.render';
import BoardService from '../service/board.service';
import Board from '../component/board';

const Home = () => {
    const [dimension, setDimension] = useState({ columns: 0, rows: 0 });
    const [boardFrame, setBoardFrame] = useState({ x: 0, y: 0, dx: 0, dy: 0, ox: 0, oy: 0 });
    const [board, setBoard] = useState([]);

    const content = useRef();
    const windowSize = useWindowSize();

    const handleZoom = useCallback(e => {
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
    }, [renderSettings.zoomLevel]);

    const updateBoardFrame = () => {
        if (content.current) {
            let startX = 0;
            let startY = 0;
            let columns = Math.floor(content.current.offsetWidth / (renderSettings.zoomLevel * renderSettings.widthFactor));
            let rows = Math.floor(content.current.offsetHeight / renderSettings.zoomLevel);

            if (columns !== dimension.columns || rows !== dimension.rows) {
                setDimension({
                    columns: columns,
                    rows: rows
                });

                setBoardFrame({
                    ox: startX - Math.round((columns * 3) / 2),
                    oy: startY - Math.round((rows * 3) / 2),
                    ix: startX - Math.round(columns / 2),
                    iy: startY - Math.round(rows / 2),
                    dx: columns * 3,
                    dy: rows * 3
                });
            }
        }
    }

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
        console.log(boardCells);
        boardCells.forEach(_ => {
            _.x = _.vx + boardFrame.ix;
            _.y = _.vy + boardFrame.iy;
        });
        console.log(boardCells);
        BoardService.saveBoardCells(boardCells);
    }

    useEffect(() => {
        updateBoardFrame();
    }, [windowSize]);

    useEffect(() => {
        if (boardFrame.dx > 0 && boardFrame.dy > 0) {
            BoardService.getBoardCells(boardFrame.ox, boardFrame.oy, boardFrame.dx, boardFrame.dy).then((result) => {
                result.forEach(_ => _.r = false);
                setBoard(result);
            });
        }
    }, [boardFrame]);

    useEffect(() => {
        window.addEventListener("wheel", handleZoom);
        return () => {
            window.removeEventListener("wheel", handleZoom);
        };
    }, []);

    return (
        <div className='full-size' ref={content}>
            {board && board.length >= 0 && <Board
                columns={dimension.columns}
                rows={dimension.rows}
                zoomLevel={renderSettings.zoomLevel}
                visibleBoard={getVisibleBoard()}
                saveChanges={saveChanges}
            />}
        </div>
    );
}

export default Home;
