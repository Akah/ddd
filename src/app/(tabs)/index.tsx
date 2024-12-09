import { PortalHost } from '@gorhom/portal';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../components/Button';
import { QuizModal } from '../../components/quiz/Modal';
import { Words } from '../../model/model';
import { database } from '../../model/database';
import { Q } from '@nozbe/watermelondb';

const style = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function() {
    const [open, setOpen] = React.useState(false);
    const [ list, setList ] = React.useState<Array<Words>>([]);

    async function onOpen(): Promise<void> {
        await getWords();
        setOpen(true);
    }

    function onClose(): void {
        setOpen(false);
    }

    async function getWords(): Promise<void> {
        const query = database.collections.get<Words>('words').query(
            Q.unsafeSqlQuery('select * from words order by random() limit 10'),
        );
        const res = await query.fetch();
        setList(res);
    }

    return (
        <>
            <PortalHost name="modal" />
            <View style={style.root}>
                <Button onPress={onOpen} color="white" borderColor="lightgrey" textStyles={{ color: 'grey' }}>start</Button>
                <QuizModal open={open} onClose={onClose} words={list} />
            </View >
        </>
    )
};
