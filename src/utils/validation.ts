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
export function showErrorTooltip(inputEl: any, message: string) {
	const tooltip = document.createElement("div");
	tooltip.textContent = message;
	tooltip.className = "setting-error-tooltip";

	const parent: HTMLInputElement = inputEl.parentElement.parentElement.parentElement;
	inputEl.style.color = 'red';
	inputEl.style.borderColor = 'red';
	parent.appendChild(tooltip);
}

// Function to remove error tooltip
export function removeErrorTooltip(inputEl: any) {
	const parent: HTMLInputElement = inputEl.parentElement.parentElement.parentElement;
	inputEl.style.color = '';
	inputEl.style.borderColor = '';
	const tooltip = parent.querySelector(".setting-error-tooltip");
	if (tooltip) {
		tooltip.remove();
	}
}
