// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting, TFile, FileSystemAdapter } from 'obsidian';
import { Exercise, BestScoreData, modeMap } from './../utils/constants';
import { Note, noteNames } from './../utils/audio-utils';
import { ScoreTracker } from './../models/score-recorder';
import { FileSaver } from './../models/file-saver';
import { NotePlayer } from './../models/note-players';
import EarTrainingResultModal from './result-modal';
// refactor

export default class BaseTrainingModal extends Modal {

    protected notePlayer: NotePlayer;
    protected playedNotes: string | null = null;
    private selectedNotes: string | null = null; // To store the currently selected notes
    private rootNote: Note | null = null;

    private practiceCount: number = 0; // To keep track of the number of exercises done
    private selectedNotesButton:HTMLButtonElement | null = null; // To store the selected notes button
    
    private dynamicHeader:HTMLButtonElement | null = null; // To update the header
    private validateButton:HTMLButtonElement | null = null;

    private scoreTracker: ScoreTracker | null = null;
    private fileSaver: FileSaver | null = null;
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
		let pitch = noteNames.indexOf(this.exercise.settings.tonality);
		if(pitch == -1) {
        	this.rootNote = this.notePlayer.generateRootNote(this.playedNotes);
		} else {

			this.rootNote = this.notePlayer.getRootFromLowestNote(this.playedNotes, pitch)
		}

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
		// update scoreTracker
		this.scoreTracker.recordScoreInfo(this.playedNotes, this.selectedNotes, this.rootNote);

		let isCorrect = this.playedNotes === this.selectedNotes;

		if (isCorrect) {
            // Update score for correct answer
            this.score++;
        } else {
            this.displayError();
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
            if(this.plugin.settings.saveParameters.autoSave) {
				this.fileSaver.saveScoreInfo(this.scoreTracker.getHeaderInfo(), this.scoreTracker.getScoreInfo());
			}

            new EarTrainingResultModal(this.app, this.notePlayer, this.score, this.exercise.settings.numExercises, this.scoreTracker).open();
            this.close();
        }
    }

    private headerText(practiceCount: number, totalExercises: number) {
        return `Exercise ${practiceCount} / ${totalExercises}`;
    }

    constructor(private app: App, private plugin: EarTrainingPlugin, private name: string, protected exercise: Exercise, protected notePlayer: NotePlayer) {
        super(app, plugin);
        // TODO : refactor this crap, mode refers to inconsistent values
        const mode = exercise.settings.isHarmonic ? 'harmonic' : exercise.settings.mode === 'chords' ? 'ascending' : modeMap[exercise.settings.mode];
        const tonalities = exercise.settings.tonality !== "all" ? [exercise.settings.tonality] : noteNames;
        this.scoreTracker = new ScoreTracker(name, mode, tonalities, exercise.settings.selectedNotes);
        this.fileSaver = new FileSaver(app, this.plugin.settings.saveParameters.folderPath, this.plugin.settings.saveParameters.filenameFormat)
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
                event.stopPropagation();
                this.validateAnswer();
            } else if (key === 'backspace' || key === '+') {
                this.notePlayer.playNotes(this.playedNotes, this.rootNote);
                event.stopPropagation();
            } else {
				// move selections
                if(event.code.startsWith('Digit') || event.code.startsWith('Numpad')) {
                    let keyNumb = event.code.replace('Numpad', '');
					if(event.code.startsWith('Digit')) {
						keyNumb =  event.code.replace('Digit', '');
					}
                    // If the pressed key corresponds to a note button, trigger its click event
					let noteNumb: number;
                    if (keyNumb !== undefined && Number.isInteger(Number(keyNumb))) {
                    	noteNumb = keyNumb - 1;
                    } else if(event.code === 'NumpadMultiply' || event.code === 'NumpadDivide') {
						const currentNumber = Number(this.selectedNotesButton.id.replace('noteButton-', ''));
						if(event.code === 'NumpadDivide' && currentNumber < this.exercise.settings.selectedNotes.length) {
							noteNumb = currentNumber - 1;
						} else if(event.code === 'NumpadMultiply' && currentNumber >= 0) {
							noteNumb = currentNumber + 1;
						}
					}
					if(noteNumb !== undefined) {
						const noteButton = document.getElementById(`noteButton-${noteNumb}`);
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
        this.scoreTracker.clearScoreInfo();
        contentEl.empty();
    }
}
