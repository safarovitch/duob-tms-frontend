import React, {createContext, ReactNode, useState} from 'react';
import _ from 'lodash';
import {storeSettings} from '../utils/settings';
import {GlobalThemeEnum} from "../constants";

export interface GlobalSettingsInterface {
    theme: GlobalThemeEnum
}

const defaultSettings: GlobalSettingsInterface = {
    theme: GlobalThemeEnum.LIGHT
}

export interface SettingsContextValue {
    settings: GlobalSettingsInterface;
    saveSettings: (settings: GlobalSettingsInterface) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
    settings: defaultSettings,
    saveSettings: () => {}
});

interface SettingsProviderProps {
    settings: GlobalSettingsInterface | null;
    children: JSX.Element | JSX.Element[] | ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = (props) => {
    const {settings, children} = props
    const [currentSettings, setCurrentSettings] = useState<GlobalSettingsInterface>(settings ?? defaultSettings);

    const handleSaveSettings = (updatedSettings: GlobalSettingsInterface) => {
        const mergedSettings: GlobalSettingsInterface = _.merge({}, currentSettings, updatedSettings);

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

export default SettingsContext;
