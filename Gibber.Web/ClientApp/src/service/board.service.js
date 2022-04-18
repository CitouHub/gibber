import * as Request from "../util/request.handler"

export async function getBoardCells(x, y, dx, dy) {
    return await Request.send({
        url: `board/cell/${x}/${y}/${dx}/${dy}`,
        method: 'GET'
    }).then((response) => {
        return Request.handleResponse(response)
    });
}
export async function saveBoardCells(boardCells) {
    return await Request.send({
        url: `board/cell`,
        data: boardCells,
        method: 'PUT'
    }).then((response) => {
        return Request.handleResponse(response)
    });
}