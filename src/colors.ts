import { useColorScheme } from 'react-native';

interface Theme {
    text: string;
    background: string;
    border: string;
    wallpaper: string;
}

export function useTheme(): Theme {
    const colorScheme = useColorScheme();

    if (colorScheme === 'light') {
        return lightTheme;
    }

    if (colorScheme === 'dark') {
        return darkTheme;
    }

    return darkTheme;

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
