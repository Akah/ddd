/* eslint-disable no-console */
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';

import { Settings, Words } from './model';
import schema from './schema';

const adapter = new SQLiteAdapter({
    schema,
    dbName: 'ddd',
    jsi: Platform.OS === 'ios',
    onSetUpError: (error: any) => {
        console.log('error setting up database', error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [Settings, Words],
});
