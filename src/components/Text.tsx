import React from 'react';

import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../colors';

const style = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    default: {
        fontSize: 16,
    }
});

export const Text: React.FC<TextProps> = (props) => {
    const theme = useTheme();
    return (
        <RNText style={[style.default, {color: theme.text}, props.style]}>
            {props.children}
        </RNText>
    );
};

export const Header: React.FC<TextProps> = (props) => {
    const theme = useTheme();
    return (
        <RNText style={[style.header, {color: theme.text}, props.style]}>
            {props.children}
        </RNText>
    )
}
