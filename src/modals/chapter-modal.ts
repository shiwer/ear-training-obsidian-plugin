// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { AudioUtils } from './../utils/audio-utils';
import { chapterTitles, chapterExercises, EarTrainingSettings, intervalMap, BestScoresData} from './../utils/constants';
import IntervalTrainingModal from './interval-training-modal';

export default class ChapterModal extends Modal {
    private chapterNumber: number;
    plugin: EarTrainingPlugin;
    private audioUtils: AudioUtils;

   private getDescription(exercise: Exercise, bestScores: BestScoresData): string {
      const intervalDescriptions = exercise.settings.selectedIntervals.map(interval => intervalMap[interval]);

      let description = intervalDescriptions.join(', ');


      if(exercise.settings.mode === 'oam') {
        description += ' ascendant mode';
      } else if (exercise.settings.mode === 'odm') {
        description += ' descendant mode';
      } else {
        description += ' two way mode';
      }

      if (exercise.settings.isHarmonic) {
        description += ' (harmonic) ';
      } else {
        description += ' (melodic) ';
      }

      description += ((bestScores[exercise.exerciseId]) || 0)  + '/32' ;

      return description;
    }

    constructor(app: App, plugin: EarTrainingPlugin, private audioUtils: AudioUtils, chapterNumber: number) {
        super(app, plugin);
        this.audioUtils = audioUtils;
        this.plugin = plugin;
        this.chapterNumber = chapterNumber;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        console.log('chapter modal score: ',this.plugin.bestScores);
        console.log('chapter modal setting: ',this.plugin.settings);


        contentEl.createEl('h2', { text: chapterTitles[this.chapterNumber] });

        for(const exercise of chapterExercises[this.chapterNumber]) {
            new Setting(contentEl)
            .setName('Intervals Identification')
            .setDesc(this.getDescription(exercise, this.plugin.bestScores))
            .addButton(button => {
                button
                    .setButtonText('Go')
                    .onClick(() => {
                        // Open the Free Interval Training modal
                        new IntervalTrainingModal(this.app,this.plugin, exercise, this.audioUtils).open();
                        this.close();
                    });
            });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
