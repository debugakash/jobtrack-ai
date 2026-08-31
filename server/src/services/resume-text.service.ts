import pdf from "../utils/pdf-parser.js";

import { BadRequestError } from "../errors/index.js";

export async function extractResumeText(fileBuffer: Buffer) {
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
