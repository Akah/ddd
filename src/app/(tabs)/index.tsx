import { PortalHost } from '@gorhom/portal';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../components/Button';
import { QuizModal } from '../../components/quiz/Modal';

const style = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function Favorites() {
    const [open, setOpen] = React.useState(false);

    function onOpen(): void {
        setOpen(true);
    }

    function onClose(): void {
        setOpen(false);
    }

    return (
        <>
            <PortalHost name="modal" />
            <View style={style.root}>
                <Button onPress={onOpen} color="white" borderColor="lightgrey" textStyles={{ color: 'grey' }}>start</Button>
                <QuizModal open={open} onClose={onClose} />
            </View >
        </>
    )
};
