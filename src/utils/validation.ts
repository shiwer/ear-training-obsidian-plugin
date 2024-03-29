import { Setting } from 'obsidian'

function isValidFilename(filename: string): boolean {
  const illegalRe = /[?<>\\:*|"]/g;
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

  return (
    !illegalRe.test(filename) &&
    !controlRe.test(filename) &&
    !reservedRe.test(filename) &&
    !windowsReservedRe.test(filename)
  );
}


export function validateFormat(format: string): string {
  if (!format) {
    return "";
  }

  if (!isValidFilename(format)) {
    return "Format contains illegal characters";
  }

  return "";
}


// Function to show error tooltip
export function showErrorTooltip(inputEl: HTMLElement, message: string) {
	const tooltip = document.createElement("div");
	tooltip.textContent = message;
	tooltip.className = "setting-error-tooltip";

	const parent: HTMLElement = inputEl.parentElement!.parentElement!.parentElement!;
	inputEl.classList.add('setting-error');
	parent.appendChild(tooltip);
}

// Function to remove error tooltip
export function removeErrorTooltip(inputEl: HTMLElement) {
	const parent: HTMLElement = inputEl.parentElement!.parentElement!.parentElement!;
	inputEl.classList.remove('setting-error')
	const tooltip = parent.querySelector(".setting-error-tooltip");
	if (tooltip) {
		tooltip.remove();
	}
}
