export function setApplicationSettings(appSettings) {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

export function setUserPosition(x, y, vx, vy) {
    let user = getUser();
    user.x = x;
    user.y = y;
    user.vx = vx;
    user.vy = vy;
    setUser(user);
}

export function setUser(user) {
    localStorage.setItem('gibberUser', JSON.stringify(user));
}

export function getUser() {
    let user = JSON.parse(localStorage.getItem('gibberUser'));
    if (!user) {
        user = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            id: makeUserId()
        }
        setUser(user);
    }
    if (!user.id || user.id.length === 0) {
        user.id = makeUserId();
        setUser(user);
    }
    return user;
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