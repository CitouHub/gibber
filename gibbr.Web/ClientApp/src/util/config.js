export function setApplicationSettings(appSettings) {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

export function setUserPosition(x, y) {
    let user = getUser();
    if (user) {
        user.x = x;
        user.y = y;
        setUser(user);
    }
}

export function setUser(user) {
    localStorage.setItem('gibbrUser', JSON.stringify(user));
}

export function getUser() {
    let user = JSON.parse(localStorage.getItem('gibbrUser'));
    return user;
}

export function newUser() {
    let user = {
        x: 0,
        y: 0,
        id: makeUserId()
    }
    setUser(user);
}

export function apiURL() {
    let appSettings = JSON.parse(localStorage.getItem('appSettings'));
    return '' + appSettings["API:BaseURL"];
}

export function version() {
    let appSettings = JSON.parse(localStorage.getItem('appSettings'));
    return '' + appSettings["Web:Version"];
}

function makeUserId() {
    let appSettings = JSON.parse(localStorage.getItem('appSettings'));
    let length = appSettings['User:IdLength']
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}