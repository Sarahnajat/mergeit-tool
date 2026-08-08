import { convert } from "subs-converter";

export type SubtitleFormat =
  | "srt"
  | "ass";

export async function convertSubtitle(
  file: File,
  outputFormat: SubtitleFormat
) {
  try {
    // Read uploaded file
    const content = await file.text();

    // Convert
    const converted = convert(content, "auto", outputFormat);

    // Original filename without extension
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    // Create downloadable file
    const blob = new Blob([converted], {
      type: "text/plain;charset=utf-8",
    });

    return {
      success: true,
      blob,
      filename: `${fileName}.${outputFormat}`,
      content: converted,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Conversion failed",
    };
  }
}