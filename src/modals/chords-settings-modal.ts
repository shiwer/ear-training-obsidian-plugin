// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { triadsMap, tetradsMap } from './../utils/constants';
import { noteNames } from './../utils/audio-utils';
import EarTrainingPlugin from './../main';

export default class ChordsSettingsModal extends Modal {

    constructor(app: App, private plugin: EarTrainingPlugin) {
        super(app);
    }

    private createAccordion(title: string, map: Record<string, string>): HTMLElement {
    	const accordionItem = document.createElement('div');
		accordionItem.classList.add('collapse-item');

		// Create the accordion item title
		const titleElement = document.createElement('div');
		titleElement.classList.add('collapse-item-title');
		titleElement.textContent = title;
		titleElement.addEventListener('click', () => {
			accordionItem.classList.toggle('open');
		});

		const contentElement = document.createElement('div');
		contentElement.classList.add('collapse-item-content');
		// Add UI for interval selection using toggle buttons
		for (const key in map) {
			if (Object.prototype.hasOwnProperty.call(map, key)) {
				new Setting(contentElement)
					.setName(map[key])
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

		// Append title and content to the accordion item
		accordionItem.appendChild(titleElement);
		accordionItem.appendChild(contentElement);

		return accordionItem;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

		contentEl.createEl('h2', { text: 'Chords' });
                
		contentEl.createEl('h3', { text: 'Select chords' });

		const collapsableTriads = this.createAccordion('Triads', triadsMap);
		contentEl.appendChild(collapsableTriads);

		const collapsableTetrads = this.createAccordion('Tetrads', tetradsMap);
		contentEl.appendChild(collapsableTetrads);

		// Add a heading for Options
		contentEl.createEl('h3', { text: 'Options' });

		new Setting(contentEl)
			.setName('Play harmonically')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.chords.settings.isHarmonic)
				.onChange(async (value) => {
					this.plugin.settings.chords.settings.isHarmonic = value

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
				dropdown.setValue(this.plugin.settings.chords.settings.tonality); // Set the initial value based on the loaded setting
				dropdown.onChange(async (value) => {
					this.plugin.settings.chords.settings.tonality = value

					await this.plugin.saveSettings();
				});
			});

		// Add UI for the number of exercises option
		new Setting(contentEl)
			.setName('Number of exercises')
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

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
