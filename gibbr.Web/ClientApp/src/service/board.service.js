import * as Request from "../util/request.handler"
import * as Config from '../util/config';
import { saveSettings } from '../settings/save.settings';

let lastBuffer = [];
let saveBuffer = [];
let saveTimer = {};

export async function getBoardCells(x, y, dx, dy) {
    return await Request.send({
        url: `board/cell/${x}/${y}/${dx}/${dy}`,
        method: 'GET'
    }).then((response) => {
        return Request.handleResponse(response)
    }).catch((error) => {
        console.log(error);
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
    }).catch((error) => {
        console.log(error);
    });
}

export function bufferSaveBoardCell(boardCell, saveBufferMaxSize) {
    if (boardCell) {
        saveBuffer.push(boardCell);
        clearTimeout(saveTimer);
        if (saveBuffer.length >= (saveBufferMaxSize ?? saveSettings.saveBufferMaxSize)) {
            flushSaveBuffer();
        } else {
            saveTimer = setTimeout(() => flushSaveBuffer(), saveSettings.saveTimeTrigger)
        }
    }
}

export function flushSaveBuffer() {
    saveBoardCells(saveBuffer);
    lastBuffer = [...saveBuffer];
    saveBuffer = [];
};

export function getUnsavedChanges() {
    return saveBuffer.concat(lastBuffer);
}