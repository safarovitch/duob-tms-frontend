import _ from 'lodash';
import {colors, Direction, PaletteType, responsiveFontSizes} from '@material-ui/core';
import { createTheme as createMuiTheme, ThemeOptions } from '@material-ui/core/styles';
import typography from './typography';
import { softShadows, strongShadows } from './shadows';
import {GlobalThemeEnum} from '../constants';
import {GlobalSettingsInterface} from "../context/SettingsContext";
import {Shadows} from "@material-ui/core/styles/shadows";

const baseConfig = {
    direction: 'ltr' as Direction,
    typography,
    overrides: {
        MuiLinearProgress: {
            root: {
                borderRadius: 3,
                overflow: 'hidden'
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: 32
            }
        },
        MuiChip: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.075)'
            }
        }
    }
};

const themeConfigs = [
    {
        name: GlobalThemeEnum.LIGHT,
        overrides: {
            MuiInputBase: {
                input: {
                    '&::placeholder': {
                        opacity: 1,
                        color: colors.blueGrey[600]
                    }
                }
            }
        },
        palette: {
            type: 'light' as PaletteType,
            action: {
                active: colors.blueGrey[600]
            },
            background: {
                default: '#f4f6f8',
                dark: colors.common.white,
                paper: colors.common.white
            },
            primary: {
                main: colors.indigo[600]
            },
            secondary: {
                main: '#5850EC'
            },
            text: {
                primary: colors.blueGrey[900],
                secondary: colors.blueGrey[600]
            }
        },
        shadows: softShadows as Shadows
    },
    {
        name: GlobalThemeEnum.ONE_DARK,
        palette: {
            type: 'dark' as PaletteType,
            action: {
                active: 'rgba(255, 255, 255, 0.54)',
                hover: 'rgba(255, 255, 255, 0.04)',
                selected: 'rgba(255, 255, 255, 0.08)',
                disabled: 'rgba(255, 255, 255, 0.26)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)',
                focus: 'rgba(255, 255, 255, 0.12)'
            },
            background: {
                default: '#1c2025',
                dark: '#282C34',
                paper: '#282C34'
            },
            primary: {
                main: '#8a85ff'
            },
            secondary: {
                main: '#8a85ff'
            },
            text: {
                primary: '#e6e5e8',
                secondary: '#adb0bb'
            }
        },
        shadows: strongShadows as Shadows
    },
    {
        name: GlobalThemeEnum.UNICORN,
        palette: {
            type: 'dark',
            action: {
                active: 'rgba(255, 255, 255, 0.54)',
                hover: 'rgba(255, 255, 255, 0.04)',
                selected: 'rgba(255, 255, 255, 0.08)',
                disabled: 'rgba(255, 255, 255, 0.26)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)',
                focus: 'rgba(255, 255, 255, 0.12)'
            },
            background: {
                default: '#222431',
                dark: '#2a2d3d',
                paper: '#2a2d3d'
            },
            primary: {
                main: '#a67dff'
            },
            secondary: {
                main: '#a67dff'
            },
            text: {
                primary: '#f6f5f8',
                secondary: '#9699a4'
            }
        },
        shadows: strongShadows as Shadows
    }
];

export function createTheme(settings: GlobalSettingsInterface) {
    let themeConfig = themeConfigs.find((theme) => theme.name === settings.theme);

    if (!themeConfig) {
        console.warn(new Error(`The theme ${settings.theme} is not valid`));
        [themeConfig] = themeConfigs;
    }

    let options: ThemeOptions = _.merge(baseConfig, themeConfig);

    let theme = createMuiTheme(options);

    theme = responsiveFontSizes(theme);

    return theme;
}
