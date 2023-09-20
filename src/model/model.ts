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
            setting = {...setting, ...newSetting} as Settings;
        });
    }
}
