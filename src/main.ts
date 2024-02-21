import { App, Plugin, normalizePath } from 'obsidian';
import { AudioPlayer } from './utils/audio';
import { AudioUtils } from './utils/audio-utils';
import EarTrainingSettingTab from './settings';
import MenuModal from './modals/menu-modal';
import { intervalMap, EarTrainingGlobalSettings, BestScoreData, DEFAULT_SETTINGS } from './utils/constants';

export default class EarTrainingPlugin extends Plugin {
	settings: EarTrainingGlobalSettings = DEFAULT_SETTINGS;
    bestScores: BestScoreData = {};
    allInformations: {
    	settings: EarTrainingGlobalSettings,
    	bestScores: BestScoreData
    }

	async onload() {
		await this.loadInformations();

        const baseDir = this.app.vault.adapter.getBasePath();
        const pluginDir = baseDir + '/' + this.manifest.dir +'/public';
        const audioUtils = new AudioUtils(new AudioPlayer(pluginDir));

		// This creates an icon in the left ribbon.
		 const earTrainingIcon = this.addRibbonIcon('music', 'Ear Training', async () => {
            // Open the ear training modal
            new MenuModal(this.app, this, audioUtils).open();
        });


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-ear-training',
			name: 'Make Practice',
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
    			this.bestScores = data.bestScores || {};
    		}
    		this.allInformations = data || {};
    	});
    }

	async saveSettings() {
		this.allInformations.settings = this.settings;
		await this.saveData(this.allInformations);
	}
}
