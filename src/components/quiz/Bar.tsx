import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import React from 'react';

import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants';
import { Dialog } from '../Dialog';

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
    const [ dialogOpen, setDialogOpen ] = React.useState(false);

    function onBackPress(): void {
        if (props.progress > 1) {
            setDialogOpen(true);
            return;
        }
        props.onBack();
    }

    function closeDialog(): void {
        setDialogOpen(false);
    }

    return (
        <View style={style.bar}>
            <MaterialIcons
                name="close"
                size={24}
                color="grey"
                onPress={onBackPress}
            />
            <View style={style.progress}>
                <View style={[style.progressMain, { width: `${props.progress}%` }]} />
            </View>
            <Dialog
                title="Quit now?"
                subtitle="This will reset all progress that you have made"
                visible={dialogOpen}
                actions={[
                    {
                        label: 'quit',
                        callback: props.onBack,
                        color: colors.red.background,
                    },
                    {
                        label: 'cancel',
                        callback: closeDialog,
                    },
                ]}
            />
        </View>
    );
}
