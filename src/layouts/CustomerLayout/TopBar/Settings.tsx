import React from 'react';
import {
    IconButton,
    SvgIcon,
    Tooltip,
} from '@material-ui/core';
import { Moon as MoonIcon, Sun as SunIcon } from 'react-feather';
import useSettings from '../../../hooks/useSettings';
import { THEMES } from '../../../constants';

function Settings() {
    const { settings, saveSettings } = useSettings();

    const handleChange = () => {
        saveSettings({theme: settings.theme === THEMES.LIGHT ? THEMES.ONE_DARK : THEMES.LIGHT})
    };

    return (
        <>
            <Tooltip title="Переключить светлую/темную тему">
                <IconButton
                    color="inherit"
                    onClick={handleChange}
                >
                    <SvgIcon>
                        {
                            settings.theme === THEMES.LIGHT ? (
                                <MoonIcon />
                            ) : (
                                <SunIcon />
                            )
                        }
                    </SvgIcon>
                </IconButton>
            </Tooltip>
        </>
    );
}

export default Settings;
