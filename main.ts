import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

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

// Interval map with kebab case keys and English labels
const intervalMap: Record<string, string> = {
	'minor-second': 'Minor 2nd',
	'major-second': 'Major 2nd',
	'minor-third': 'Minor 3rd',
	'major-third': 'Major 3rd',
	'perfect-fourth': 'Perfect 4th',
	'augmented-fourth': 'Augmented 4th',
	'perfect-fifth': 'Perfect 5th',
	'minor-sixth': 'Minor 6th',
	'major-sixth': 'Major 6th',
	'minor-seventh': 'Minor 7th',
	'major-seventh': 'Major 7th',
};

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

class EarTrainingModal extends Modal {

	private playedInterval: string | null = null; // To store the currently played interval
    private selectedInterval: string | null = null; // To store the currently selected interval
    private practiceCount: number = 0; // To keep track of the number of exercises done
	private isAscending: boolean | null = null;
	private selectedIntervalButton: Setting | null = null; // To store the selected interval button

    private mistakes: Record<string, Record<string, number>> = {};
    private score: number = 0;

 	// Method to start a new practice session
    private startPractice(): void {
        // Pick a random interval from the selected list
        this.playedInterval = this.getRandomInterval();
		this.isAscending = this.plugin.settings.mode === 'oam' || (this.plugin.settings.mode === 'all' && Math.random() < 0.5);
		this.selectedIntervalButton = null;


		 // Add a heading for Intervals
        this.contentEl.createEl('h2', { text: `Exercice ${this.practiceCount + 1} / ${this.plugin.settings.numExercises}` });
        // Display a button to play the interval
        new Setting(this.contentEl)
            .setName('Play Interval')
            .setDesc('Click to play the interval')
            .addButton(button => button
                .setButtonText('Play Interval')
                .onClick(() => {
                    // Play the interval
                    this.playInterval();
                }));

        this.contentEl.createEl('h4', { text: 'Select the correct interval.' });

        // Display the selected interval list as clickable buttons (dropdown-like)
        for (const interval of this.plugin.settings.selectedIntervals) {
            const intervalButton = new Setting(this.contentEl)
                .setName(intervalMap[interval])
                .addButton(button => button
                    .setButtonText('Select')
                    .onClick(() => {
                         // Remove the highlight from the previously selected button
                        if (this.selectedIntervalButton) {
                            this.selectedIntervalButton.settingEl.style.backgroundColor = '';
                        }

                        // Set the selected interval
                        this.selectedIntervalButton = intervalButton;
                        this.selectedInterval = interval;

                        // Highlight the selected button with a green color
                        if (this.selectedIntervalButton) {
                            this.selectedIntervalButton.settingEl.style.backgroundColor = 'lightgreen';
                        }
                    }));
        }

        this.addSpacer();

        // Display a button to validate the answer
        new Setting(this.contentEl)
            .setName('Validate')
            .setDesc('Click to validate your answer')
            .addButton(button => button
                .setButtonText('Validate')
                .onClick(() => {
                    // Validate the answer
                    this.contentEl.empty();
                    this.validateAnswer();
                }));

        // Increment the practice count
        this.practiceCount++;
    }

     // Method to add a visual transition effect
    private addTransitionEffect(backgroundColor: string): void {
        const contentEl = this.contentEl;
        
        // Save the current background color
        const originalBackgroundColor = '';

        // Add a transition effect (e.g., change background color to yellow briefly)
        contentEl.style.backgroundColor = backgroundColor;
        setTimeout(() => {
            // Restore the original background color after a short delay
            contentEl.style.backgroundColor = originalBackgroundColor;
        }, 300); // Adjust the duration of the effect (in milliseconds) as needed
    }

    private addSpacer(): void {
        const spacerEl = document.createElement('div');
        spacerEl.style.height = '10px'; // Adjust the height as needed
        this.contentEl.appendChild(spacerEl);
    }

    // Method to play the interval
    private playInterval(): void {
        if (this.playedInterval) {
            // Display a notice with the interval
            new Notice(`Interval: ${this.playedInterval} is ascending ${this.isAscending}` );
        }
    }

 	// Method to pick a random interval from the selected list
    private getRandomInterval(): string {
        const randomIndex = Math.floor(Math.random() * this.plugin.settings.selectedIntervals.length);
        return this.plugin.settings.selectedIntervals[randomIndex];
    }

