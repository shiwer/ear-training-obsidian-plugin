// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { intervalMap, modeMap } from './../utils/constants';
import { noteNames } from './../utils/audio-utils';

export default class MenuModal extends Modal {

    constructor(app: App, private plugin: EarTrainingPlugin) {
        super(app, plugin);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
		contentEl.createEl('h2', { text: 'Intervals' });
                
		contentEl.createEl('h3', { text: 'Select Intervals' });

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
			.setName('Mode')
			.setDesc('Select the ear training mode')
			.addDropdown(dropdown => dropdown
				.addOptions(modeMap)
				.setValue(this.plugin.settings.intervals.settings.mode)
				.onChange(async (value) => {
					this.plugin.settings.intervals.settings.mode = value;
					await this.plugin.saveSettings();
				}));

		new Setting(contentEl)
				.setName('Play harmonically')
				.addToggle(toggle => toggle
					.setValue(this.plugin.settings.intervals.settings.isHarmonic)
					.onChange(async (value) => {
						this.plugin.settings.intervals.settings.isHarmonic = value
	
						await this.plugin.saveSettings();
					}));

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

    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
