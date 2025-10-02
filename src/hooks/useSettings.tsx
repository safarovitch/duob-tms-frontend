import {useContext} from 'react';
import SettingsContext from '../context/SettingsContext';

function useSettings() {
    return useContext(SettingsContext);
}

export default useSettings
