import { App, PluginSettingTab, Setting } from 'obsidian';
import { intervalMap, chordsMap } from './utils/constants';
import { validateFormat, showErrorTooltip, removeErrorTooltip } from './utils/validation';
import EarTrainingPlugin from './main'

export default class EarTrainingSettingTab extends PluginSettingTab {

	constructor(app: App, private plugin: EarTrainingPlugin) {
		super(app, plugin);
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        // Add UI for the mode option
        new Setting(containerEl)
            .setName('Save practices')
            .setDesc('Set to true if you want your ear training to be saved at the end of every practices.')
           	.addToggle(toggle => toggle
				.setValue(this.plugin.settings.saveParameters.autoSave)
				.onChange(async (value) => {
					this.plugin.settings.saveParameters.autoSave = value

					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Folder Path')
              .setDesc('Set a custom folder path for saving practices.')
              .addText(text => text
                .setValue(this.plugin.settings.saveParameters.folderPath)
                .onChange(async (value) => {
                  this.plugin.settings.saveParameters.folderPath = value;
                  await this.plugin.saveSettings();
                }));


		new Setting(containerEl)
			.setName('Filename Format')
		  	.setDesc('Set a custom filename format.')
		  	.addText(text => text
                .setValue(this.plugin.settings.saveParameters.filenameFormat)
                .onChange(async (value) => {
                	const validationResult = validateFormat(value);
					if (validationResult === "") {
						// Validation passed, update settings and save
						removeErrorTooltip(text.inputEl as any);
						this.plugin.settings.saveParameters.filenameFormat = value;
						await this.plugin.saveSettings();
					} else {
						// Validation failed, show error message and mark setting as invalid
						 showErrorTooltip(text.inputEl as any, validationResult);
					}
                }));
	}
}
