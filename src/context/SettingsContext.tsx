import React, {createContext, ReactNode, useState} from 'react';
import _ from 'lodash';
import {THEMES} from '../constants';
import {storeSettings} from '../utils/settings';

export class Settings {
    theme: string | undefined;

    constructor(theme?: string) {
        this.theme = theme;
    }
}

const SettingsContext = createContext({
    settings: new Settings(),
    saveSettings: (settings: Settings) => {}
});

const defaultSettings: Settings = new Settings(THEMES.LIGHT);

export type SettingsProviderProps = {
    settings: Settings,
    children: JSX.Element | JSX.Element[] | ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({settings, children}) => {
    const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings);

    const handleSaveSettings = (updatedSettings = {}) => {
        const mergedSettings = _.merge({}, currentSettings, updatedSettings);

        setCurrentSettings(mergedSettings);
        storeSettings(mergedSettings);
    };

    return (
        <SettingsContext.Provider
            value={{
                settings: currentSettings,
                saveSettings: handleSaveSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
