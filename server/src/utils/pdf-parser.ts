import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

type PdfParseResult = {
  text: string;
  numpages: number;
  numrender: number;
  info: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

type PdfParseOptions = {
  max?: number;
};

type PdfParser = (
  dataBuffer: Buffer,
  options?: PdfParseOptions,
) => Promise<PdfParseResult>;

const pdfParse = require("pdf-parse/lib/pdf-parse.js") as PdfParser;

export default pdfParse;
