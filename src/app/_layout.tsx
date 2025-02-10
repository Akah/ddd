import { PortalProvider } from '@gorhom/portal';
import { Stack } from 'expo-router';
import React from 'react';

import WordsJSON from '../../assets/words.json';
import { database } from '../model/database';
import { Gender, Words } from '../model/model';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MASCULINE = [
    'ant',
    'ast',
    'ich',
    'ig',
    'ling',
    'or',
    'us',
];

const FEMININE = [
    'schaft',
    'sion',
    'sis',
    'tion',
    'anz',
    'ei',
    'heit',
    'keit',
    'tät',
    'ung',
];

const NEUTER = [
    'chen',
    'lein',
    'tel',
];

export function endingToGenderString(ending: string): string {
    if (MASCULINE.includes(ending)) {
        return 'masculine';
    }
    if (FEMININE.includes(ending)) {
        return 'feminine';
    }
    if (NEUTER.includes(ending)) {
        return 'neuter';
    }
    throw new Error(`Invalid word ending: ${ending}`);
}

const WORD_ENDINGS = [...MASCULINE, ...FEMININE, ...NEUTER];

function toGender(gender: string): Gender {
    if (['m', 'n', 'f'].includes(gender)) {
        return gender as Gender;
    }
    throw new Error(`Unable to convert string ${gender}, to type Gender`);
}

function getWordEnding(word: string, endings: Array<string>): string | null {
    for (let ending of endings) {
        // console.log(ending);
        if (word.endsWith(ending)) {
            return ending;
        }
    }
    return null;
}

function useInit(): void {
    const wordsCollection = database.collections.get<Words>('words');

    React.useEffect(() => {
        (async () => {
            const length = await wordsCollection.query().count;
            if (length) {
               return true;
            }
            const timer = Date.now();
            // TO RESET DB:
            /* const deleted = (await wordsCollection.query()).map((each) => each.prepareDestroyPermanently());
             * await database.write(async () => {
             *     await database.batch(deleted);
             * }); */

            const actions = await Promise.all(WordsJSON.map(async (record) => {
                return wordsCollection.prepareCreate((word) => {
                    word.noun = record.noun;
                    word.gender = toGender(record.gender);
                    word.frequency = record.freq;
                    word.ending = getWordEnding(record.noun, WORD_ENDINGS);
                });
            }));
            await database.write(async () => {
                await database.batch(actions);
            });
            console.debug('init db time:', Date.now() - timer, 'ms');
        })();
    }, []);
}

export default function PublicLayout() {
    useInit();
    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PortalProvider>
                    <Stack>
                        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    </Stack>
                </PortalProvider>
            </GestureHandlerRootView>
        </>
    );
}
