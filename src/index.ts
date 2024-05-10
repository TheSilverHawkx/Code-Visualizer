#!/usr/bin/env node

import { InvalidOptionArgumentError, program } from "commander";
import {existsSync} from 'fs';

function parsePath(value: string): string {
    
    if (! existsSync(value)) {
        throw new InvalidOptionArgumentError(`Error: folder path '${value}' doesn't exist`)
    } else {
        return value
    }
}

program
    .version('0.1.0')
    .description('Code visualization tool')
    .option('-p, --folder-path <path>','Set the folder path',parsePath)
    .action((options) => {
        if (options.folderPath === undefined) {
            console.error('Error: flag -p / --folder-path is required')
            process.exit(1)
        }
        console.log(`Folder path: ${options.folderPath}`)
    });


program.parse(process.argv);