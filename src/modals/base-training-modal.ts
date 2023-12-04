// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { Exercise, BestScoreData } from './../utils/constants';
import { Note } from './../utils/audio-utils';
import { MistakeTracker } from './../models/mistakes';
import { NotePlayer } from './../models/note-players';
import EarTrainingResultModal from './result-modal';

export default class BaseTrainingModal extends Modal {
    protected name: string;
    private refreshCallback: () => void;

    plugin: EarTrainingPlugin;

    protected notePlayer: NotePlayer;
    protected playedNotes: string | null = null;
    protected selectedNotes: string | null = null; // To store the currently selected notes
    private rootNote: Note | null = null;

    private practiceCount: number = 0; // To keep track of the number of exercises done
    private selectedNotesButton:HTMLButtonElement | null = null; // To store the selected notes button
    
    private dynamicHeader:HTMLButtonElement | null = null; // To update the header
    private validateButton:HTMLButtonElement | null = null;

    private mistakeTracker: MistakeTracker | null = null;
    private score: number = 0;

    protected getButtonText(id:string): string {
        console.log('implement button text');
    }

    protected customReset(): void {
        console.log('implement custom reset');
    }

    private createButton(index: number, note:string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = 'noteButton-' + index;
        button.innerText = this.getButtonText(note);
        button.addEventListener('click', onClick);
        return button;
    }



 	// Method to start a new practice session
    private startPractice(): void {
        this.customReset();
        this.selectedNotes = null;
        this.validateButton.components[0].buttonEl.disabled = true;
        this.playedNotes = this.getRandomNotes();
        if(this.selectedNotesButton) {
            // Remove focus from the button
            this.selectedNotesButton.blur();
            this.selectedNotesButton.style.backgroundColor = '';
            this.selectedNotesButton.style.color = '';
        }
		this.selectedNotesButton = null;
        this.rootNote = this.notePlayer.generateRootNote();
		
        // Increment the practice count
        this.practiceCount++;
        this.dynamicHeader.textContent = this.headerText(this.practiceCount, this.exercise.settings.numExercises);
        this.notePlayer.playNotes(this.playedNotes, this.rootNote);
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
            this.mistakeTracker.recordMistake(this.playedNotes, this.selectedNotes, this.rootNote);
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
            this.updateBestScore(this.exercise.exerciseId, this.score);
            // update chapter page
            this.refreshCallback();
            new EarTrainingResultModal(this.app, this.notePlayer, this.score, this.exercise.settings.numExercises, this.mistakeTracker).open();
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

    constructor(app: App, plugin: EarTrainingPlugin, protected name: string, protected exercise: Exercise, refreshCallback: () => void, notePlayer: NotePlayer) {
        super(app, plugin);
        this.name = name;
        this.plugin = plugin;
        this.refreshCallback = refreshCallback;
        this.notePlayer = notePlayer;
        this.mistakeTracker = new MistakeTracker();
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');


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
                    this.notePlayer.playNotes(this.playedNotes, this.rootNote);
                }));

        this.contentEl.createEl('h4', { text: 'Select the correct answer.' });


        const container = document.createElement('div');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
        container.style.gridGap = '10px';
        container.style.justifyItems = 'inherit';

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (let i = 0; i < this.exercise.settings.selectedNotes.length; i++) {
            const notes = this.exercise.settings.selectedNotes[i];

            const notesButton = this.createButton(i, notes, () => {
                // Code to run when button one is clicked
                // Remove the highlight from the previously selected button
                if(this.validateButton.components[0].buttonEl.disabled) {
                    this.validateButton.components[0].buttonEl.disabled = false;
                }

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
        this.validateButton = new Setting(this.contentEl)
            .setName('Validate')
            .setDesc('Click to validate your answer')
            .addButton(button => button
                .setButtonText('Validate')
                .onClick(() => {
                    // Validate the answer
                    this.validateAnswer();
                }));

        // Listen for the keydown event on the description container
        this.contentEl.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (key === ' ' || key === 'enter') {
                // Spacebar or Enter key pressed, validate the answer
                this.validateAnswer();
                event.stopPropagation();

            } else if (key === 'backspace') {
                this.notePlayer.playNotes(this.playedNotes, this.rootNote);
                event.stopPropagation();
            } else {

                if(event.code.startsWith('Digit')) {
                    const keyNumb = event.code.replace('Digit', '');
                    // If the pressed key corresponds to a note button, trigger its click event

                    if (keyNumb !== undefined) {
                        const noteButton = document.getElementById(`noteButton-${keyNumb - 1}`);
                        if (noteButton) {
                            noteButton.click();
                        }
                    }
                }
                
            }

        });

        this.startPractice();
		
    }

    onClose() {
        const { contentEl } = this;
        this.mistakeTracker.clearMistakes();
        contentEl.empty();
    }
}
