// ear-training-plugin/audio-utils.ts
import { AudioPlayer } from './audio';

export const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const octave = 3;

const intervalsLimitations = {
	1: [{pitch: 0, octave:3}, {pitch: 7, octave: 4}],
	2: [{pitch: 0, octave:3}, {pitch: 7, octave: 4}],
	3: [{pitch: 0, octave:3}, {pitch: 7, octave: 4}],
	4: [{pitch: 0, octave:3}, {pitch: 7, octave: 4}],
	5: [{pitch: 10, octave:2}, {pitch: 0, octave: 5}],
	6: [{pitch: 10, octave:2}, {pitch: 0, octave: 5}],
	7: [{pitch: 0, octave:2}, {pitch: 0, octave: 4}],
	8: [{pitch: 5, octave:2}, {pitch: 0, octave: 4}],
	9: [{pitch: 5, octave:2}, {pitch: 0, octave: 4}],
	10: [{pitch: 5, octave:2}, {pitch: 0, octave: 4}],
	11: [{pitch: 5, octave:2}, {pitch: 0, octave: 4}],
	12: [{pitch: 5, octave:2}, {pitch: 0, octave: 4}]
}

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

	private getRandomInteger(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	constructor(audioPlayer: AudioPlayer)  {
		this.audioPlayer = audioPlayer;
	}

	getRootNoteFromLowestNote(semitonesLowestInterval: number, semitoneShit: number, lowestNotePitch: number): Note  {
			const limitations = intervalsLimitations[semitonesLowestInterval];

    		let { pitch: minPitch, octave: minOctave } = limitations[0];
    		let { pitch: maxPitch, octave: maxOctave } = limitations[1];

    		if(lowestNotePitch < minPitch) {
    			minOctave++;
    		}
    		if(lowestNotePitch > maxPitch) {
    			maxOctave--;
    		}
			const randomOctave = this.getRandomInteger(minOctave, maxOctave);

    		const lowestNote = { pitch: lowestNotePitch, octave: randomOctave };
    		return this.getRelativeNote(lowestNote, semitoneShit);

	}

	 getRootNote(semitonesLowestInterval: number, semitoneShit: number): Note {
		const limitations = intervalsLimitations[semitonesLowestInterval];

		const { pitch: minPitch, octave: minOctave } = limitations[0];
		const { pitch: maxPitch, octave: maxOctave } = limitations[1];

		const randomOctave = this.getRandomInteger(minOctave, maxOctave);

		// If the pitch is at the maximum allowed pitch, limit the random pitch to be within the current octave
		const maxPitchInOctave = randomOctave === maxOctave ? maxPitch : 11;
		const minPitchInOctave = randomOctave === minOctave ? minPitch : 0;

		const randomPitch = this.getRandomInteger(minPitchInOctave, maxPitchInOctave);

		const lowestNote = { pitch: randomPitch, octave: randomOctave };

		return this.getRelativeNote(lowestNote, semitoneShit);
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

	playNote(note: Note): void {
		let pitch = note.pitch;
		let octave = note.octave;

		this.printNote({pitch: pitch, octave: octave});
		this.audioPlayer.playNote(pitch, octave);
	}
    
	async playNotes(isHarmonic: boolean, ...notes: [Note]): Promise<void> {
		for (let i = 0; i < notes.length; i++) {
			let note = notes[i];

			this.playNote(note);

		    if(!isHarmonic) {
				// Introduce a delay before playing the second note
			    const delayBetweenNotes = 1000; // Adjust the delay in milliseconds
			    await new Promise(resolve => setTimeout(resolve, delayBetweenNotes));		    	
		    }
		}
	}
}


