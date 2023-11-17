// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { intervalMap, semitoneIntervals } from './constants';
import { playNotes, getBaseFrequency } from './audio-utils';
import EarTrainingResultModal from './result-modal';

export default class EarTrainingModal extends Modal {

	private playedInterval: string | null = null; // To store the currently played interval
    private selectedInterval: string | null = null; // To store the currently selected interval
    private practiceCount: number = 0; // To keep track of the number of exercises done
	private isAscending: boolean | null = null;
	private baseFrequency: number| null = null;
    private selectedIntervalButton: Setting | null = null; // To store the selected interval button

    private mistakes: Record<string, Record<string, number>> = {};
    private score: number = 0;

 	// Method to start a new practice session
    private startPractice(): void {
        // Pick a random interval from the selected list
        this.playedInterval = this.getRandomInterval();
		this.isAscending = this.plugin.settings.mode === 'oam' || (this.plugin.settings.mode === 'all' && Math.random() < 0.5);
		this.selectedIntervalButton = null;
        this.baseFrequency = getBaseFrequency();

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
    private async playInterval(): void {
        if (this.playedInterval) {
            // Display a notice with the interval

            const semitoneInterval = semitoneIntervals[this.playedInterval];
            const secondFrequency = this.isAscending ? this.baseFrequency * Math.pow(2, semitoneInterval / 12) : this.baseFrequency / Math.pow(2, semitoneInterval / 12);

            await playNotes(this.baseFrequency, secondFrequency, this.isAscending);
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
