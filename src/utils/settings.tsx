import {GlobalSettingsInterface} from "../context/SettingsContext";

export function restoreSettings(): GlobalSettingsInterface | null {
    let settings: GlobalSettingsInterface | null = null;

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

export function storeSettings(settings: GlobalSettingsInterface) {
    localStorage.setItem('settings', JSON.stringify(settings));
}
