import EarTrainingPlugin from '../main';


export default class Migration {

	constructor(private plugin: EarTrainingPlugin) {
	}

	async migrateData(version: string): Promise<void> {
    	 switch (version) {
                case '0.0.0':
    				await this.cleanChordsFromSettings();
    				break;
                default:
                	console.error('error version not handled.')
    				break;
    	}

    }

    async cleanChordsFromSettings() {
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
}


