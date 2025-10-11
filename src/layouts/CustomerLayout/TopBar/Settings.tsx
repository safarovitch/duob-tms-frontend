import React from 'react';
import {
    IconButton,
    SvgIcon,
    Tooltip,
} from '@material-ui/core';
import { Moon as MoonIcon, Sun as SunIcon } from 'react-feather';
import useSettings from '../../../hooks/useSettings';
import {GlobalThemeEnum} from '../../../constants';

const Settings: React.FC = () => {
    const { settings, saveSettings } = useSettings();

    const handleChange = () => {
        saveSettings({...settings, theme: settings.theme === GlobalThemeEnum.LIGHT ? GlobalThemeEnum.ONE_DARK : GlobalThemeEnum.LIGHT})
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
                            settings.theme === GlobalThemeEnum.LIGHT ? (
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
