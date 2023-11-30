import { Note } from './../utils/constants'; // Adjust the path accordingly

export interface MistakeInfo {
    playedNotes: string;
    selectedNotes: string;
    rootNote: Note | null;
}

export class MistakeTracker {
    private mistakes: MistakeInfo[] = [];

    recordMistake(playedNotes: string, selectedNotes: string, rootNote: Note | null): void {
        this.mistakes.push({ playedNotes, selectedNotes, rootNote });
    }

    getMistakes(): MistakeInfo[] {
        return this.mistakes;
    }

    clearMistakes(): void {
        this.mistakes = [];
    }

    getUniquePlayedNotes(): string[] {
        // Use Set to store unique playedNotes
        const uniquePlayedNotes = new Set<string>();

        // Iterate through all recorded mistakes and add playedNotes to the Set
        this.mistakes.forEach((mistake) => {
            uniquePlayedNotes.add(mistake.playedNotes);
        });

        // Convert Set to an array and return
        return Array.from(uniquePlayedNotes);
    }

    // Add a new method to get selectedNotes and rootNote for a specific playedNote
    getNotesForPlayedNote(playedNote: string): [{ selectedNotes: string, rootNote: Note | null }] {
        // Filter mistakes based on the provided playedNote
        const filteredMistakes = this.mistakes.filter((mistake) => mistake.playedNotes === playedNote);

        // Extract selectedNotes and rootNote for each filtered mistake
        return filteredMistakes.map((mistake) => ({
            selectedNotes: mistake.selectedNotes,
            rootNote: mistake.rootNote,
        }));
    }
}
