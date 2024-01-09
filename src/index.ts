#!/usr/bin/env node
import { cleanupSingleProject } from './cleanupSingleProject.js';
import { program } from 'commander';
import { format as formatPath, parse as parsePath } from 'node:path';

async function defaultAction(projectPath: string, options: Record<string, string>): Promise<void> {
    console.debug(projectPath, options);

    let editorBundleExtra: string | null = null;
    if ('editorBundleExtra' in options) editorBundleExtra = options.editorBundleExtra;

    let outputPath: string;
    if ('output' in options) {
        outputPath = options.output;
    } else {
        const tempPath = parsePath(projectPath);
        tempPath.base = `cleaned-${tempPath.base}`;
        outputPath = formatPath(tempPath);
    }

    console.log(`Cleaning up project: "${projectPath}"...`);
    try {
        await cleanupSingleProject(projectPath, outputPath, editorBundleExtra);
    } catch(err) {
        console.error('Could not clean up project:');
        throw err;
    }
}

program
    .argument('<project-path>', 'File path to project file that needs to be cleaned')
    .option('-o, --output <path>', 'Where the cleaned project file will be stored. Does not override the input project by default')
    .option('-b, --editor-bundle-extra <path>', 'Add extra definitions to the editor bundle via a JS script')
    .action(defaultAction)

program.parseAsync();