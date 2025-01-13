import Slider from '@react-native-community/slider';
import { PortalHost } from '@gorhom/portal';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Button } from '../../components/Button';
import { QuizModal } from '../../components/quiz/Modal';
import { Words } from '../../model/model';
import { database } from '../../model/database';
import { Q } from '@nozbe/watermelondb';
import { WordCount } from '../../components/quiz/WordCount';

const style = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

export default function() {
    const [open, setOpen] = React.useState(false);
    const [ list, setList ] = React.useState<Array<Words>>([]);
    // slider
    const [ wordsCount, setWordsCount ] = React.useState<number>(10);

    function setSlider(value: number): void {
        setWordsCount(value > 100 ? Infinity : value);
    }

    async function onOpen(): Promise<void> {
        await getWords();
        setOpen(true);
    }

    function onClose(): void {
        setOpen(false);
    }

    async function getWords(): Promise<void> {
        let queryString = 'select * from words';

        if (true /*isRandom*/) {
            queryString += ' order by random()';
        }

        if (wordsCount != Infinity) {
            queryString += ` limit ${wordsCount}`;
        }

        const result = await database.collections.get<Words>('words').query(
            Q.unsafeSqlQuery(queryString)
        ).fetch();

        setList(result);
    }

    return (
        <>
            <PortalHost name="modal" />
            <View style={style.root}>
                <Button onPress={onOpen} color="white" borderColor="lightgrey" textStyles={{ color: 'grey' }}>start</Button>
                <WordCount value={wordsCount} setValue={setSlider} />
                <QuizModal open={open} onClose={onClose} words={list} />
            </View >
        </>
    )
};
