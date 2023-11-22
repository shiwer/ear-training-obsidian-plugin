// ear-training-plugin/audio-utils.ts
import { AudioPlayer } from './audio';

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const octave = 3;

export class AudioUtils {
	audioPlayer: AudioPlayer;


	private printNote(pitch: number, octave: number): string {
  		const noteName = noteNames[pitch % 12];
  		console.debug(`${noteName}${octave}`);
	}

	constructor(audioPlayer: AudioPlayer)  {
		this.audioPlayer = audioPlayer;
	}

	getBaseNote(): number {
	    // We pick a random note.
	    return Math.floor(Math.random() * 12);
	}

	async playNotesInterval(firstNote: number, interval: number, isAscending: boolean): Promise<void> {
	    this.printNote(firstNote, octave);
	    this.audioPlayer.playNote(firstNote, octave);

	    // Introduce a delay before playing the second note
	    const delayBetweenNotes = 1000; // Adjust the delay in milliseconds
	    await new Promise(resolve => setTimeout(resolve, delayBetweenNotes));

	    let secondNote = isAscending ? firstNote + interval : firstNote - interval;
	    let secondNoteOctave = octave;

	    if (secondNote >= 12) {
	      secondNote = secondNote - 12;
	      secondNoteOctave = (secondNoteOctave as number) + 1;
	    } else if (secondNote < 0 ) {
	    	secondNote = 12 + secondNote;
	    	secondNoteOctave = secondNoteOctave - 1;
		}
	    
		this.printNote(secondNote, secondNoteOctave);
	   	await this.audioPlayer.playNote(secondNote, secondNoteOctave);
	}


}


