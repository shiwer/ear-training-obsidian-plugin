// ear-training-plugin/menu-modal.ts
import { App, Modal, Setting } from 'obsidian';
import { AudioUtils } from './../utils/audio-utils';
import { chapterTitles, chapterExercises, intervalMap, BestScoresData} from './../utils/constants';
import IntervalTrainingModal from './interval-training-modal';
import ChordsTrainingModal from './chords-training-modal';
import MenuModal from './menu-modal';


export default class ChapterModal extends Modal {
    private chapterNumber: number;
    plugin: EarTrainingPlugin;
    private audioUtils: AudioUtils;
    private content: HTMLElement;

    private getDescription(exercise: Exercise, bestScores: BestScoresData): string {
        let description = '';
        if(exercise.settings.mode != 'chords') {
            const intervalDescriptions = exercise.settings.selectedNotes.map(interval => intervalMap[interval]);

            description = intervalDescriptions.join(', ');
        }
      
        if (exercise.settings.isHarmonic) {
            description += ' (harmonic) ';
        } else {

             if(exercise.settings.mode === 'oam') {
                description += ' ascendant mode';
            } else if (exercise.settings.mode === 'odm') {
                description += ' descendant mode';
            } else {
                description += ' two way mode';
            }
            
            description += ' (melodic) ';
        }

        description += ((bestScores[exercise.exerciseId]) || 0)  + '/32' ;
 
        return description;
    }

    private createDynamicContent(): HTMLElement {
        // Your logic to create or refresh the content
        // ...
        const updatedContent = document.createElement('div');
        for(const exercise of chapterExercises[this.chapterNumber]) {
            new Setting(updatedContent)
            .setName('Intervals Identification')
            .setDesc(this.getDescription(exercise, this.plugin.bestScores))
            .addButton(button => {
                button
                    .setButtonText('Go')
                    .onClick(() => {
                        // Open the Free Interval Training modal
                        if(exercise.settings.mode === 'chords' || exercise.settings.mode === 'based-chords') {
                            new ChordsTrainingModal(this.app,this.plugin, exercise, this.audioUtils, this.refreshContent.bind(this)).open();
                        } else {
                            new IntervalTrainingModal(this.app,this.plugin, exercise, this.audioUtils, this.refreshContent.bind(this)).open();
                        }
                    });
            });
        }

        return updatedContent;
    }

    private refreshContent() {
        // Refresh the content
        this.content.innerHTML = '';
        const refreshedContent = this.createDynamicContent();
        this.content.appendChild(refreshedContent);
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
        contentEl.addClass('ear-plugin-modal');


        const titleContainer = contentEl.createDiv('modal-title-container');
        titleContainer.createEl('h2', { text: chapterTitles[this.chapterNumber] });

        // Add back button with left arrow icon
        //const backButton = titleContainer.createDiv('back-button');
        const backButton = titleContainer.createEl('button', { cls: 'back-button' });

        backButton.textContent = '←';
        backButton.addEventListener('click', () => {
            new MenuModal(this.app, this.plugin, this.audioUtils).open();
            this.close();

        });

        this.contentEl.appendChild(titleContainer);


        this.content = this.createDynamicContent(); // Your function to create or refresh content
        this.contentEl.appendChild(this.content);


    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
