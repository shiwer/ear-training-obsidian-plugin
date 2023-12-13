// ear-training-plugin/result-modal.ts
import { App, Modal } from 'obsidian';
import { intervalMap, chordsMap } from './../utils/constants';
import { Note } from './../utils/audio-utils';
import { MistakeTracker, MistakeInfo } from './../models/mistakes';
import { NotePlayer } from './../models/note-players';

export default class EarTrainingResultModal extends Modal {
    private notePlayer: NotePlayer;
    private score: number;
    private totalExercises: number;
    private mistakeTracker: MistakeTracker;
    private elements: NodeListOf<HTMLElement>;
    private selectedRaw: number = 0;

    private handleKeyDown(event) {

    }

    constructor(app: App, notePlayer: NotePlayer, score: number, totalExercises: number, mistakeTracker: MistakeTracker) {
        super(app);
        this.notePlayer = notePlayer;
        this.score = score;
        this.totalExercises = totalExercises;
        this.mistakeTracker = mistakeTracker;
    }

	onOpen() {
        const { contentEl } = this;
        contentEl.addClass('ear-plugin-modal');

        // Display the score
        const scoreHeading = contentEl.createEl('h2');
        scoreHeading.innerText = `Score: ${this.score}/${this.totalExercises}`;
        // Display mistakes if there are any
        if (this.mistakeTracker.getMistakes().length > 0) {
            const mistakesHeading = contentEl.createEl('h3');
            mistakesHeading.innerText = 'Mistakes';

            const mistakeList = contentEl.createEl('div');
            mistakeList.addClass('mistakes-results');
            const listPlayedNotes = this.mistakeTracker.getUniquePlayedNotes();
            for (const playedNotes of listPlayedNotes) {
                const playedNoteLabel = intervalMap[playedNotes] ? intervalMap[playedNotes] : chordsMap[playedNotes]; // Retrieve the English label
               
                const listRootAndSelectedNote = this.mistakeTracker.getNotesForPlayedNote(playedNotes);
                for (const rootAndSelectedNote of listRootAndSelectedNote) {
                    const selectedNotesLabel = intervalMap[rootAndSelectedNote.selectedNotes] ? intervalMap[rootAndSelectedNote.selectedNotes] : chordsMap[rootAndSelectedNote.selectedNotes]; // Retrieve the English label
                    
                    const mistakeItem = mistakeList.createEl('p');

					const firstNoteButton = mistakeItem.createEl('button', { text: 'First Note' });
					firstNoteButton.addEventListener('click', () => {
						this.notePlayer.playFirstNote(playedNotes, rootAndSelectedNote.rootNote);
					});

                    const playedNoteButton = mistakeItem.createEl('button', { text: playedNoteLabel });
                    playedNoteButton.addEventListener('click', () => {
                        this.notePlayer.playNotes(playedNotes, rootAndSelectedNote.rootNote);
                    });

                    const selectedNoteButton = mistakeItem.createEl('button', { text: selectedNotesLabel });
                    selectedNoteButton.addEventListener('click', () => {
                        this.notePlayer.playRelativeChord(playedNotes, rootAndSelectedNote.selectedNotes, rootAndSelectedNote.rootNote);
                    });


                    const firstTextContainer = mistakeItem.createEl('span');
                    firstTextContainer.textContent = ` .You mixed up : `;


                    const secondTextContainer = mistakeItem.createEl('span');
                    secondTextContainer.textContent = ` with : `;


                    mistakeItem.appendChild(firstNoteButton);
                    mistakeItem.appendChild(firstTextContainer);
                    mistakeItem.appendChild(playedNoteButton);
                    mistakeItem.appendChild(secondTextContainer);
                    mistakeItem.appendChild(selectedNoteButton);
                    

                    mistakeList.appendChild(mistakeItem);

                }
            }

            contentEl.appendChild(mistakeList);

            this.elements = document.querySelectorAll('.mistakes-results p');
            if(this.elements) {
            	this.selectedRaw = 0;
				this.elements[this.selectedRaw].classList.add('selected');
				 // Listen for the keydown event on the description container
				contentEl.addEventListener('keydown', (event) => {
					const key = event.key.toLowerCase();
					if (key === 'arrowup' || key === 'arrowdown' || key === '+' || key === '-') {
						event.preventDefault();

						// Get the list of elements to navigate

						this.elements[this.selectedRaw].classList.remove('selected');

						if (key === 'arrowdown' || key === '+') {
							this.selectedRaw = Math.min(this.elements.length - 1, this.selectedRaw + 1);
						} else {
							this.selectedRaw = Math.max(0, this.selectedRaw - 1);
						}
						this.elements[this.selectedRaw].classList.add('selected');

						this.elements[this.selectedRaw].scrollIntoView({ behavior: 'smooth', block: 'center' });

					} else {

						if(event.code.startsWith('Digit') || event.code.startsWith('Numpad')) {

							let keyNumb = event.code.replace('Numpad', '');
							if(event.code.startsWith('Digit')) {
								keyNumb =  event.code.replace('Digit', '');
							}
							// If the pressed key corresponds to a note button, trigger its click event

							if (keyNumb !== undefined && keyNumb < 4) {
								// we map 1-> 0; 2 -> 2, 3 -> 4
								const noteButton = this.elements[this.selectedRaw].children[(keyNumb - 1) * 2];
								if (noteButton) {
									noteButton.click();
								}
							// if keyNumb is 8 then pick a random raw
							} else if(keyNumb !== undefined && keyNumb == 8 ){
								this.elements[this.selectedRaw].classList.remove('selected');

                                this.selectedRaw =  Math.floor(Math.random() * this.elements.length);
                                console.log(this.selectedRaw);

								this.elements[this.selectedRaw].classList.add('selected');

								this.elements[this.selectedRaw].scrollIntoView({ behavior: 'smooth', block: 'center' });
							}
						}

					}
				});
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
