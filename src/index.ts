#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync } from "fs";
import { FileCrawler } from "./repo-crawler/file-crawler.service";
import { ProgrammingLanguage } from "./repo-crawler/consts/language-to-file-exntension.map";

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
    default: "Javascript",
    choices: Object.keys(ProgrammingLanguage)
  })
  .usage("Usage: $0 --folder-path <path to repo root> [--language <language name>]")
  .parse();
}

async function main() {
  const argv = await parseArgs();

  console.log(`Scanning repository at ${argv["folder-path"]} for ${argv.language} files`);

  const repoCrawler = new FileCrawler()
  const files = await repoCrawler.getAllFilePathsByProgrammingLanguage(
    <ProgrammingLanguage>argv.language,
    argv["folder-path"]
  );

  if (!files) {
    console.log("No files found")
    process.exit(0)
  }

  console.log(`Files found:`)
  for (const file of files) {
    console.log(file.fullpath())
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
