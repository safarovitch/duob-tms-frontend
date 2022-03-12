import {useContext} from 'react';
import SettingsContext, {SettingsContextValue} from '../context/SettingsContext';

function useSettings(): SettingsContextValue {
    return useContext(SettingsContext);
}

export default useSettings
