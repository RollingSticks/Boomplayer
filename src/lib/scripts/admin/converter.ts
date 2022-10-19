import * as zip from "@zip.js/zip.js";
import { XMLParser } from "fast-xml-parser";
import type { ScoreRaw } from "$lib/scripts/interfaces";

const parser = new XMLParser();

export default async function xmlZipToJson(
	data: Blob
): Promise<ScoreRaw | undefined> {
	try {
		const reader = new zip.ZipReader(new zip.BlobReader(data));

		const entries: zip.Entry[] = await reader.getEntries();
		const unzippedData = entries[1].getData
			? await entries[1].getData(new zip.TextWriter())
			: "";

		reader.close();

		return parser.parse(unzippedData);
	} catch (error) {
		dispatchEvent(
			new ErrorEvent("error", {
				error: {
					message: "Kon nummer niet converteren",
					retryable: true,
					error: error
				}
			})
		);
	}
}
