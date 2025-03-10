import React from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
    text: string;
    background: string;
    border: string;
    wallpaper: string;
}

const lightTheme: Theme = {
    text: 'grey',
    background: 'white',
    border: 'lightgrey',
    wallpaper: '#eeeeee',
}

const darkTheme: Theme = {
    text: '#dddddd',
    background: '#282828',
    border: '#3f3f3f',
    wallpaper: '#181818',
}

export function useTheme(): Theme {
    const scheme = useColorScheme();
    const [ theme, setTheme ] = React.useState<Theme>(lightTheme);
    React.useEffect(
        () => {
            setTheme(scheme === 'dark' ? darkTheme : lightTheme);
        },
        [scheme]
    );
    return theme;
};
