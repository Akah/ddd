import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    title: string;
}

const style = StyleSheet.create({
    root: {
        width: '100%',
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderColor: 'lightgrey',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    text: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export const Appbar: React.FC<Props> = (props: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[style.root, { paddingTop: insets.top}]}>
            <Text style={style.text}>
                {props.title}
            </Text>
        </View>
    );
}
