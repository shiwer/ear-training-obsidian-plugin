// ear-training-plugin/result-modal.ts
import { App, Modal } from 'obsidian';
import { intervalMap } from './../utils/constants';

export default class EarTrainingResultModal extends Modal {
    private score: number;
    private totalExercises: number;
    private mistakes: Record<string, Record<string, number>>;

    constructor(app: App, score: number, totalExercises: number, mistakes: Record<string, Record<string, number>>) {
        super(app);
        this.score = score;
        this.totalExercises = totalExercises;
        this.mistakes = mistakes;
    }

	onOpen() {
        const { contentEl } = this;

        // Display the score
        const scoreHeading = contentEl.createEl('h2');
        scoreHeading.innerText = `Score: ${this.score}/${this.totalExercises}`;

        // Display mistakes if there are any
        if (Object.keys(this.mistakes).length > 0) {
            const mistakesHeading = contentEl.createEl('h3');
            mistakesHeading.innerText = 'Mistakes';

            const mistakesList = contentEl.createEl('ul');
            for (const correctIntervalKey in this.mistakes) {
                if (Object.prototype.hasOwnProperty.call(this.mistakes, correctIntervalKey)) {
                    const correctIntervalLabel = intervalMap[correctIntervalKey]; // Retrieve the English label
                    const mistakeItem = mistakesList.createEl('li');
                    mistakeItem.innerText = `You mixed up ${correctIntervalLabel} with:`;

                    const subList = mistakeItem.createEl('ul');
                    for (const mistakenIntervalKey in this.mistakes[correctIntervalKey]) {
                        if (Object.prototype.hasOwnProperty.call(this.mistakes[correctIntervalKey], mistakenIntervalKey)) {
                            const mistakenIntervalLabel = intervalMap[mistakenIntervalKey]; // Retrieve the English label
                            const subItem = subList.createEl('li');
                            subItem.innerText = `${mistakenIntervalLabel} ${this.mistakes[correctIntervalKey][mistakenIntervalKey]} times.`;
                        }
                    }
                }
            }
        } else {
            // Display congratulations if no mistakes
            const congratsText = contentEl.createEl('p');
            congratsText.innerText = 'Congratulations! You have successfully completed your ear training.';
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
