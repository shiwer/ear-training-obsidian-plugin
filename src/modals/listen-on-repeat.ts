// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { ListeningExercise, chordsMap } from './../utils/constants';

import { Note, noteNames } from './../utils/audio-utils';
import { NotePlayer } from './../models/note-players';

export default class ListenOnRepeatModal extends Modal {

	private intervalId: number | null = null;

    protected notePlayer: NotePlayer;

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
        spacerEl.style.height = '10px'; // Adjust the height as needed
        this.contentEl.appendChild(spacerEl);
    }

    private changeChordList(chordButton: HTMLButtonElement, chord: string): void {
		clearInterval(this.intervalId);
		const index = this.exercise.parameters.selectedChordList.indexOf(chord);
		if (index !== -1) {
			// Add the interval to the selected intervals list
			this.exercise.parameters.selectedChordList.splice(index, 1);
			chordButton.style.backgroundColor = '';
			chordButton.style.color = '';

			// we need to set to null the selectedChord if the list is now empty
			if(!this.exercise.parameters.selectedChordList){
				this.selectedChord = null;
			}
		} else {
			this.exercise.parameters.selectedChordList.push(chord);
			chordButton.style.backgroundColor = 'lightgreen';
			chordButton.style.color = 'white';

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
			lowestNoteButton.style.backgroundColor = '';
			lowestNoteButton.style.color = '';

			// we need to set to null the lowestNotePitch if the list is now empty
			if(!this.exercise.parameters.lowestNotePitchList){
				this.lowestNotePitch = null;
			}
		} else {
			this.exercise.parameters.lowestNotePitchList.push(lowestNote);
			lowestNoteButton.style.backgroundColor = 'lightgreen';
			lowestNoteButton.style.color = 'white';

			// we set the lowestNotePitch to be the new one
			this.lowestNotePitch = lowestNote;
		}

		this.playNoteInThread();
	}

	private flashCoral(button: HTMLButtonElement): void {
		const contentEl = this.contentEl;

		// Save the current background color
		const originalBackgroundColor = 'lightgreen';
		const flashColor = 'lightcoral';

		// Add a transition effect (e.g., change background color to yellow briefly)
		button.style.backgroundColor = flashColor;
		setTimeout(() => {
			// Restore the original background color after a short delay
			button.style.backgroundColor = originalBackgroundColor;
		}, 300); // Adjust the duration of the effect (in milliseconds) as needed
	}
	
	private playChord() {
		if(this.selectedChord && this.lowestNotePitch != null) {
			const chordButtonElement = document.getElementById(`${this.prefixSelectedNote}${this.selectedChord}`);
			const pitchButtonElement = document.getElementById(`${this.prefixSelectedRootNote}${this.lowestNotePitch}`)

			this.notePlayer.playNotes(this.selectedChord, this.notePlayer.getRootFromLowestNote(this.selectedChord, this.lowestNotePitch));

			this.flashCoral(chordButtonElement);
			this.flashCoral(pitchButtonElement);
		}
	}

	private playNoteInThread(): void {
		// Use setInterval to call the playNote method every second (1000 milliseconds)
		let i = 0;
		this.intervalId = setInterval(() => {
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

    constructor(private app: App, private plugin: EarTrainingPlugin, private exercise: ListeningExercise, private notePlayer: NotePlayer) {
        super(app, plugin);
    }

  	onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('ear-plugin-modal');

        // Add a heading
        this.dynamicHeader = this.contentEl.createEl('h2', { text: 'Listen' });

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
        containerRoot.style.display = 'grid';
        containerRoot.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
        containerRoot.style.gridGap = '10px';
        containerRoot.style.justifyItems = 'inherit';

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (let i = 0; i < noteNames.length; i++) {
            const note = noteNames[i];

            const noteButton = this.createButton(i, note, this.prefixSelectedRootNote, () => this.changeLowestNoteList(noteButton, i));
            containerRoot.appendChild(noteButton);
        }

        this.contentEl.appendChild(containerRoot);
        this.addSpacer();
        
		this.contentEl.createEl('h4', { text: 'Select the interval/chord to play.' });

		const container = document.createElement('div');
		container.style.display = 'grid';
		container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
		container.style.gridGap = '10px';
		container.style.justifyItems = 'inherit';

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
