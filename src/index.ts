#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync } from "fs";

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .version("0.1.0")
    .usage("Usage: $0 -p <path to repo root>")
    .option("p", {
      alias: "folder-path",
      desc: "Path to repository",
      type: "string",
      demandOption: true,
      nargs: 1,
    })
    .check((argv) => {
      return argv.p && existsSync(argv.p);
    })
    .help("h")
    .alias("h", "help")
    .parse();

  console.log(`Scanning repository at ${argv.p}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
