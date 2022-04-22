import * as Request from "../util/request.handler"
import * as Config from '../util/config';
import { saveSettings } from '../settings/save.settings';

let saveBuffer = [];
let saveTimer = {};

export async function getBoardCells(x, y, dx, dy) {
    return await Request.send({
        url: `board/cell/${x}/${y}/${dx}/${dy}`,
        method: 'GET'
    }).then((response) => {
        return Request.handleResponse(response)
    });
}

export async function saveBoardCells(boardCells) {
    let user = Config.getUser();
    return await Request.send({
        url: `board/cell/${user.id}`,
        data: boardCells,
        method: 'PUT'
    }).then((response) => {
        return Request.handleResponse(response)
    });
}

export function bufferSaveBoardCell(boardCell) {
    if (boardCell) {
        saveBuffer.push(boardCell);
        clearTimeout(saveTimer);
        if (saveBuffer.length >= saveSettings.saveBufferMaxSize) {
            flushSaveBuffer();
        } else {
            saveTimer = setTimeout(() => flushSaveBuffer(), saveSettings.saveTimeTrigger)
        }
    }
}

export function flushSaveBuffer() {
    saveBoardCells(saveBuffer);
    saveBuffer = [];
};