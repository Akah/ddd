/* eslint-disable prettier/prettier */
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export type Table = 'settings';

export default appSchema({
    version: 4,
    tables: [
        tableSchema({
            name: 'settings',
            columns: [
                { name: 'theme', type: 'string' },
                { name: 'language', type: 'string' },
                { name: 'reminders', type: 'boolean' },
                { name: 'reminder_time', type: 'number' },
                { name: 'animations', type: 'boolean' },
                { name: 'haptic', type: 'boolean' },
                { name: 'sound', type: 'boolean' },
            ],
        }),
        tableSchema({
            name: 'words',
            columns: [
                { name: 'noun', type: 'string' },
                { name: 'gender', type: 'string' },
                { name: 'frequency', type: 'number' },
                // optional
                { name: 'favorite', type: 'boolean', isIndexed: true, isOptional: true },
                { name: 'seen', type: 'number', isOptional: true },
                { name: 'correct', type: 'number', isOptional: true },
                { name: 'ending', type: 'string', isOptional: true },
            ],
        }),
    ],
});
