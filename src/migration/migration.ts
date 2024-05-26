import EarTrainingPlugin from '../main';
import { ExerciseMode, EarTrainingGlobalSettings } from '../utils/constants'

export default class Migration {

	constructor(private plugin: EarTrainingPlugin) {
	}

	async migrateData(version: string): Promise<void> {
    	 switch (version) {
                case '0.0.0':
    				await this.cleanChordsFromSettings();
				case '0.0.3':
					await this.updateDataJsonMode();
                default:
    				break;
    	}

    }

    private async cleanChordsFromSettings() {
		const oldValues:string[] = ['minor-root-based', 'major-root-based', 'minor-fifth-based', 'minor-third-based','major-fifth-based', 'major-third-based',];
        const newValues:string[] = ['minor', 'major'];

        // Check if the old values are present in selectedNotes
    	let selectedNotes: string[] = this.plugin.settings.chords.settings.selectedNotes;

		const containsOldValues: boolean = oldValues.some(oldValue => selectedNotes.includes(oldValue));

    	// If the old values are present, replace them with the new values and remove any other old values
        if (containsOldValues) {
            selectedNotes = selectedNotes.reduce<string[]>((acc, note) => {
                if (oldValues.includes(note)) {
                    const index: number = oldValues.indexOf(note);
                    if(newValues[index]) {
                    	acc.push(newValues[index]);
                    }
                } else {
					 acc.push(note);
				}
                return acc;
            }, []);
        }

       this.plugin.settings.chords.settings.selectedNotes = selectedNotes;

        await this.plugin.saveData(this.plugin.allInformations);
    }

    private async updateDataJsonMode() {
    	const newMode = ExerciseMode.Normal
    	let tempSettings:any = this.plugin.settings;
    	const chordMode =  tempSettings.chords.settings.isHarmonic ? 'chords' : tempSettings.chords.settings.mode;
    	const intervalMode =  tempSettings.intervals.settings.isHarmonic ? 'chords' : tempSettings.intervals.settings.mode;

		delete tempSettings.intervals.settings['isHarmonic'];
		delete tempSettings.chords.settings['isHarmonic'];

		tempSettings.intervals.settings.mode = newMode;
		tempSettings.chords.settings.mode = newMode;

		tempSettings.chords.settings.playMode = chordMode;
		tempSettings.intervals.settings.playMode = intervalMode;

		this.plugin.settings = tempSettings as EarTrainingGlobalSettings

        await this.plugin.saveData(this.plugin.allInformations);
    }
}


