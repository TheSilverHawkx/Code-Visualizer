#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync } from "fs";
import { ProgrammingLanguage } from "./file-crawler/consts/language-to-file-exntension.map";
import { supportedEcmaVersions } from "./code-parser/consts/js-code-parser.consts";
import { createCodeParser } from "./code-parser/code-parser.utils";

async function parseArgs() {
  return await yargs(hideBin(process.argv))
  .version("0.1.0")
  .option("folder-path", {
    desc: "Path to repository",
    type: "string",
    demandOption: true,
    nargs: 1,
  })
  .check((argv) => {
    return argv["folder-path"] && existsSync(argv["folder-path"]);
  })
  .help("h")
  .alias("h", "help")
  .option("language",{
    desc: "Programming language to scan",
    type: "string",
    demandOption: true,
    default: "Javascript",
    choices: Object.keys(ProgrammingLanguage)
  })
  .option("es-version", {
    desc:'ES version of the code',
    type: 'number',
    choices:supportedEcmaVersions
  })
  .usage("Usage: $0 --folder-path <path to repo root> [--language <language name>]")
  .parse();
}

async function main() {
  const argv = await parseArgs();

  console.log(`Scanning repository at ${argv["folder-path"]} for ${argv.language} files`);

  const parser = createCodeParser(<ProgrammingLanguage>argv.language);

  parser.scan(argv.folderPath)
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
