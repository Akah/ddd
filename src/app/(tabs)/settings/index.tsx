import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { map } from '@nozbe/watermelondb/utils/rx';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Platform, Appearance, ColorSchemeName } from 'react-native';

import { zip, unzip } from 'react-native-zip-archive';

import { version } from './../../../../package.json';
import { Settings, Words } from '../../../model/model';
import { database } from '../../../model/database';
import { Text } from '../../../components/Text';
import { Setting } from '../../../components/Setting';

import * as Sentry from "@sentry/react-native";
import { SendFeedbackParams } from "@sentry/react-native";
import { useTheme } from '../../../colors';

function testFeedback(): void {
    const userFeedback: SendFeedbackParams = {
        name: "John Doe",
        email: "john@doe.com",
        message: "this is a test feedback message",
    };
    // Sentry.captureFeedback(userFeedback);
}

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
    value: i18next.t('auto'),
}, {
    key: 'dark',
    value: i18next.t('dark'),
}, {
    key: 'light',
    value: i18next.t('light'),
}];


function makeSetter<T>(settings: Settings, key: keyof Settings, callback?: (value: T) => void): (value: T) => Promise<void> {
    return async (value: T) => {
        await database.write(async () => {
            await settings!.update((setting: Settings) => {
                setting[key] = value;
            });
        });
        callback?.(value);
    }
}

function timeToString(time: number): string {
    const parsed = String(time).split('');
    const index = parsed.length % 3 + 1;
    parsed.splice(index, 0, ':');
    return parsed.join('');
}

async function getWordsForExport(): Promise<Array<Words>> {
    // TODO: this doesn't include words that are 'unseen' but have been favourited
    return database.collections.get<Words>('words')
        .query(
            Q.or(
                Q.where('lastSeen', Q.gt(0)),
                Q.where('favorite', Q.eq(true)),
            )
        ).fetch();
}

async function getSettingsForExport(): Promise<Settings> {
    return (await database.collections.get<Settings>('settings').query().fetch())[0];
}

