// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { intervalMap, semitoneIntervals, Exercise, BestScoreData} from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import EarTrainingResultModal from './result-modal';

export default class EarTrainingModal extends Modal {
    private audioUtils: AudioUtils| null = null;
    plugin: EarTrainingPlugin;

	private playedInterval: string | null = null; // To store the currently played interval
    private selectedInterval: string | null = null; // To store the currently selected interval
    private practiceCount: number = 0; // To keep track of the number of exercises done
	private isAscending: boolean | null = null;
	private baseNote: Note | null = null;
    private selectedIntervalButton:HTMLButtonElement | null = null; // To store the selected interval button
    
    private dynamicHeader:HTMLButtonElement | null = null; // To update the header

    private mistakes: Record<string, Record<string, number>> = {};
    private score: number = 0;

    private createButton(id:string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = intervalMap[id];
        button.addEventListener('click', onClick);
        return button;
    }

 	// Method to start a new practice session
    private startPractice(): void {
        // Pick a random interval from the selected list
        this.selectedInterval = null;
        this.playedInterval = this.getRandomInterval();
		this.isAscending = this.exercise.settings.mode === 'oam' || (this.exercise.settings.mode === 'aad' && Math.random() < 0.5);
        if(this.selectedIntervalButton) {
            this.selectedIntervalButton.style.backgroundColor = '';
            this.selectedIntervalButton.style.color = '';
        }
		this.selectedIntervalButton = null;
        this.baseNote = this.audioUtils.getBaseNote();

		
        // Increment the practice count
        this.practiceCount++;
        this.dynamicHeader.textContent = this.headerText(this.practiceCount, this.exercise.settings.numExercises);
        this.playInterval();
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

            const secondNote: Note = this.audioUtils.getNextNote(this.baseNote, semitoneInterval, this.isAscending);
            await this.audioUtils.playNotes(this.exercise.isHarmonic, this.baseNote, secondNote);
        }
    }

 	// Method to pick a random interval from the selected list
    private getRandomInterval(): string {
        const randomIndex = Math.floor(Math.random() * this.exercise.settings.selectedIntervals.length);
        return this.exercise.settings.selectedIntervals[randomIndex];
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
            new Notice(`The interval played was : ${intervalMap[this.playedInterval]}`);

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
        if (this.practiceCount < this.exercise.settings.numExercises) {
            // Start a new practice
            this.startPractice();
        } else {
            // Practice is completed
            this.updateBestScore(this.exercise.exerciseId, this.score)
            new EarTrainingResultModal(this.app, this.score, this.exercise.settings.numExercises, this.mistakes).open();
            this.close();
        }
    }

    private updateBestScore(exerciseNumber: number, newScore: number): void {

        if (exerciseNumber > 0 && (!this.plugin.bestScores[exerciseNumber] || newScore > this.plugin.bestScores[exerciseNumber])) {
            this.plugin.bestScores[exerciseNumber] = newScore;

            // Save the updated scores to the DataAdapter
            this.plugin.saveBestScores();
        }
    }

    private headerText(practiceCount: number, totalExercises: number) {
        return `Exercise ${practiceCount} / ${totalExercises}`;
    }

    constructor(app: App, plugin: EarTrainingPlugin, private exercise: Exercise, audioUtils: AudioUtils) {
        super(app, plugin);
        this.plugin = plugin;
        this.audioUtils = audioUtils;
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        this.practiceCount = 0;
        this.mistakes = {};
        this.score = 0;

        // Add a heading for Intervals
        this.dynamicHeader = this.contentEl.createEl('h2', { text: this.headerText(this.practiceCount, this.exercise.settings.numExercises) });
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


        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
        container.style.gridGap = '10px';
        container.style.justifyItems = 'inherit';

        // Display the selected interval list as clickable buttons (dropdown-like)
        for (const interval of this.exercise.settings.selectedIntervals) {

            const intervalButton = this.createButton(interval, () => {
                // Code to run when button one is clicked
                // Remove the highlight from the previously selected button
                if (this.selectedIntervalButton) {
                    this.selectedIntervalButton.style.backgroundColor = '';
                    this.selectedIntervalButton.style.color = '';
                }

                // Set the selected interval
                this.selectedIntervalButton = intervalButton;
                this.selectedInterval = interval;

                // Highlight the selected button with a green color
                if (this.selectedIntervalButton) {
                    this.selectedIntervalButton.style.backgroundColor = 'lightgreen';
                    this.selectedIntervalButton.style.color = "white"
                }
            });
            container.appendChild(intervalButton);
        }

        this.contentEl.appendChild(container);
        this.addSpacer();

        // Display a button to validate the answer
        const validateButton = new Setting(this.contentEl)
            .setName('Validate')
            .setDesc('Click to validate your answer')
            .addButton(button => button
                .setButtonText('Validate')
                .onClick(() => {
                    // Validate the answer
                    this.validateAnswer();
                }));

        // Listen for the keydown event on the description container
        validateButton.components[0].buttonEl.addEventListener('keydown', (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
                // Spacebar or Enter key pressed, validate the answer
                this.validateAnswer();
            }
        });

        this.startPractice();
		
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
