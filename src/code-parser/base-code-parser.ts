import { Path } from "glob";
import { JavascriptCodeParserOptions } from "./types/code-parser.types";

export abstract class BaseCodeParser {

    abstract parseFile(filePath: Path, options?: JavascriptCodeParserOptions): void

    abstract scan(folderPath: string): void
     
}