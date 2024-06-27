export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.substr(1);

export const convertCameltoSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

export const addSpaceInString = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1 $2').trim();

export const converHtmlToPlainText = (html: string) => html.replace(/<[^>]+>/g, '');
