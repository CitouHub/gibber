export function setApplicationSettings(appSettings) {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

export function getGibberUser() {
    let gibberUser = localStorage.getItem('gibberUser');
    if (!gibberUser) {
        gibberUser = makeUserId();
        localStorage.setItem('appSettings', gibberUser);
    }
    return gibberUser;
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
    let length = appSettings['UserIdLength']
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}