import { App, Notice, normalizePath } from 'obsidian';
import { intervalMap, chordsMap } from './../utils/constants';
import { noteNames } from './../utils/audio-utils';
import moment from "moment";

export class FileSaver {
	private app: App;
	private folderPath: string;
	private filenameFormat: string;

	private formatHeaderInfo(headerInfo: HeaderInfo) {
		let mdHeader = "---\n";
		mdHeader += "exercise: " + headerInfo.exercise + "\n";
		mdHeader += "mode: " + headerInfo.mode + "\n";
		mdHeader += "tonalities: " + headerInfo.tonalities + "\n";
		mdHeader += "numberOfChoices: " + headerInfo.numberOfChoices + "\n";
		mdHeader += "---\n\n";

		return mdHeader;
	}

	private formatResult(scoreInfo: ScoreInfo[]): string {
		let tableContent = "| # | Root Note | Played | Selected |\n";
		tableContent += "| --- | --- | --- | --- |\n";
		let playedNoteLabel:string;
		let selectedNotesLabel:string;
		let rootNoteLabel: string;
		scoreInfo.forEach((info, index) => {
			playedNoteLabel = intervalMap[info.playedNotes] ? intervalMap[info.playedNotes] : chordsMap[info.playedNotes]; // Retrieve the English label
			selectedNotesLabel = intervalMap[info.selectedNotes] ? intervalMap[info.selectedNotes] : chordsMap[info.selectedNotes]; // Retrieve the English label
			rootNoteLabel = noteNames[info.rootNote.pitch];

			tableContent += `| ${index + 1} | ${rootNoteLabel} | ${playedNoteLabel} | ${selectedNotesLabel} |\n`;
		});

		tableContent += "^ear-training-results"

		return tableContent;
	}

	constructor(app: App, folderPath: string, filenameFormat: string) {
		this.app = app;
		this.folderPath = folderPath;
		this.filenameFormat = filenameFormat;
	}

   async saveScoreInfo(headerInfo: HeaderInfo, scoreInfo: ScoreInfo[]): void {
		const fileName = `${moment().format(this.filenameFormat)}`;

		const normalizedFolderPath = normalizePath(this.folderPath);
		if (!this.app.vault.getAbstractFileByPath(normalizedFolderPath)) {
			await this.app.vault.createFolder(normalizedFolderPath);
		}

		// Construct the full path to save the file
		const filePath = `${normalizedFolderPath}/${fileName}.md`;

		// Create or get the file in Obsidian

		// Format the scoreInfo as a table
		let mdContent = this.formatHeaderInfo(headerInfo);
		mdContent += this.formatResult(scoreInfo);

		// Write data to the file
		try {
			await this.app.vault.adapter.write(filePath, mdContent);
			new Notice(`Map saved to ${filePath}`);
		} catch (error) {
			console.error("Error saving map:", error);
			new Notice("Error saving map. Please check the console for details.");
		}
	}
}
