import fs from 'fs';

/**
 * Reads the prompt from prompt.txt and replaces the placeholder.
 * @param {string} replacement - The text to insert in place of "### Input to parser ###".
 * @returns {string} - The full modified prompt.
 */
export function updatePrompt(fileContent: string) {
    // Read prompt.txt file
    const promptText = fs.readFileSync('src/prompt.txt', 'utf-8');

    // Return the full updated text
    return promptText.replace('### Input to parser ###', fileContent);
}
