export function restoreSettings() {
    let settings = null;

    try {
        const storeData = localStorage.getItem('settings');

        if (storeData) {
            settings = JSON.parse(storeData);
        }
    } catch (err) {
        // If stored data is not a strigified JSON this might fail,
        // that's why we catch the error
    }

    return settings
}

export function storeSettings(settings: object) {
    localStorage.setItem('settings', JSON.stringify(settings));
}
