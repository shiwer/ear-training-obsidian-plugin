import 'obsidian';

declare module 'obsidian' {
	interface DataAdapter {
		getBasePath(): string;
	}
}
