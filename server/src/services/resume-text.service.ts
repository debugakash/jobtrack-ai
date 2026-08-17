import fs from "fs/promises";
import pdf from "../utils/pdf-parser.js";

import { BadRequestError } from "../errors/index.js";

export async function extractResumeText(filePath: string) {
  let fileBuffer: Buffer;

  try {
    fileBuffer = await fs.readFile(filePath);
  } catch {
    throw new BadRequestError("Unable to read resume file.");
  }

  try {
    const result = await pdf(fileBuffer);

    const text = result.text.trim();

    if (!text) {
      throw new BadRequestError(
        "Unable to extract readable text from this resume.",
      );
    }

    return text;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new BadRequestError(
      "Unable to extract readable text from this resume.",
    );
  }
}
