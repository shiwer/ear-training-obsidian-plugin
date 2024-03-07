import { App, Plugin, normalizePath } from 'obsidian';
import Migration from './migration/migration'
import { AudioPlayer } from './utils/audio';
import { AudioUtils } from './utils/audio-utils';
import EarTrainingSettingTab from './settings';
import MenuModal from './modals/menu-modal';
import { intervalMap, EarTrainingGlobalSettings, BestScoreData, DEFAULT_SETTINGS } from './utils/constants';

export default class EarTrainingPlugin extends Plugin {
	version: string;
	settings: EarTrainingGlobalSettings = DEFAULT_SETTINGS;
    allInformations: {
    	version: string
    	settings: EarTrainingGlobalSettings
    }

	async onload() {
		await this.loadInformations();
		if(this.allInformations.version != this.manifest.version) {
			const migration = new Migration(this);
			await migration.migrateData(this.allInformations.version);

			this.allInformations.version = this.manifest.version;
			await this.saveData(this.allInformations);
		}

        const audioUtils = new AudioUtils(new AudioPlayer());

		// This creates an icon in the left ribbon.
		 const earTrainingIcon = this.addRibbonIcon('music', 'Ear training', async () => {
            // Open the ear training modal
            new MenuModal(this.app, this, audioUtils).open();
        });


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-ear-training',
			name: 'Make practice',
			callback: () => {
				// Open the ear training modal
            	new MenuModal(this.app, this, audioUtils).open();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new EarTrainingSettingTab(this.app, this));
	}

	onunload() {

	}

    async loadInformations() {
    	await this.loadData().then(data => {
    		if(data) {
    			this.settings = Object.assign({}, DEFAULT_SETTINGS, data.settings);
    			// in the first release, "version" was not set
    			this.version = data.version || "0.0.0";
    		}

    		this.allInformations = {
				version: this.version || this.manifest.version,
				settings: this.settings || DEFAULT_SETTINGS
			}
    	});
    }

	async saveSettings() {
		this.allInformations.settings = this.settings;
		await this.saveData(this.allInformations);
	}
}