     // Method to validate the user's answer
    private validateAnswer(): void {
        // Logic for validating the answer
        if(!this.selectedInterval) {
        	new Notice('Please select an interval !');
        	return;
		} 
		const isCorrect = this.playedInterval === this.selectedInterval;

		if (isCorrect) {
            // Update score for correct answer
            this.score++;
        } else {
            // Update mistakes for incorrect answer
            if (!this.mistakes[this.playedInterval]) {
                this.mistakes[this.playedInterval] = {};
            }

            if (!this.mistakes[this.playedInterval][this.selectedInterval]) {
                this.mistakes[this.playedInterval][this.selectedInterval] = 1;
            } else {
                this.mistakes[this.playedInterval][this.selectedInterval]++;
            }
        }

		// Determine the background color based on the correctness of the answer
        const backgroundColor = isCorrect ? 'lightgreen' : 'lightcoral';
		// Add a visual effect to indicate the correctness of the answer
        this.addTransitionEffect(backgroundColor);

        // ...
        // Check if the practice should continue
        if (this.practiceCount < this.plugin.settings.numExercises) {
            // Start a new practice
            this.startPractice();
        } else {
            // Practice is completed
            new EarTrainingResultModal(this.app, this.score, this.plugin.settings.numExercises, this.mistakes).open();
            this.close();
        }
    }

    constructor(app: App, private plugin: EarTrainingPlugin) {
        super(app);
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();

		// Check if the selected intervals meet the requirement based on the mode
        if (
            (this.plugin.settings.mode === 'oam' || this.plugin.settings.mode === 'odm') &&
            this.plugin.settings.selectedIntervals.length < 2
        ) {
            new Notice('Please select at least 2 intervals for OAM or ODM mode.');
            return;
        } else if (this.plugin.settings.selectedIntervals.length < 1) {
            new Notice('Please select at least 1 interval.');
            return;
        }

        contentEl.createEl('h2', { text: 'Intervals Exercices' });

        // Display a button to start the practice session
        new Setting(contentEl)
            .setName('Start Practice')
            .setDesc('Click to start the ear training exercises')
            .addButton(button => button
                .setButtonText('Start Practice')
                .onClick(() => {
                    // Start the practice session
                    this.contentEl.empty();
                    this.startPractice();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class EarTrainingResultModal extends Modal {
    private score: number;
    private totalExercises: number;
    private mistakes: Record<string, Record<string, number>>;

    constructor(app: App, score: number, totalExercises: number, mistakes: Record<string, Record<string, number>>) {
        super(app);
        this.score = score;
        this.totalExercises = totalExercises;
        this.mistakes = mistakes;
    }

	onOpen() {
        const { contentEl } = this;

        // Display the score
        const scoreHeading = contentEl.createEl('h2');
        scoreHeading.innerText = `Score: ${this.score}/${this.totalExercises}`;

        // Display mistakes if there are any
        if (Object.keys(this.mistakes).length > 0) {
            const mistakesHeading = contentEl.createEl('h3');
            mistakesHeading.innerText = 'Mistakes';

            const mistakesList = contentEl.createEl('ul');
            for (const correctIntervalKey in this.mistakes) {
                if (Object.prototype.hasOwnProperty.call(this.mistakes, correctIntervalKey)) {
                    const correctIntervalLabel = intervalMap[correctIntervalKey]; // Retrieve the English label
                    const mistakeItem = mistakesList.createEl('li');
                    mistakeItem.innerText = `You mixed up ${correctIntervalLabel} with:`;

                    const subList = mistakeItem.createEl('ul');
                    for (const mistakenIntervalKey in this.mistakes[correctIntervalKey]) {
                        if (Object.prototype.hasOwnProperty.call(this.mistakes[correctIntervalKey], mistakenIntervalKey)) {
                            const mistakenIntervalLabel = intervalMap[mistakenIntervalKey]; // Retrieve the English label
                            const subItem = subList.createEl('li');
                            subItem.innerText = `${mistakenIntervalLabel} ${this.mistakes[correctIntervalKey][mistakenIntervalKey]} times.`;
                        }
                    }
                }
            }
        } else {
            // Display congratulations if no mistakes
            const congratsText = contentEl.createEl('p');
            congratsText.innerText = 'Congratulations! You have successfully completed your ear training.';
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}




class EarTrainingSettingTab extends PluginSettingTab {
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
                            console.log('saving ', this.plugin);
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
