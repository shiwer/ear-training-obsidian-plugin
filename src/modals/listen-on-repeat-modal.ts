// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { ListeningExercise, chordsMap } from './../utils/constants';
import { Note, noteNames } from './../utils/audio-utils';
import { NotePlayer } from './../models/note-players';

export default class ListenOnRepeatModal extends Modal {
	// Would like to assign number but I have issues with compiler.
	private intervalId: number;

    private selectedChord: string | null = null; // To store the currently selected notes
    private lowestNotePitch: number | null = null;

    private prefixSelectedNote = 'noteButton-';
    private prefixSelectedRootNote = 'rootNoteButton-';


   // private selectedChordButton:HTMLButtonElement | null = null; // To store the selected notes button
    private selectedRootNoteButton:HTMLButtonElement | null = null; // To store the selected notes button

 	protected getButtonText(id:string): string {
        return chordsMap[id];
    }

    private createButton(id: string, text:string, prefix:string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = prefix + id;
        button.innerText = text;
        button.addEventListener('click', onClick);
        return button;
    }

    private addSpacer(): void {
        const spacerEl = document.createElement('div');
        spacerEl.classList.add('spacer');
        this.contentEl.appendChild(spacerEl);
    }

    private changeChordList(chordButton: HTMLButtonElement, chord: string): void {
		clearInterval(this.intervalId);
		const index = this.exercise.parameters.selectedChordList.indexOf(chord);
		if (index !== -1) {
			// Add the interval to the selected intervals list
			this.exercise.parameters.selectedChordList.splice(index, 1);
			chordButton.classList.remove('button-selected');

			// we need to set to null the selectedChord if the list is now empty
			if(!this.exercise.parameters.selectedChordList){
				this.selectedChord = null;
			}
		} else {
			this.exercise.parameters.selectedChordList.push(chord);
			chordButton.classList.add('button-selected');


			// we set the selectedChord to be the new one
			this.selectedChord = chord;
		}

		this.playNoteInThread();
	}


    private changeLowestNoteList(lowestNoteButton: HTMLButtonElement, lowestNote: number): void {
		clearInterval(this.intervalId);

		const index = this.exercise.parameters.lowestNotePitchList.indexOf(lowestNote);
		if (index !== -1) {
			// Add the interval to the selected intervals list
			this.exercise.parameters.lowestNotePitchList.splice(index, 1);
			lowestNoteButton.classList.remove('button-selected');


			// we need to set to null the lowestNotePitch if the list is now empty
			if(!this.exercise.parameters.lowestNotePitchList){
				this.lowestNotePitch = null;
			}
		} else {
			this.exercise.parameters.lowestNotePitchList.push(lowestNote);
			lowestNoteButton.classList.remove('button-selected');


			// we set the lowestNotePitch to be the new one
			this.lowestNotePitch = lowestNote;
		}

		this.playNoteInThread();
	}

	private flashCoral(button: HTMLButtonElement): void {
		const contentEl = this.contentEl;

		// Add a transition effect (e.g., change background color to yellow briefly)
		button.classList.add('highlight');
		setTimeout(() => {
			// Restore the original background color after a short delay
			button.classList.remove('highlight');
		}, 300); // Adjust the duration of the effect (in milliseconds) as needed
	}
	
	private playChord() {
		if(this.selectedChord && this.lowestNotePitch != null) {
			const chordButtonElement: HTMLButtonElement = document.getElementById(`${this.prefixSelectedNote}${this.selectedChord}`) as HTMLButtonElement;
			const pitchButtonElement: HTMLButtonElement = document.getElementById(`${this.prefixSelectedRootNote}${this.lowestNotePitch}`) as HTMLButtonElement;

			this.notePlayer.playNotes(this.selectedChord, this.notePlayer.getRootFromLowestNote(this.selectedChord, this.lowestNotePitch));

			this.flashCoral(chordButtonElement);
			this.flashCoral(pitchButtonElement);
		}
	}

	private playNoteInThread(): void {
		// Use setInterval to call the playNote method every second (1000 milliseconds)
		let i = 0;
		this.intervalId = <any>setInterval(() => {
				if(i == 0) {
					this.selectedChord = this.exercise.parameters.selectedChordList[Math.floor(Math.random() * this.exercise.parameters.selectedChordList.length)];
					this.lowestNotePitch = this.exercise.parameters.lowestNotePitchList[Math.floor(Math.random() * this.exercise.parameters.lowestNotePitchList.length)];
				} else if( i >= this.exercise.parameters.repeatTimes) {
					// we set -1 so it will be incremented at the end of the loop to be 0.
					i = -1;
				}
				this.playChord();
				i++;
		}, this.exercise.parameters.delayInMs);
	}

    constructor(app: App, private exercise: ListeningExercise, private notePlayer: NotePlayer) {
        super(app);
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

        // Add a heading
        this.contentEl.createEl('h2', { text: 'Listen' });

        new Setting(contentEl)
                    .setName('Number of Repeats')
                    .setDesc('Set the number of repeats')
                    .addText(text => text
                        .setPlaceholder('Enter a number from 0 to 50')
                        .setValue(String(this.exercise.parameters.repeatTimes))
                        .onChange(async (value) => {
                            const numRepeats = parseInt(value, 10);
                            if (!isNaN(numRepeats) && numRepeats >= 0 && numRepeats <= 50) {
                            	clearInterval(this.intervalId);
                                this.exercise.parameters.repeatTimes = numRepeats;
                                this.playNoteInThread();

                            }
                        }));

		new Setting(contentEl)
					.setName('Delay in ms')
					.setDesc('Set the delay in milliseconds')
					.addText(text => text
						.setPlaceholder('Enter a number from 300 to 5000')
						.setValue(String(this.exercise.parameters.delayInMs))
						.onChange(async (value) => {
							const delay = parseInt(value, 10);
							if (!isNaN(delay) && delay >= 300 && delay <= 5000) {
								clearInterval(this.intervalId);
								this.exercise.parameters.delayInMs = delay;
								this.playNoteInThread();

							}
						}));

        this.contentEl.createEl('h4', { text: 'Select the bottom note to play.' });

        const containerRoot = document.createElement('div');
        container.classList.add('answer-list');

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (let i = 0; i < noteNames.length; i++) {
            const note = noteNames[i];

            const noteButton = this.createButton(`${i}`, note, this.prefixSelectedRootNote, () => this.changeLowestNoteList(noteButton, i));
            containerRoot.appendChild(noteButton);
        }

        this.contentEl.appendChild(containerRoot);
        this.addSpacer();
        
		this.contentEl.createEl('h4', { text: 'Select the interval/chord to play.' });

		const container = document.createElement('div');
		container.classList.add('answer-list');

		// Display the selected notes list as clickable buttons (dropdown-like)
		for (let i = 0; i < this.exercise.settings.selectedNotes.length; i++) {
			const notes = this.exercise.settings.selectedNotes[i];
			const notesButton = this.createButton(notes, this.getButtonText(notes), this.prefixSelectedNote, () => this.changeChordList(notesButton, notes));
			container.appendChild(notesButton);
		}
        
		this.contentEl.appendChild(container);
        this.addSpacer();
        this.playNoteInThread()
		
    }

    onClose() {
        const { contentEl } = this;
        clearInterval(this.intervalId);
        contentEl.empty();
    }
}
