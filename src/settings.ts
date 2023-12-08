import { App, PluginSettingTab, Setting } from 'obsidian';
import { intervalMap, chordsMap } from './utils/constants';

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
        
        containerEl.createEl('h3', { text: 'Select Intervals' });

        // Add UI for interval selection using toggle buttons
        for (const key in intervalMap) {
            if (Object.prototype.hasOwnProperty.call(intervalMap, key)) {
                new Setting(containerEl)
                    .setName(intervalMap[key])
                    .addToggle(toggle => toggle
                        .setValue(this.plugin.settings.intervals.settings.selectedNotes.includes(key))
                        .onChange(async (value) => {
                            if (value) {
                                // Add the interval to the selected intervals list
                                this.plugin.settings.intervals.settings.selectedNotes.push(key);
                            } else {
                                // Remove the interval from the selected intervals list
                                const index = this.plugin.settings.intervals.settings.selectedNotes.indexOf(key);
                                if (index !== -1) {
                                    this.plugin.settings.intervals.settings.selectedNotes.splice(index, 1);
                                }
                            }
                            await this.plugin.saveSettings();
                        }));
            }
        }

        // Add a heading for Options
        containerEl.createEl('h3', { text: 'Options' });

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
                .setValue(this.plugin.settings.intervals.settings.mode)
                .onChange(async (value) => {
                    this.plugin.settings.intervals.settings.mode = value;
                    await this.plugin.saveSettings();
                }));

	new Setting(containerEl)
			.setName('Play harmonically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.intervals.settings.isHarmonic)
				.onChange(async (value) => {
					this.plugin.settings.intervals.settings.isHarmonic = value

					await this.plugin.saveSettings();
				}));

        // Add UI for the number of exercises option
        new Setting(containerEl)
            .setName('Number of Exercises')
            .setDesc('Set the number of exercises per practice')
            .addText(text => text
                .setPlaceholder('Enter a number')
                .setValue(String(this.plugin.settings.intervals.settings.numExercises))
                .onChange(async (value) => {
                    const numExercises = parseInt(value, 10);
                    if (!isNaN(numExercises) && numExercises > 0) {
                        this.plugin.settings.intervals.settings.numExercises = numExercises;
                        await this.plugin.saveSettings();
                    }
                }));

                
		containerEl.createEl('h2', { text: 'Chords' });
                
		containerEl.createEl('h3', { text: 'Select Chords' });

		// Add UI for interval selection using toggle buttons
		for (const key in chordsMap) {
			if (Object.prototype.hasOwnProperty.call(chordsMap, key)) {
				new Setting(containerEl)
					.setName(chordsMap[key])
					.addToggle(toggle => toggle
						.setValue(this.plugin.settings.chords.settings.selectedNotes.includes(key))
						.onChange(async (value) => {
							if (value) {
								// Add the interval to the selected intervals list
								this.plugin.settings.chords.settings.selectedNotes.push(key);
							} else {
								// Remove the interval from the selected intervals list
								const index = this.plugin.settings.chords.settings.selectedNotes.indexOf(key);
								if (index !== -1) {
									this.plugin.settings.chords.settings.selectedNotes.splice(index, 1);
								}
							}
							await this.plugin.saveSettings();
						}));
			}
		}

		// Add a heading for Options
		containerEl.createEl('h3', { text: 'Options' });

		new Setting(containerEl)
			.setName('Play harmonically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.chords.settings.isHarmonic)
				.onChange(async (value) => {
					this.plugin.settings.chords.settings.isHarmonic = value

					await this.plugin.saveSettings();
				}));

		// Add UI for the number of exercises option
		new Setting(containerEl)
			.setName('Number of Exercises')
			.setDesc('Set the number of exercises per practice')
			.addText(text => text
				.setPlaceholder('Enter a number')
				.setValue(String(this.plugin.settings.chords.settings.numExercises))
				.onChange(async (value) => {
					const numExercises = parseInt(value, 10);
					if (!isNaN(numExercises) && numExercises > 0) {
						this.plugin.settings.chords.settings.numExercises = numExercises;
						await this.plugin.saveSettings();
					}
				}));
	}
}
