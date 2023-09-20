#!/usr/bin/env node
import { cleanupSingleProject } from './cleanupSingleProject.js';

async function cleanupProject() {
    const path = process.argv[2];
    if (!path) {
        throw new Error('No project file path supplied');
    }

    console.log(`Cleaning up project: "${path}"...`);
    try {
        await cleanupSingleProject(path);
    } catch(err) {
        console.error('Could not clean up project:');
        throw err;
    }
}

await cleanupProject();