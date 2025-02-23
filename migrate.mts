import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively finds all *.md files in the given folder.
 * @param dir The directory to search
 * @returns List of Markdown file paths
 */
const getAllMarkdownFiles = (dir: string): string[] => {
    let results: string[] = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(getAllMarkdownFiles(fullPath));
        } else if (file.endsWith('.md')) {
            results.push(fullPath);
        }
    }
    return results;
};

/**
 * Extracts the first line from a file
 * @param filePath Path to the file
 * @returns The first line or null if the file is empty
 */
const getFirstLine = (filePath: string): string | null => {
    const content = fs.readFileSync(filePath, 'utf8');
    const firstLine = content.split('\n').map((line) => line.trim())[0];
    return firstLine || null;
};

/**
 * Renames Markdown files based on the given pattern rules.
 * @param folder Path to the root directory
 */
const renameMarkdownFiles = (folder: string): void => {
    const mdFiles = getAllMarkdownFiles(folder);

    mdFiles.forEach((filePath) => {
        const fileName = path.basename(filePath);
        const dirName = path.dirname(filePath);
        const match = fileName.match(/^(\d{2})\.md$/);

        if (match) {
            const numberPart = match[1]; // Extract numeric part
            const firstLine = getFirstLine(filePath);

            if (firstLine && firstLine.startsWith('### ')) {
                // Extract title, remove '### ', normalize whitespace
                const title = firstLine.replace(/^###\s*/, '').trim();

                // Create alias: lowercase, replace spaces with dashes
                const alias = title.toLowerCase().replace(/\W+/g, '-');

                // Construct new file name
                const newFileName = `${numberPart}-${alias}.md`;
                const newFilePath = path.join(dirName, newFileName);

                // Rename file
                fs.renameSync(filePath, newFilePath);
                console.log(`Renamed: ${fileName} → ${newFileName}`);
            } else {
                console.log(
                    `Skipped: ${fileName} (First line did not match expected format)`
                );
            }
        } else {
            console.log(
                `Skipped: ${fileName} (Filename did not match expected pattern)`
            );
        }
    });
};

// Run the script with a folder path argument
const folderPath = process.argv[2];
if (!folderPath) {
    console.error('Usage: ts-node renameMdFiles.ts <folder>');
    process.exit(1);
}

renameMarkdownFiles(folderPath);
