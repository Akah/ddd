import { appSchema, tableSchema } from '@nozbe/watermelondb';

export type Table = 'settings';

export default appSchema({
    version: 2,
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
    ],
});
