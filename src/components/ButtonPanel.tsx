import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { Button } from './Button';
import { colors } from '../constants';

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    button: {
        flexGrow: 1,
    },
    whiteText: {
        color: 'white',
    }
});

interface Props {
    actions: Array<(() =>void)>
}

export const ButtonPanel: React.FC<Props> = (props: Props) => {
    const colorScheme = useColorScheme();
    return (
        // TODO: button should take label prop instead of children
        <View style={style.container}>
            <Button
                position="left"
                style={style.button}
                color={colors.black.background}
                borderColor={colors.black.border}
                textStyles={style.whiteText}
                onPress={props.actions[0]}
            >
                der
            </Button>
            <Button
                position="middle"
                style={style.button}
                color={colors.red.background}
                borderColor={colors.red.border}
                textStyles={style.whiteText}
                onPress={props.actions[1]}
            >
                die
            </Button>
            <Button
                position="right"
                style={style.button}
                color={colors.gold.background}
                borderColor={colors.gold.border}
                onPress={props.actions[2]}
                textStyles={style.whiteText}
            >
                das
            </Button>
        </View >
    );
};
