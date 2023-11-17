// ear-training-plugin/audio-utils.ts
const noteToFrequencies: Record<string, number> = {
    'A': 440.0,   // Adjust this based on your reference frequency
    'A#': 466.16,
    'Bb': 466.16,
    'B': 493.88,
    'C': 523.25,
    'C#': 554.37,
    'Db': 554.37,
    'D': 587.33,
    'D#': 622.25,
    'Eb': 622.25,
    'E': 659.26,
    'F': 698.46,
    'F#': 739.99,
    'Gb': 739.99,
    'G': 783.99,
    'G#': 830.61,
    'Ab': 830.61,
};

const audioContext = new AudioContext();

export function getBaseFrequency(): number {
    // Get a random note from the keys of the noteToFrequencies map
    const notes = Object.keys(noteToFrequencies);
    const randomNote = notes[Math.floor(Math.random() * notes.length)];

    // Return the corresponding frequency
    return noteToFrequencies[randomNote];
}


export async function playNotes(baseFrequency: number, secondFrequency: number, isAscending: boolean): Promise<void> {
    console.log('first note');
    await soundPlay(baseFrequency);

    // Introduce a delay before playing the second note
    const delayBetweenNotes = 1000; // Adjust the delay in milliseconds
    console.log('waiting for', delayBetweenNotes, 'ms before playing the second note');
    await new Promise(resolve => setTimeout(resolve, delayBetweenNotes));

    console.log('second note');
    await soundPlay(secondFrequency);
}

async function soundPlay(freq): Promise<void> {
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = freq;
    gain.gain.linearRampToValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.6, now + .1);
    gain.gain.linearRampToValueAtTime(0, now + 1);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(0);

    // Adjust the duration of the note
    const noteDuration = 1500; // Adjust the duration in milliseconds

    return new Promise(resolve => {
        setTimeout(() => {
            oscillator.stop();
            resolve();
        }, noteDuration);
    });
}