import { PortalProvider } from '@gorhom/portal';
import { Stack } from 'expo-router';
import React from 'react';

import WordsJSON from '../../assets/words.json';
import { database } from '../model/database';
import { Gender, Words } from '../model/model';

function toGender(gender: string): Gender {
    if (['m', 'n', 'f'].includes(gender)) {
        return gender as Gender;
    }
    throw new Error(`Unable to convert string ${gender}, to type Gender`);
}

function useInit(): void {
    const wordsCollection = database.collections.get<Words>('words');

    React.useEffect(() => {
        (async () => {
            const length = await wordsCollection.query().count;
            if (length) {
                return true;
            }

            const actions = WordsJSON.map(async (record) => {
                await database.write(async () => {
                    await wordsCollection.create((word) => {
                        word.noun = record.noun;
                        word.gender = toGender(record.gender);
                        word.frequency = record.freq;
                    });
                });
            });
            await Promise.all(actions);
        })();
    }, []);
}

export default function PublicLayout() {
    useInit();
    return (
        <>
            <PortalProvider>
                <Stack>
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                </Stack>
            </PortalProvider>
        </>
    );
}
