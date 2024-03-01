import { C2v10 } from '../audio/C2v10';
import { C3v10 } from '../audio/C3v10';
import { C4v10 } from '../audio/C4v10';
import { C5v10 } from '../audio/C5v10';
import { C6v10 } from '../audio/C6v10';
import { C7v10 } from '../audio/C7v10';
// Use import.meta.url to get the URL of the current module file

export class AudioPlayer {
	audioContext?: AudioContext;
	samples?: {
		C2: Promise<AudioBuffer>;
		C3: Promise<AudioBuffer>;
		C4: Promise<AudioBuffer>;
		C5: Promise<AudioBuffer>;
		C6: Promise<AudioBuffer>;
		C7: Promise<AudioBuffer>;
	};

	private async playTone(pitch: number, sample: Promise<AudioBuffer>) {
		if (!this.audioContext) {
  			return;
		}

		const source = this.audioContext.createBufferSource();
		source.buffer = await sample;

		// first try to use the detune property for p	itch shifting
		if (source.detune) {
		  	source.detune.value = pitch * 100;
		} else {
			// fallback to using playbackRate for pitch shifting
			source.playbackRate.value = 2 ** (pitch / 12);
		}

		source.connect(this.audioContext.destination);

		this.audioContext.resume().then(() => {
		  source.start(0);

		  // Stop the source after 2 seconds
		  setTimeout(() => {
			source.stop();
		  }, 3000);
		});
	}

	private getBestSampleForNote(
		pitch: number,
		octave: number
	): [adjustedPitch: number, sample: Promise<AudioBuffer>] {
		let adjustedPitch = pitch;
		let adjustedOctave = octave;

		// use the closest sample to minimize pitch shifting
		if (pitch > 6 && octave <= 7) {
			adjustedOctave = octave + 1;
			adjustedPitch = pitch - 12;
		}

		type SampleName = keyof typeof this.samples;

		return [
			adjustedPitch,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.samples![`C${adjustedOctave}` as SampleName],
		];
  }

   private async decodeAudio(base64Data: string): Promise<AudioBuffer> {
      const audioData = atob(base64Data);
      return await new Promise((resolve, reject) => {
        this.audioContext?.decodeAudioData(
          Uint8Array.from(audioData, c => c.charCodeAt(0)).buffer,
          buffer => resolve(buffer),
          error => reject(error)
        );
      });
  }

	constructor() {
		this.audioContext = new AudioContext();
		this.samples = {
			  C2: this.decodeAudio(C2v10),
			  C3: this.decodeAudio(C3v10),
			  C4: this.decodeAudio(C4v10),
			  C5: this.decodeAudio(C5v10),
			  C6: this.decodeAudio(C6v10),
			  C7: this.decodeAudio(C7v10),
			};

	}

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  async playNote(pitch: number, octave: number) {
    if (!this.audioContext || !this.samples) {
      return;
    }

    this.playTone(...this.getBestSampleForNote(pitch, octave));
  }
}
