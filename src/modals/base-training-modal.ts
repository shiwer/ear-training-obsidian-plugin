// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting, ButtonComponent, TFile, FileSystemAdapter } from 'obsidian';
import { Exercise, BestScoreData, modeMap, SaveParameters, ExerciseMode } from './../utils/constants';
import { Note, noteNames } from './../utils/audio-utils';
import { ScoreTracker } from './../models/score-recorder';
import { FileSaver } from './../models/file-saver';
import { NotePlayer } from './../models/note-players';
import EarTrainingResultModal from './result-modal';
// refactor

export default class BaseTrainingModal extends Modal {

    protected playedNotes: string = "";
    private selectedNotes: string = ""; // To store the currently selected notes
    private rootNote: Note;

    private practiceCount: number = 0; // To keep track of the number of exercises done
    private selectedNotesButton:HTMLButtonElement | null = null; // To store the selected notes button

    private dynamicHeader:HTMLElement | null = null; // To update the header
    private validateButton:HTMLButtonElement | null = null;
    private nextButton:HTMLButtonElement | null = null;

    private scoreTracker: ScoreTracker;
    private fileSaver: FileSaver;
    private score: number = 0;

    private replayError: boolean = false;

    protected getButtonText(id:string): string {
        console.log('implement button text');
        return "";
    }

    protected customReset(): void {
        console.log('implement custom reset');
    }

    private createButton(id: string, text:string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.addEventListener('click', onClick);
        return button;
    }



