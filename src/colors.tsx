import { useDatabase } from '@nozbe/watermelondb/react';
import * as React from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
    text: string;
    background: string;
    border: string;
    wallpaper: string;
    shadow: string;
}

const lightTheme: Theme = {
    text: 'grey',
    background: 'white',
    border: 'lightgrey',
    wallpaper: '#eeeeee',
    shadow: 'lightgrey',
};

const darkTheme: Theme = {
    text: '#dddddd',
    background: '#282828',
    border: '#3f3f3f',
    wallpaper: '#181818',
    shadow: '#141414',
};

export const useTheme = () =>
    useColorScheme() === 'dark' ? darkTheme : lightTheme;
