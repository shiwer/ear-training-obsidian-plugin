import { App, Plugin } from 'obsidian';
import EarTrainingSettingTab from './settings';
import EarTrainingModal from './modal';
import { intervalMap } from './constants';


interface EarTrainingSettings {
	selectedIntervals: List<string>,
	mode : string,
	numExercises: number
}

const DEFAULT_SETTINGS: EarTrainingSettings = {
	selectedIntervals: ['minor-second'],
	mode: 'oam',
	numExercises: 10
}

export default class EarTrainingPlugin extends Plugin {
	settings: EarTrainingSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		 const earTrainingIcon = this.addRibbonIcon('music', 'Ear Training', async () => {
            // Open the ear training modal
            new EarTrainingModal(this.app, this).open();
        });


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-ear-training',
			name: 'Make Practice',
			callback: () => {
				// Open the ear training modal
            	new EarTrainingModal(this.app, this).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'ear-training-editor-command',
			name: 'Ear training editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Ear Training Editor Command');
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new EarTrainingSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		console.log('loading settings :', this.settings);
	}

	async saveSettings() {
		console.log('saving settings : ', this.settings);
		await this.saveData(this.settings);
	}
}
