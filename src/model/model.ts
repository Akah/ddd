import { Model } from '@nozbe/watermelondb';
import { field, text, writer } from '@nozbe/watermelondb/decorators';

export class Settings extends Model {
    public static table = 'settings';

    @text('theme')
    public theme!: string;

    @text('language')
    public language!: string;

    @field('reminders')
    public reminders!: boolean;

    @field('reminder_time')
    public reminderTime!: number; // number from 0 - 2400?

    @field('animations')
    public animations!: boolean;

    @field('haptic')
    public haptic!: boolean;

    @field('sound')
    public sound!: boolean;

    @writer
    public async updateSettings(newSetting: Partial<Settings>) {
        await this.update((setting: Settings) => {
            setting = { ...setting, ...newSetting } as Settings;
        });
    }

    public toObject(): object {
        return {
            theme: this.theme,
            language: this.language,
            reminders: this.reminders,
            reminderTime: this.reminderTime,
            animations: this.animations,
            haptic: this.haptic,
            sound: this.sound,
        };
    }
}

export type Gender = 'm' | 'n' | 'f';

export class Words extends Model {
    public static table = 'words';

    @text('noun')
    public noun!: string;

    @text('gender')
    public gender!: Gender;

    @field('frequency')
    public frequency!: number;

    @field('seen') // times the word has been seen
    public seen!: number;

    @field('correct') // times the word was answered correctly
    public correct!: number;

    @field('lastSeen')
    public lastSeen!: number;

    @field('favorite')
    public favorite!: boolean;

    @text('ending')
    public ending!: string | null;

    public toObject(): object {
        return {
            id: this.id,
            noun: this.noun,
            gender: this.gender,
            frequency: this.frequency,
            seen: this.seen,
            correct: this.correct,
            lastSeen: this.lastSeen,
            favorite: this.favorite,
            ending: this.ending,
        };
    }
}
