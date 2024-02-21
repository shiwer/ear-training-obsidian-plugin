import * as fs from 'fs';

// Use import.meta.url to get the URL of the current module file

export class AudioPlayer {
  audioContext?: AudioContext;
  samples?: {
    C2: AudioBuffer;
    C3: AudioBuffer;
    C4: AudioBuffer;
    C5: AudioBuffer;
    C6: AudioBuffer;
    C7: AudioBuffer;
  };

  constructor(baseDir: string) {
    this.playNote = this.playNote.bind(this);

    this.audioContext = new AudioContext();
    const audioExtension = "mp3";

    // check for support for the web audio api
    if (!this.audioContext || !audioExtension) {
      return;
    }

    const fileNames = ["C2v10", "C3v10", "C4v10", "C5v10", "C6v10", "C7v10"];

    Promise.all(
      fileNames.map((fileName) =>
        this.loadSample(
          `${baseDir}/audio/${fileName}.${audioExtension}`
        )
      )
    ).then((audioBuffers) => {
      const [C2, C3, C4, C5, C6, C7] = audioBuffers;
      this.samples = { C2, C3, C4, C5, C6, C7 };
    });
  }

 private loadSample(filePath: string): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      this.audioContext!.decodeAudioData(data.buffer, resolve, reject);
    });
  });
}

  private playTone(pitch: number, sample: AudioBuffer) {
    if (!this.audioContext) {
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = sample;

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
  ): [adjustedPitch: number, sample: AudioBuffer] {
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

  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  playNote(pitch: number, octave: number) {
    if (!this.audioContext || !this.samples) {
      return;
    }

    this.playTone(...this.getBestSampleForNote(pitch, octave));
  }
}
