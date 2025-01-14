import { PortalHost } from '@gorhom/portal';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../components/Button';
import { QuizModal } from '../../components/quiz/Modal';
import { Words } from '../../model/model';
import { database } from '../../model/database';
import { Q } from '@nozbe/watermelondb';
import { WordCount } from '../../components/quiz/WordCount';
import { Setting } from '../../components/Setting';

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
    const [ wordsCount, setWordsCount ] = React.useState<number>(10);
    const [ isRandom, setIsRandom ] = React.useState<boolean>(false);

    function setSlider(value: number): void {
        setWordsCount(value > 100 ? Infinity : value);
    }

    async function onOpen(): Promise<void> {
        if (wordsCount === Infinity) {
            await getWords()
        } else {
            await getNextWord();
        }
        setOpen(true);
    }

    function onClose(): void {
        setOpen(false);
        setList([]);
    }

    async function getWords(): Promise<void> {
        let queryString = 'select * from words';

        if (isRandom) {
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

    async function getNextWord(): Promise<void> {
        const excludedIdsString = list.map((word) => `'${word.id}'`).join(',');
        let queryString = 'select * from words';
        if (list.length > 0) {
            queryString += ` where id NOT IN (${excludedIdsString})`;
        }
        if (isRandom) {
            queryString += ' order by random()';
        }
        queryString += ' limit 1';
        const result = await database.collections.get<Words>('words').query(
            Q.unsafeSqlQuery(queryString)
        );
        setList([...list, ...result]);
    }

    return (
        <>
            <PortalHost name="modal" />
            <View style={style.root}>
                <Button onPress={onOpen} color="white" borderColor="lightgrey" textStyles={{ color: 'grey' }}>start</Button>
                <WordCount value={wordsCount} setValue={setSlider} />
                <Setting.Surface>
                    <Setting.Boolean label="Random words" value={isRandom} set={async (value: boolean) => setIsRandom(value)} />
                </Setting.Surface>
                {open &&
                 <QuizModal
                     open={open}
                     onClose={onClose}
                     onAnswer={getNextWord}
                     words={list}
                     infinite={wordsCount === Infinity}
                 />
                }
            </View >
        </>
    )
};
