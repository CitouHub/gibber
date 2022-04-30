export const board = {
    canvas: {},
    cells: [],
    zoom: 16,
    paste: {
        maxLength: 10000
    },
    input: {
        enabled: true
    },
    hub: {
        connection: null
    }
}

export const drag = {
    enabled: true,
    mouseDown: false,
    mouseDownX: 0,
    mouseDownY: 0,
    frameChanged: false
}

export const frame = {
    ox: 0,
    oy: 0,
    ix: 0,
    iy: 0,
    dx: 0,
    dy: 0
}

export const grid = {
    columns: 0,
    rows: 0
}

export const position = {
    x: null,
    y: null,
    caret: {
        x: 0,
        y: 0,
        lit: false
    }
}