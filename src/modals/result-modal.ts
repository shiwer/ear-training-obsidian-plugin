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

                    const playedNoteButton = mistakeItem.createEl('button', { text: playedNoteLabel });
                    playedNoteButton.addEventListener('click', () => {
                        this.notePlayer.playNotes(playedNotes, rootAndSelectedNote.rootNote);
                    });


                    const selectedNoteButton = mistakeItem.createEl('button', { text: selectedNotesLabel });
                    selectedNoteButton.addEventListener('click', () => {
                        this.notePlayer.playRelativeChord(playedNotes, rootAndSelectedNote.selectedNotes, rootAndSelectedNote.rootNote);
                    });


                    const textContainer = mistakeItem.createEl('span'); // Container for buttons
                    textContainer.textContent = ` was mixed up with : `;

                    mistakeItem.appendChild(playedNoteButton);
                    mistakeItem.appendChild(textContainer);
                    mistakeItem.appendChild(selectedNoteButton);
                    

                    mistakeList.appendChild(mistakeItem);

                }
            }

            contentEl.appendChild(mistakeList);

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
