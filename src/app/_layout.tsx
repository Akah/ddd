import { PortalProvider } from '@gorhom/portal';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import React from 'react';

import WordsJSON from '../../assets/words.json';
import { database } from '../model/database';
import { Gender, Words } from '../model/model';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (!__DEV__) {
    Sentry.init({
        dsn: 'https://0ffe8e0b3b96cdb4d4301ed35d66ea2a@o4509496458608640.ingest.de.sentry.io/4509496464113744',

        // Adds more context data to events (IP address, cookies, user, etc.)
        // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
        sendDefaultPii: true,
        integrations: [Sentry.feedbackIntegration()],

        // uncomment the line below to enable Spotlight (https://spotlightjs.com)
        // spotlight: __DEV__,
    });
}

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

            const actions = await Promise.all(WordsJSON.map(async (record, index) => {
                return wordsCollection.prepareCreate((word) => {
                    word._raw.id = index.toString();
                    word.noun = record.noun;
                    word.gender = toGender(record.gender);
                    word.frequency = record.freq;
                    word.ending = getWordEnding(record.noun, WORD_ENDINGS);
                });
            }));
            await database.write(async () => {
                await database.batch(actions);
            });
            console.log('init db time:', Date.now() - timer, 'ms');
        })();
    }, []);
}

function App() {
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

export default (__DEV__ ? App : Sentry.wrap(App));
