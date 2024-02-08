import { Note } from './../utils/constants'; // Adjust the path accordingly

export interface ScoreInfo {
    playedNotes: string;
    selectedNotes: string;
    rootNote: Note | null;
}

export interface HeaderInfo {
    exercise: string;
    mode: string;
    tonalities: string[];
    choices: string[];
}

export class ScoreTracker {
	private headerInfo: HeaderInfo | null;
    private scoreInfo: ScoreInfo[] = [];

    constructor(exercise: string, mode: string, tonalities: string[], choices: string[]){
    	this.headerInfo = {
    		exercise: exercise,
    		mode: mode,
    		tonalities: tonalities,
    		choices: choices
    	}
    	this.scoreInfo = [];
    }

    recordScoreInfo(playedNotes: string, selectedNotes: string, rootNote: Note | null): void {
        this.scoreInfo.push({ playedNotes, selectedNotes, rootNote });
    }

	getHeaderInfo(): HeaderInfo {
		return this.headerInfo;
	}

    getScoreInfo(): ScoreInfo[] {
        return this.scoreInfo;
    }

    clearScoreInfo(): void {
        this.scoreInfo = [];
    }

    getUniquePlayedNotes(): string[] {
        // Use Set to store unique playedNotes
        const uniquePlayedNotes = new Set<string>();

        // Iterate through all recorded scoreInfo and add playedNotes to the Set
        this.scoreInfo.forEach((scoreInfo) => {
            uniquePlayedNotes.add(scoreInfo.playedNotes);
        });

        // Convert Set to an array and return
        return Array.from(uniquePlayedNotes);
    }

    getMistakes(): ScoreInfo[] {
    	const filteredScoreInfo = this.scoreInfo.filter((scoreInfo) => scoreInfo.playedNotes != scoreInfo.selectedNotes);

    	return filteredScoreInfo;
    }

    // Add a new method to get selectedNotes and rootNote for a specific playedNote
    getNotesForPlayedNote(playedNote: string): [{ selectedNotes: string, rootNote: Note | null }] {
        // Filter scoreInfo based on the provided playedNote
        const filteredScoreInfo = this.scoreInfo.filter((scoreInfo) => scoreInfo.playedNotes === playedNote);

        // Extract selectedNotes and rootNote for each filtered mistake
        return filteredScoreInfo.map((scoreInfo) => ({
            selectedNotes: scoreInfo.selectedNotes,
            rootNote: scoreInfo.rootNote,
        }));
    }
}
