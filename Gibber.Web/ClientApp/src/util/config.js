export function setApplicationSettings(appSettings) {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

export function apiURL() {
    let appSettings = JSON.parse(localStorage.getItem('appSettings'));
    return '' + appSettings["API:BaseURL"];
}

export function version() {
    let appSettings = JSON.parse(localStorage.getItem('appSettings'));
    return '' + appSettings["Web:Version"];
}