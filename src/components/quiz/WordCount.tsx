import Slider from '@react-native-community/slider';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Surface } from '../Surface';

interface Props {
    value: number;
    setValue: (value: number) => void;
}

const styles = StyleSheet.create({
    surface: {
        paddingVertical: 16,
        width: '100%',
        margin: 16,
        backgroundColor: 'white',
    },
    label: {
        color: 'grey',
        fontSize: 16,
    },
    slider: {
        marginTop: 8,
        height: 24,
    },
})

export const WordCount: React.FC<Props> = (props) => {
    return (
        <Surface style={styles.surface}>
            <Text style={styles.label}>{'Number of words:'} {props.value === Infinity ? 'infinite' : props.value}</Text>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={110}
                onValueChange={props.setValue}
                step={10}
            />
        </Surface>
    );
};
