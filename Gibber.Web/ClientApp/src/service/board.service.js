import Request from "../util/request.handler"

export default {
    getBoardCells: async (x, y, dx, dy) => await Request.send({
        url: `board/cell/${x}/${y}/${dx}/${dy}`,
        method: 'GET'
    }).then((response) => {
        return Request.handleResponse(response)
    }),
    saveBoardCells: async (boardCells) => await Request.send({
        url: `board/cell`,
        data: boardCells,
        method: 'PUT'
    }).then((response) => {
        return Request.handleResponse(response)
    }),
}