 	// Method to start a new practice session
    private async startPractice(): Promise<void> {
        this.customReset();
        this.replayError = false;
        this.selectedNotes = "";
        this.validateButton!.disabled = true;
        this.playedNotes = this.getRandomNotes();
        if(this.selectedNotesButton) {
            // Remove focus from the button
            this.selectedNotesButton.blur();
            this.selectedNotesButton.classList.remove('button-selected');
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
        this.dynamicHeader!.textContent = this.headerText(this.practiceCount, this.exercise.settings.numExercises);
        this.notePlayer.playNotes(this.playedNotes, this.rootNote);
        }

     // Method to add a visual transition effect
    private addTransitionEffect(isCorrect: boolean): void {
        const contentEl = this.contentEl;

        const buttonTransitionClass = isCorrect ? 'is-correct': 'is-incorrect';
        // Add a transition effect (e.g., change background color to yellow briefly)
        contentEl.classList.add(buttonTransitionClass);
        setTimeout(() => {
            // Restore the original background color after a short delay
            contentEl.classList.remove(buttonTransitionClass);
        }, 300); // Adjust the duration of the effect (in milliseconds) as needed
    }

    private addSpacer(): void {
        const spacerEl = document.createElement('div');
        spacerEl.classList.add('spacer');
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

		// Add a visual effect to indicate the correctness of the answer
        this.addTransitionEffect(isCorrect);

        // Stop on Error let the user replay the note to hear mistakes
        if(!isCorrect && !this.replayError && this.exercise.settings.mode === ExerciseMode.StopOnError) {
        	this.replayError = true;
        	this.validateButton!.classList.add('invisible');
        	this.nextButton!.classList.remove('invisible');
        	return;
        }

		this.endPracticeOrGoNext();
    }

    private endPracticeOrGoNext() {
    	 // ...
		// Check if the practice should continue
		if (this.practiceCount < this.exercise.settings.numExercises) {
			// Start a new practice
			this.startPractice();
		} else {
			this.fileSaver.saveScoreInfo(this.scoreTracker.getHeaderInfo(), this.scoreTracker.getScoreInfo());

			new EarTrainingResultModal(this.app, this.notePlayer, this.score, this.exercise.settings.numExercises, this.scoreTracker).open();
			this.close();
		}
    }

    private next() {
    	this.replayError = false;
		this.validateButton!.classList.remove('invisible');
		this.nextButton!.classList.add('invisible');

		this.endPracticeOrGoNext();
    }

    private headerText(practiceCount: number, totalExercises: number) {
        return `Exercise ${practiceCount} / ${totalExercises}`;
    }

    constructor(app: App, saveParameters: SaveParameters, private name: string, protected exercise: Exercise, protected notePlayer: NotePlayer) {
        super(app);
        const tonalities = exercise.settings.tonality !== "all" ? [exercise.settings.tonality] : noteNames;
        this.scoreTracker = new ScoreTracker(name, exercise.settings.playMode, exercise.settings.mode, tonalities, exercise.settings.selectedNotes);
        this.fileSaver = new FileSaver(app, saveParameters.autoSave,saveParameters.folderPath, saveParameters.filenameFormat)
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

        this.practiceCount = 0;
        this.score = 0;

        // Add a heading
        this.dynamicHeader = this.contentEl.createEl('h2', { text: this.headerText(this.practiceCount, this.exercise.settings.numExercises) });

        this.contentEl.createEl('h4', { text: 'Playing Mode : ' + this.exercise.settings.mode });
        // Display a button to play the notes
        new Setting(this.contentEl)
            .setName('Play notes')
            .setDesc('Click to play the notes')
            .addButton(button => button
                .setButtonText('Play notes')
                .onClick(async () => {
                    // Play the notes
                    this.notePlayer.playNotes(this.playedNotes, this.rootNote);
                }));

        this.contentEl.createEl('h4', { text: 'Select the correct answer.' });


        const container = document.createElement('div');
        container.classList.add('answer-list');

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (let i = 0; i < this.exercise.settings.selectedNotes.length; i++) {
            const notes = this.exercise.settings.selectedNotes[i];

            const notesButton = this.createButton('noteButton-' + i, this.getButtonText(notes), async () => {
                // Code to run when button one is clicked
                // Remove the highlight from the previously selected button
                if(this.validateButton!.disabled) {
                    this.validateButton!.disabled = false;
                }

                if (this.selectedNotesButton) {
                    this.selectedNotesButton.classList.remove('button-selected');
                }

                // Set the selected notes
                this.selectedNotesButton = notesButton;
                this.selectedNotes = notes;

                // Highlight the selected button with a green color
                if (this.selectedNotesButton) {
                	this.selectedNotesButton.classList.add('button-selected');
                }

                // play selected chord on easy mode
                if(this.exercise.settings.mode === ExerciseMode.Easy || (this.exercise.settings.mode === ExerciseMode.StopOnError && this.replayError)) {
                	await this.notePlayer.playNotes(this.selectedNotes, this.rootNote);
                }
            });
            container.appendChild(notesButton);
        }

        this.contentEl.appendChild(container);
        this.addSpacer();

        // Display a button to validate the answer
        this.validateButton = this.createButton('validate-button', 'Validate', async () => {
            		// Validate the answer
            		this.validateAnswer();
            	});
		this.contentEl.appendChild(this.validateButton);

        // Display a button to validate the answer
        this.nextButton = this.createButton('next-button', 'Next', () => {
            		// Validate the answer
            		this.next();
            	});
		this.nextButton!.classList.add('invisible')

		this.contentEl.appendChild(this.nextButton);

        // Listen for the keydown event on the description container
        this.contentEl.addEventListener('keydown',async (event) => {
            const key = event.key.toLowerCase();
            if (key === ' ' || key === 'enter') {
                // Spacebar or Enter key pressed, validate the answer
                event.stopPropagation();
                if(this.replayError) {
                	this.next();
                } else {
                	this.validateAnswer();
                }
            } else if (key === 'backspace' || key === '+') {
                await this.notePlayer.playNotes(this.playedNotes, this.rootNote);
                event.stopPropagation();
            } else {
				// move selections
                if(event.code.startsWith('Digit') || event.code.startsWith('Numpad')) {
                    let keyNumb = event.code.replace('Numpad', '');
					if(event.code.startsWith('Digit')) {
						keyNumb =  event.code.replace('Digit', '');
					}
                    // If the pressed key corresponds to a note button, trigger its click event
					let noteNumb: number | undefined;
                    if (keyNumb !== undefined && Number.isInteger(Number(keyNumb))) {
                    	noteNumb = Number(keyNumb) - 1;
                    } else if(event.code === 'NumpadMultiply' || event.code === 'NumpadDivide') {
                    	if(this.selectedNotesButton !== null) {
                    		const currentNumber = Number(this.selectedNotesButton.id.replace('noteButton-', ''));
							if(event.code === 'NumpadDivide' && currentNumber < this.exercise.settings.selectedNotes.length) {
								noteNumb = currentNumber - 1;
							} else if(event.code === 'NumpadMultiply' && currentNumber >= 0) {
								noteNumb = currentNumber + 1;
							}
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
