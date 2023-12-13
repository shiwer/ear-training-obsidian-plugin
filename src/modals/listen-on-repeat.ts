// ear-training-plugin/modal.ts
import { App, Modal, Notice, Setting } from 'obsidian';
import { Exercise, chordsMap } from './../utils/constants';

import { Note, noteNames } from './../utils/audio-utils';
import { NotePlayer } from './../models/note-players';

export default class ListenOnRepeatModal extends Modal {

	private intervalId: number | null = null;

    plugin: EarTrainingPlugin;

    protected notePlayer: NotePlayer;

	private repeatTimes: number = 3;
	private delayInMs: number = 5000;
    private randomizeNotes: boolean = false;
    private randomizeBottomNote: boolean = true;
    private selectedNotes: string | null = null; // To store the currently selected notes
    private lowestNotePitch: number = 0;

    private prefixSelectedNote = 'noteButton-';
    private prefixSelectedRootNote = 'rootNoteButton-';

    private selectedNotesButton:HTMLButtonElement | null = null; // To store the selected notes button
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

    private changeNotes(notesButton: HTMLButtonElement, notes: string): void {
		clearInterval(this.intervalId);

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
			this.selectedNotesButton.style.color = 'white';
		}
		this.playNoteInThread();
	}


    private changeLowestNote(notesButton: HTMLButtonElement, newLowestNote: number): void {
		clearInterval(this.intervalId);

		if (this.selectedRootNoteButton) {
			this.selectedRootNoteButton.style.backgroundColor = '';
			this.selectedRootNoteButton.style.color = '';
		}

		// Set the selected notes
		this.selectedRootNoteButton = notesButton;
		this.lowestNotePitch = newLowestNote;

		// Highlight the selected button with a green color
		if (this.selectedRootNoteButton) {
			this.selectedRootNoteButton.style.backgroundColor = 'lightgreen';
			this.selectedRootNoteButton.style.color = 'white';
		}
		this.playNoteInThread();
	}

	private playNoteInThread(): void {
		// Use setInterval to call the playNote method every second (1000 milliseconds)
		let i = 0;
		this.intervalId = setInterval(() => {
				if(i >= this.repeatTimes) {
					if(this.randomizeNotes) {
						const notes = this.exercise.settings.selectedNotes[Math.floor(Math.random() * this.exercise.settings.selectedNotes.length)];
						const buttonElement = document.getElementById(`${this.prefixSelectedNote}${notes}`)

						this.changeNotes(buttonElement, notes);
					}
					if(this.selectedNotes !== undefined) {
						if(this.randomizeBottomNote) {
							const index = Math.floor(Math.random() * noteNames.length)
							const buttonElement = document.getElementById(`${this.prefixSelectedRootNote}${index}`)

							this.changeLowestNote(buttonElement, index);
						}



					}
					i=0;
				}
				if(this.selectedNotes) {
					this.notePlayer.playNotes(this.selectedNotes, this.notePlayer.getRootFromLowestNote(this.selectedNotes, this.lowestNotePitch));
				}
				i++;
		}, this.delayInMs);
	}

    constructor(app: App, plugin: EarTrainingPlugin, protected exercise: Exercise, notePlayer: NotePlayer) {
        super(app, plugin);
        this.plugin = plugin;
        this.notePlayer = notePlayer;
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
                        .setValue(String(this.repeatTimes))
                        .onChange(async (value) => {
                            const numRepeats = parseInt(value, 10);
                            if (!isNaN(numRepeats) && numRepeats >= 0 && numRepeats <= 50) {
                            	clearInterval(this.intervalId);
                                this.repeatTimes = numRepeats;
                                this.playNoteInThread();

                            }
                        }));

		new Setting(contentEl)
					.setName('Delay in ms')
					.setDesc('Set the delay in milliseconds')
					.addText(text => text
						.setPlaceholder('Enter a number from 300 to 5000')
						.setValue(String(this.delayInMs))
						.onChange(async (value) => {
							const delay = parseInt(value, 10);
							if (!isNaN(delay) && delay >= 300 && delay <= 5000) {
								clearInterval(this.intervalId);
								this.delayInMs = delay;
								this.playNoteInThread();

							}
						}));

        this.contentEl.createEl('h4', { text: 'Select the bottom note to play.' });
		new Setting(contentEl)
                            .setName('Randomize bottom note')
                            .addToggle(toggle => toggle
                                .setValue(this.randomizeBottomNote)
                                .onChange((value) => {
                                  this.randomizeBottomNote = value;
                                }));
        const containerRoot = document.createElement('div');
        containerRoot.style.display = 'grid';
        containerRoot.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
        containerRoot.style.gridGap = '10px';
        containerRoot.style.justifyItems = 'inherit';

        // Display the selected notes list as clickable buttons (dropdown-like)
        for (let i = 0; i < noteNames.length; i++) {
            const note = noteNames[i];

            const noteButton = this.createButton(i, note, this.prefixSelectedRootNote, () => this.changeLowestNote(noteButton, i));
            containerRoot.appendChild(noteButton);
        }

        this.contentEl.appendChild(containerRoot);
        this.addSpacer();
        
		this.contentEl.createEl('h4', { text: 'Select the interval/chord to play.' });
		new Setting(contentEl)
								.setName('Randomize chords')
								.addToggle(toggle => toggle
									.setValue(this.randomizeNotes)
									.onChange((value) => {
									  this.randomizeNotes = value;
									}));
		const container = document.createElement('div');
		container.style.display = 'grid';
		container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'; // Use 'row' for a horizontal layout
		container.style.gridGap = '10px';
		container.style.justifyItems = 'inherit';

		// Display the selected notes list as clickable buttons (dropdown-like)
		for (let i = 0; i < this.exercise.settings.selectedNotes.length; i++) {
			const notes = this.exercise.settings.selectedNotes[i];
			const notesButton = this.createButton(notes, this.getButtonText(notes), this.prefixSelectedNote, () => this.changeNotes(notesButton, notes));
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
