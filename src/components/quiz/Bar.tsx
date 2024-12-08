import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import React from 'react';

import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants';

const style = StyleSheet.create({
    bar: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    progress: {
        height: 18,
        marginLeft: 16,
        flexGrow: 1,
        backgroundColor: 'lightgrey',
        borderRadius: 16,
        overflow: 'hidden',
    },
    progressMain: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: colors.green.background,
    },
});

interface Props {
    progress: number,
    onBack: () => void,
}

export const QuizBar: React.FC<Props> = (props: Props) => {
    return (
        <View style={style.bar}>
            <MaterialIcons name="close" size={24} color="grey" onPress={props.onBack} />
            <View style={style.progress}>
                <View style={[style.progressMain, { width: `${props.progress}%` }]} />
            </View>
        </View>
    );
}
