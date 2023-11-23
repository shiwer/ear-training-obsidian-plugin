// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { Exercise, BestScoreData } from './../utils/constants';
import { AudioUtils, Note } from './../utils/audio-utils';
import EarTrainingResultModal from './result-modal';

export default class BaseTrainingModal extends Modal {
    protected name: string;

    protected audioUtils: AudioUtils| null = null;
    plugin: EarTrainingPlugin;

	protected playedNotes: string | null = null; // To store the currently played notes
    protected selectedNotes: string | null = null; // To store the currently selected notes
    protected rootNote: Note | null = null;


    private practiceCount: number = 0; // To keep track of the number of exercises done
    private selectedNotesButton:HTMLButtonElement | null = null; // To store the selected notes button
    
    private dynamicHeader:HTMLButtonElement | null = null; // To update the header

    private mistakes: Record<string, Record<string, number>> = {};
    private score: number = 0;

    protected getButtonText(id:string): string {
        console.log('implement button text');
    }

    protected customReset(): void {
        console.log('implement custom reset');
    }

    private createButton(id:string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = this.getButtonText(id);
        button.addEventListener('click', onClick);
        return button;
    }



 	// Method to start a new practice session
    private startPractice(): void {
        this.customReset();
        this.selectedNotes = null;
        this.playedNotes = this.getRandomNotes();
        if(this.selectedNotesButton) {
            this.selectedNotesButton.style.backgroundColor = '';
            this.selectedNotesButton.style.color = '';
        }
		this.selectedNotesButton = null;
        this.rootNote = this.audioUtils.getRootNote();

		
        // Increment the practice count
        this.practiceCount++;
        this.dynamicHeader.textContent = this.headerText(this.practiceCount, this.exercise.settings.numExercises);
        this.playNotes();
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

    private getRandomNotes(): string {
        const randomIndex = Math.floor(Math.random() * this.exercise.settings.selectedNotes.length);
        return this.exercise.settings.selectedNotes[randomIndex];
    }

    protected async playNotes(): void {
        // To be implemented
        console.log('you need to implement this method');
    }

    protected displayError() {
        // to be implemented
        console.log('you need to implement this method');
    }

    // Method to validate the user's answer
    private validateAnswer(): void {
        // Logic for validating the answer
        if(!this.selectedNotes) {
        	new Notice(`Please select an ${this.name} !`);
        	return;
		} 
		const isCorrect = this.playedNotes === this.selectedNotes;

		if (isCorrect) {
            // Update score for correct answer
            this.score++;
        } else {
            this.displayError();

            // Update mistakes for incorrect answer
            if (!this.mistakes[this.playedNotes]) {
                this.mistakes[this.playedNotes] = {};
            }

            if (!this.mistakes[this.playedNotes][this.selectedNotes]) {
                this.mistakes[this.playedNotes][this.selectedNotes] = 1;
            } else {
                this.mistakes[this.playedNotes][this.selectedNotes]++;
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

    constructor(app: App, plugin: EarTrainingPlugin, protected name: string, protected exercise: Exercise, audioUtils: AudioUtils) {
        super(app, plugin);
        this.name = name;
        this.plugin = plugin;
        this.audioUtils = audioUtils;
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        this.practiceCount = 0;
        this.mistakes = {};
        this.score = 0;

        // Add a heading
        this.dynamicHeader = this.contentEl.createEl('h2', { text: this.headerText(this.practiceCount, this.exercise.settings.numExercises) });
        // Display a button to play the notes
        new Setting(this.contentEl)
            .setName('Play Notes')
            .setDesc('Click to play the notes')
            .addButton(button => button
                .setButtonText('Play Notes')
                .onClick(() => {
                    // Play the notes
                    this.playNotes();
                }));

        this.contentEl.createEl('h4', { text: 'Select the correct answer.' });


        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
        container.style.gridGap = '10px';
        container.style.justifyItems = 'inherit';

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (const notes of this.exercise.settings.selectedNotes) {

            const notesButton = this.createButton(notes, () => {
                // Code to run when button one is clicked
                // Remove the highlight from the previously selected button
                if (this.selectedNotesButton) {
                    this.selectedNotesButton.style.backgroundColor = '';
                    this.selectedNotesButton.style.color = '';
                }

                // Set the selected notes
                this.selectedNotesButton = notesButton;
                this.selectedNotes = notes;

                // Highlight the selected button with a green color
                if (this.selectedNotesButton) {
                    this.selectedNotesButton.style.backgroundColor = 'lightgreen';
                    this.selectedNotesButton.style.color = "white"
                }
            });
            container.appendChild(notesButton);
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
