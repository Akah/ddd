/* eslint-disable react-native/no-raw-text */
import { PortalHost } from '@gorhom/portal';
import { Q } from '@nozbe/watermelondb';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../components/Button';
import { QuizModal } from '../../components/quiz/Modal';
import { Words } from '../../model/model';
import { database } from '../../model/database';
import { Setting } from '../../components/Setting';

async function getNextWord(list: Array<Words>, isRandom: boolean): Promise<Words> {
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
    return result[0];
}

async function getRandom(limit: number): Promise<Array<Words>> {
    let queryString = 'select * from words order by random()';
    if (limit != Infinity) {
        queryString += ` limit ${limit}`;
    }
    return database.collections.get<Words>('words').query(
        Q.unsafeSqlQuery(queryString)
    ).fetch();
}

async function getFrequency(limit: number): Promise<Array<Words>> {
    return database.collections.get<Words>('words').query(
        Q.where('lastSeen', Q.eq(0)),
        Q.take(limit)
    ).fetch();
}

async function getFavorites(limit: number): Promise<Array<Words>> {
    return database.collections.get<Words>('words').query(
        Q.where('favorite', Q.eq(true)),
        Q.sortBy('lastSeen', Q.desc),
        Q.take(limit),
    ).fetch();
}

async function getMistakes(limit: number): Promise<Array<Words>> {
    let queryString = 'SELECT * FROM words WHERE seen > correct ORDER BY (correct/seen) ASC';
    if (limit != Infinity) {
        queryString += ` limit ${limit}`;
    }
    return database.collections.get<Words>('words').query(
        Q.unsafeSqlQuery(queryString)
    ).fetch();
}

function getQuery(quizType: QuizType): (limit: number) => Promise<Array<Words>> {
    switch (quizType) {
        case 'favorites':
            return getFavorites;
        case 'mistakes':
            return getMistakes;
        case 'frequency':
            return getFrequency;
        default:
            return getRandom;
    }
}

const style = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

type QuizType = 'random' | 'mistakes' | 'favorites' | 'frequency';

export default function () {
    const [open, setOpen] = React.useState(false);
    const [list, setList] = React.useState<Array<Words>>([]);
    const [wordsCount, setWordsCount] = React.useState<number>(10);
    const [quizType, setQuizType] = React.useState<QuizType>('random');

    const isRandom = quizType === 'random';

    function setSlider(value: number): void {
        setWordsCount(value > 100 ? Infinity : value);
    }

    async function onOpen(): Promise<void> {
        if (wordsCount === Infinity) {
            const nextWord = await getNextWord(list, isRandom);
            setList([...list, nextWord])
        } else {
            const query = getQuery(quizType);
            const words = await query(wordsCount);
            setList(words);
        }
        setOpen(true);
    }

    function onClose(): void {
        setOpen(false);
        setList([]);
    }

    // TODO: provide setList as prop so that this can be inside QuizModal
    async function onAnswer(correct: boolean, current: Words): Promise<void> {
        if (!correct) {
            setList([...list, current]);
        } else if (wordsCount === Infinity) {
            const nextWord = await getNextWord(list, isRandom);
            setList([...list, nextWord]);
        }
    }

    return (
        <>
            <PortalHost name="modal" />
            <View style={style.root}>
                <Button
                    onPress={onOpen}
                    color="white"
                    borderColor="lightgrey"
                    textStyles={{ color: 'grey' }}
                >
                    start
                </Button>
                <View style={{ width: '100%' }}>
                    <Setting.Surface>
                        <Setting.Slider
                            label={`Number of words: ${wordsCount === Infinity ? 'Infinite' : wordsCount}`}
                            value={wordsCount}
                            set={setSlider}
                            step={10}
                            min={10}
                            max={110}
                        />
                    </Setting.Surface>
                </View>
                <Setting.Surface>
                    <Setting.String
                        label="Random words"
                        value={quizType}
                        options={[
                            { key: 'random', value: 'Random' },
                            { key: 'mistakes', value: 'Common mistakes' },
                            { key: 'favorites', value: 'Favorites' },
                            { key: 'frequency', value: 'Frequency' },

                        ]}
                        set={async (value: string) => setQuizType(value as QuizType)}
                    />
                </Setting.Surface>
                {open &&
                    <QuizModal
                        open={open}
                        onClose={onClose}
                        onAnswer={onAnswer}
                        words={list}
                        infinite={wordsCount === Infinity}
                    />
                }
            </View >
        </>
    )
};
