export default {
    setApplicationSettings: (appSettings) => {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
    },
    apiURL: () => {
        let appSettings = JSON.parse(localStorage.getItem('appSettings'));
        return '' + appSettings["API:BaseURL"];
    },
    version: () => {
        let appSettings = JSON.parse(localStorage.getItem('appSettings'));
        return '' + appSettings["Web:Version"];
    }
}