async function exportData(): Promise<void> {
    const [words, settings] = await Promise.all([
        getWordsForExport(),
        getSettingsForExport(),
    ]);

    const serialisedWords = words.map((w) => w.toObject());
    const serialisedSettings = settings.toObject();

    const combinedData = { words: serialisedWords, settings: serialisedSettings };

    const exportPath = FileSystem.documentDirectory + 'export.json';
    const exportZip = FileSystem.documentDirectory + 'export.zip';

    await FileSystem.writeAsStringAsync(exportPath, JSON.stringify(combinedData));

    await zip([exportPath], exportZip)
        .then(async (_path) => {
            if (Platform.OS === 'android') {
                const SAF = FileSystem.StorageAccessFramework;
                const result = await SAF.requestDirectoryPermissionsAsync();
                if (result.granted) {
                    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                        result.directoryUri,
                        'export.zip',
                        'application/zip'
                    );

                    const fileData = await FileSystem.readAsStringAsync(exportZip, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    await FileSystem.writeAsStringAsync(fileUri, fileData, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                }
                return;
            }
            await Sharing.shareAsync(exportPath);
        })
        .catch((error) => {
            throw new Error(error);
        })
        .finally(async () => {
            await FileSystem.deleteAsync(exportPath);
            await FileSystem.deleteAsync(exportZip);
        });
}

// TODO: cleanup function
async function importData(): Promise<void> {
    const { canceled, assets, output } = await DocumentPicker.getDocumentAsync({base64: false});
    if (canceled) {
        return;
    }
    const uri = assets[0].uri;
    if (uri == null) {
        throw new Error('Import error retrieving uri from import');
    }
    await unzip(uri, (FileSystem.cacheDirectory!) + 'dir');

    const file = await FileSystem.readAsStringAsync(FileSystem.cacheDirectory! + 'dir/' +'export.json');
    const json = JSON.parse(file);
    const settingsObject = json['settings'];
    const wordsObject = json['words'];

    // TODO: handle errors
    if (wordsObject == null) {
        throw new Error('Import error reading words');
    }
    if (settingsObject == null) {
        throw new Error('Import error reading settings');
    }

    await database.write(async () => {
        const settings = (await database.get<Settings>('settings').query().fetch())[0];
        await settings.update((setting: Settings) => {
            setting.language = settingsObject['language'];
            setting.theme = settingsObject['theme'];
            //
            setting.reminders = settingsObject['reminders'];
            setting.reminderTime = settingsObject['reminderTime'];
            //
            setting.animations = settingsObject['animations'];
            setting.sound = settingsObject['sound'];
            setting.haptic= settingsObject['haptic'];
        });
    });

    let updates = 0;
    const actions = await Promise.all(wordsObject.map(async (importWord: any) => {
        const dbWord = await database.get<Words>('words').find(importWord.id);
        return dbWord.prepareUpdate((_word: Words) => {
            _word.favorite = importWord['favorite'];
            _word.seen = importWord['seen'];
            _word.correct = importWord['correct'];
            _word.lastSeen = importWord['lastSeen'];
            updates++;
        });
    }));

    await database.write(async () => {
        await database.batch(actions);
    });
    console.debug('updated', updates, 'records');
}

async function resetSettings(): Promise<void> {
    await database.write(async () => {
        const settings = (await database.get<Settings>('settings').query().fetch())[0];
        await settings.update((settings: Settings) => {
            // Misc
            settings.language = 'english';
            settings.theme = 'auto';
            // Reminders
            settings.reminders = false;
            settings.reminderTime = 900;
            // Accessibility
            settings.animations = false;
            settings.animations = false;
            settings.haptic = false;
        });
    });
}
// TODO: move somewhere logical
function stringToColorSchemeName(str: string): ColorSchemeName {
    switch (str) {
        case 'dark':
        case 'light':
            return str;
        case 'auto':
            return null;
        default:
            throw new Error('invalid string conversion to theme: ' + str);
    }
}

const Component: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation();
    const router = useRouter();
    const settings = props.settings;

    if (settings == null) {
        return null;
    }

    const setLanguage = makeSetter<string>(settings, 'language', (language: string) => {
        const code = {
            'german': 'de',
            'english': 'en',
            'french': 'fr',
            'russian': 'ru',
        }
        i18next.changeLanguage(code[language] as string);
    });
    const setThemeDB = makeSetter<string>(settings, 'theme');
    const setReminders = makeSetter<boolean>(settings, 'reminders');
    // const setReminderTime = makeSetter<number>(settings, 'reminderTime');
    const setAnimations = makeSetter<boolean>(settings, 'animations');
    const setSound = makeSetter<boolean>(settings, 'sound');
    const setHaptic = makeSetter<boolean>(settings, 'haptic');

    const theme = useTheme();

    const setTheme = (value: string) => {
        setThemeDB(value);
        Appearance.setColorScheme(stringToColorSchemeName(value));
    };

    return (
        <>
            <ScrollView style={{ paddingHorizontal: 16, backgroundColor: theme.wallpaper }}>
                <View style={{ paddingVertical: 16 }}>
                    <Setting.Group label={t('Misc')}>
                        <Setting.Surface>
                            <Setting.String
                                label={t('Language')}
                                value={settings.language}
                                options={languages}
                                set={setLanguage}
                            />
                            <Setting.String
                                label={t('Theme')}
                                value={t(settings.theme)}
                                options={themes}
                                set={setTheme}
                            />
                        </Setting.Surface>
                        <Setting.Button label={t('Feedback')} onPress={() => router.navigate('settings/feedback')} />
                    </Setting.Group>

                    <Setting.Group label={t('Notifications')}>
                        <Setting.Surface>
                            <Setting.Boolean
                                label={t('Send reminders')}
                                value={settings.reminders}
                                set={setReminders}
                            />
                            {settings.reminders && <Setting.String
                                label="Schedule reminder at"
                                value={timeToString(settings.reminderTime)}
                                options={[]}
                            // set={setReminderTime}
                            />}
                        </Setting.Surface>
                    </Setting.Group>

                    <Setting.Group label={t('Accessibility')}>
                        <Setting.Surface>
                            <Setting.Boolean
                                label={t('Animations')}
                                value={settings.animations}
                                set={setAnimations}
                            />
                            <Setting.Boolean
                                label={t('Sound effects')}
                                value={settings.sound}
                                set={setSound}
                            />
                            <Setting.Boolean
                                label={t('Haptic feedback')}
                                value={settings.haptic}
                                set={setHaptic}
                            />
                        </Setting.Surface>
                    </Setting.Group>

                    <Setting.Group label={t('Privacy')}>
                        <Setting.Button label={t('Terms of use')} />
                        <Setting.Button label={t('Advertisements')} />
                        <Setting.Button label={t('Acknowledgements')} />
                    </Setting.Group>

                    <Setting.Group label={t('Data')}>
                        <Setting.Button label={t('Import data')} onPress={importData} />
                        <Setting.Button label={t('Export data')} onPress={exportData} />
                        <Setting.Button label={t('Delete data')} onPress={resetSettings} />
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
