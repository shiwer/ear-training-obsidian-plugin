// ear-training-plugin/audio-utils.ts
import { AudioPlayer } from './audio';

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const octave = 3;

export interface Note {
	pitch: number,
	octave: number
}

export class AudioUtils {
	audioPlayer: AudioPlayer;


	private printNote(note: Note): string {
  		const noteName = noteNames[note.pitch % 12];

  		const response = `${noteName}${note.octave}`;
  		console.debug(response);

  		return response;
	}

	private calculateSemitones(note: Note): number {
        return note.octave * 12 + note.pitch;
    }

	constructor(audioPlayer: AudioPlayer)  {
		this.audioPlayer = audioPlayer;
	}

	getRootNote(): Note {
	    // We pick a random note.
	    const pitch = Math.floor(Math.random() * 12);

	    return {
	    	pitch: pitch,
	    	octave: octave
	    }
	}

	getRelativeNote(baseNote:Note, interval: number): Note {
		let secondPitch = baseNote.pitch + interval;
	    let secondOctave = baseNote.octave;

	    if (secondPitch >= 12) {
	      secondPitch = secondPitch - 12;
	      secondOctave = (secondOctave as number) + 1;
	    } else if (secondPitch < 0 ) {
	    	secondPitch = 12 + secondPitch;
	    	secondOctave = secondOctave - 1;
		}

		return {
			pitch: secondPitch,
			octave: secondOctave
		}

	}

    calculateSemitoneInterval(note1: Note, note2: Note): number {
        const semitones1 = this.calculateSemitones(note1);
        const semitones2 = this.calculateSemitones(note2);

        return semitones1 - semitones2;
    }

	orderedChords(...notes: [Note]): [Note] {
	    // Use the spread operator to create a new array to avoid modifying the original array
	    const sortedNotes = [...notes];

	    // Sort the array based on pitch and octave
	    sortedNotes.sort((a, b) => {
	        if (a.octave !== b.octave) {
	            return a.octave - b.octave;
	        }
	        return a.pitch - b.pitch;
	    });

	    return sortedNotes;
    }

    
	async playNotes(isHarmonic: boolean, ...notes: [Note]): Promise<void> {
		for (let i = 0; i < notes.length; i++) {
			let note = notes[i];
			let pitch = note.pitch;
			let octave = note.octave;

		    this.printNote({pitch: pitch, octave: octave});
		    this.audioPlayer.playNote(pitch, octave);

		    if(!isHarmonic) {
				// Introduce a delay before playing the second note
			    const delayBetweenNotes = 1000; // Adjust the delay in milliseconds
			    await new Promise(resolve => setTimeout(resolve, delayBetweenNotes));		    	
		    }
		}
	}
}


