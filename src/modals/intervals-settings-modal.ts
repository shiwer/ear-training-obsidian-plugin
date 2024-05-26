// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { intervalMap, modeMap, ExerciseMode } from './../utils/constants';
import { noteNames } from './../utils/audio-utils';
import EarTrainingPlugin from './../main';

export default class IntervalsSettingsModal extends Modal {

    constructor(app: App, private plugin: EarTrainingPlugin) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
		contentEl.createEl('h2', { text: 'Intervals' });
                
		contentEl.createEl('h3', { text: 'Select intervals' });

		// Add UI for interval selection using toggle buttons
		for (const key in intervalMap) {
			if (Object.prototype.hasOwnProperty.call(intervalMap, key)) {
				new Setting(contentEl)
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
		contentEl.createEl('h3', { text: 'Options' });

		// Add UI for the mode option
		new Setting(contentEl)
			.setName('Play Mode')
			.setDesc('Select the ear training play mode option')
			.addDropdown(dropdown => dropdown
				.addOptions(modeMap)
				.setValue(this.plugin.settings.intervals.settings.playMode)
				.onChange(async (value) => {
					this.plugin.settings.intervals.settings.playMode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(contentEl)
			.setName('Mode')
			.setDesc('Pick the training mode')
			.addDropdown((dropdown) => {
				// using values to avoid issues later
				Object.values(ExerciseMode).forEach((value) => {
						dropdown.addOption(value, value);
				})
				dropdown.setValue(this.plugin.settings.intervals.settings.mode); // Set the initial value based on the loaded setting

				dropdown.onChange(async (value) => {
					this.plugin.settings.intervals.settings.mode = value as ExerciseMode

					await this.plugin.saveSettings();
				});
			});


		new Setting(contentEl)
			.setName('Set a tonality')
			.setDesc('Pick all or a specific tonality note')
			.addDropdown((dropdown) => {
				dropdown.addOption('all', 'all');
				for (const note of noteNames) {
					dropdown.addOption(note, note);
				}
				dropdown.setValue(this.plugin.settings.intervals.settings.tonality); // Set the initial value based on the loaded setting
				dropdown.onChange(async (value) => {
					this.plugin.settings.intervals.settings.tonality = value

					await this.plugin.saveSettings();
				});
			});
	
		// Add UI for the number of exercises option
		new Setting(contentEl)
			.setName('Number of exercises')
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

    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
