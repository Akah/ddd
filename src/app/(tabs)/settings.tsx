import React from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView } from 'react-native';

import { version } from './../../../package.json';
import { Settings } from '../../model/model';
import { database } from '../../model/database';
import { Setting } from '../../components/Setting';
import { map } from '@nozbe/watermelondb/utils/rx';

const settingsCollection = database.collections.get<Settings>('settings');
const settingsQuery = settingsCollection.query()

async function useInitSettings(): Promise<void> {
    React.useEffect(
        () => {
            settingsQuery.count.then(async (res) => {
                if (res > 0) { return; }
                await database.write(async () => {
                    settingsCollection.create((settings: Settings) => {
                        settings.theme = 'auto',
                        settings.language = 'english',
                        settings.reminders = false,
                        settings.reminderTime = 900,
                        settings.animations = true,
                        settings.haptic = true,
                        settings.sound = true
                    });
                });
            });
        },
        []
    );
}

export default function Tab() {
    useInitSettings();
    return (
        <>
            <StatusBar translucent={true} backgroundColor='transparent'/>
            <SettingsComponent />
        </>
    );
};

interface Props {
    settings: Settings | null;
}

const languages = [{
    key: 'english',
    value: 'english',
}, {
    key: 'german',
    value: 'deutsch',
}, {
    key: 'russian',
    value: 'русский',
}, {
    key: 'french',
    value: 'français',
}, {
    key: 'chinese_tw',
    value: '繁體中文',
}];

const themes = [{
    key: 'auto',
    value: 'auto',
}, {
    key: 'dark',
    value: 'dark',
}, {
    key: 'light',
    value: 'light',
}];


function makeSetter<T>(settings: Settings, key: keyof Settings): (value: T) => Promise<void> {
    return async (value: T) => {
        await database.write(async () => {
            await settings!.update((setting: Settings) => {
                setting[key] = value;
            });
        });
    }
}

function timeToString(time: number): string {
    const parsed = String(time).split('');
    const index = parsed.length % 3 + 1;
    parsed.splice(index, 0, ':');
    return parsed.join('');
}

const Component: React.FC<Props> = (props: Props) => {
    const settings = props.settings;

    if (settings == null) {
        return null;
    }

    const setLanguage = makeSetter<string>(settings, 'language');
    const setTheme = makeSetter<string>(settings, 'theme');
    const setReminders = makeSetter<boolean>(settings, 'reminders');
    // const setReminderTime = makeSetter<number>(settings, 'reminderTime');
    const setAnimations = makeSetter<boolean>(settings, 'animations');
    const setSound = makeSetter<boolean>(settings, 'sound');
    const setHaptic = makeSetter<boolean>(settings, 'haptic');

    return (
        <>
            <ScrollView style={{ paddingHorizontal: 16 }}>
                <View style={{ paddingVertical: 16 }}>
                    <Setting.Group label="Misc">
                        <Setting.Surface>
                            <Setting.String
                                label="Language"
                                value={settings.language}
                                options={languages}
                                set={setLanguage}
                            />
                            <Setting.String
                                label="Theme"
                                value={settings.theme}
                                options={themes}
                                set={setTheme}
                            />
                        </Setting.Surface>
                        <Setting.Button label="Feedback" />
                    </Setting.Group>

                    <Setting.Group label="Notifications">
                        <Setting.Surface>
                            <Setting.Boolean
                                label="Send reminders"
                                value={settings.reminders}
                                set={setReminders}
                            />
                            { settings.reminders && <Setting.String
                                label="Schedule reminder at"
                                value={timeToString(settings.reminderTime)}
                                options={[]}
                                // set={setReminderTime}
                            />}
                        </Setting.Surface>
                    </Setting.Group>

                    <Setting.Group label="Accessibility">
                        <Setting.Surface>
                            <Setting.Boolean
                                label="Animations"
                                value={settings.animations}
                                set={setAnimations}
                            />
                            <Setting.Boolean
                                label="Sound effects"
                                value={settings.sound}
                                set={setSound}
                            />
                            <Setting.Boolean
                                label="Haptic feedback"
                                value={settings.haptic}
                                set={setHaptic}
                            />
                        </Setting.Surface>
                    </Setting.Group>

                    <Setting.Group label="Privacy">
                        <Setting.Button label="Terms of use" />
                        <Setting.Button label="Advertisements" />
                        <Setting.Button label="Acknowledgements" />
                    </Setting.Group>

                    <Setting.Group label="Data">
                        <Setting.Button label="Import Data" />
                        <Setting.Button label="Export Data" />
                        <Setting.Button label="Delete Data" />
                    </Setting.Group>

                    <Text style={{ alignSelf: 'center' }}>{`Version: ${version}`}</Text>
                </View>
            </ScrollView>
        </>
    );
};

const SettingsComponent = withObservables(['settings'], () => ({
    settings: database
        .get<Settings>('settings')
        .query()
        .observeWithColumns([
            'theme',
            'language',
            'reminders',
            'reminder_time',
            'animations',
            'haptic',
            'sound',
        ])
        .pipe(map(records => (records.length > 0 ? records[0] : null))),
}))(Component);
