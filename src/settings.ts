import { App, PluginSettingTab, Setting } from 'obsidian';
import { intervalMap } from './constants';

export default class EarTrainingSettingTab extends PluginSettingTab {
	plugin: EarTrainingPlugin;

	constructor(app: App, plugin: EarTrainingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();


        // Add a heading for Intervals
        containerEl.createEl('h2', { text: 'Intervals' });

        // Add UI for interval selection using toggle buttons
        for (const key in intervalMap) {
            if (Object.prototype.hasOwnProperty.call(intervalMap, key)) {
                new Setting(containerEl)
                    .setName(intervalMap[key])
                    .addToggle(toggle => toggle
                        .setValue(this.plugin.settings.selectedIntervals.includes(key))
                        .onChange(async (value) => {
                            if (value) {
                                // Add the interval to the selected intervals list
                                this.plugin.settings.selectedIntervals.push(key);
                            } else {
                                // Remove the interval from the selected intervals list
                                const index = this.plugin.settings.selectedIntervals.indexOf(key);
                                if (index !== -1) {
                                    this.plugin.settings.selectedIntervals.splice(index, 1);
                                }
                            }
                            await this.plugin.saveSettings();
                        }));
            }
        }

        // Add a heading for Options
        containerEl.createEl('h2', { text: 'Options' });

        // Add UI for the mode option
        new Setting(containerEl)
            .setName('Mode')
            .setDesc('Select the ear training mode')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    'oam': 'Only Ascendant Mode',
                    'odm': 'Only Descendant Mode',
                    'aad': 'Ascendant And Descendant',
                })
                .setValue(this.plugin.settings.mode)
                .onChange(async (value) => {
                    this.plugin.settings.mode = value;
                    await this.plugin.saveSettings();
                }));

        // Add UI for the number of exercises option
        new Setting(containerEl)
            .setName('Number of Exercises')
            .setDesc('Set the number of exercises per practice')
            .addText(text => text
                .setPlaceholder('Enter a number')
                .setValue(String(this.plugin.settings.numExercises))
                .onChange(async (value) => {
                    const numExercises = parseInt(value, 10);
                    if (!isNaN(numExercises) && numExercises > 0) {
                        this.plugin.settings.numExercises = numExercises;
                        await this.plugin.saveSettings();
                    }
                }));
	}
}
