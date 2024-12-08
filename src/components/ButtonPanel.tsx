import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { colors } from '../constants';

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    button: {
        flexGrow: 1,
    },
});

interface Props {
    actions: Array<(() =>void)>
}

export const ButtonPanel: React.FC<Props> = (props: Props) => {
    return (
        <View style={style.container}>
            <Button
                position="left"
                style={[style.button]}
                color={colors.black.background}
                borderColor={colors.black.border}
                onPress={props.actions[0]}
            >
                der
            </Button>
            <Button
                position="middle"
                style={[style.button]}
                color={colors.red.background}
                borderColor={colors.red.border}
                onPress={props.actions[1]}
            >
                die
            </Button>
            <Button
                position="right"
                style={[style.button]}
                color={colors.gold.background}
                borderColor={colors.gold.border}
                onPress={props.actions[2]}
            >
                das
            </Button>
        </View >
    );
};
