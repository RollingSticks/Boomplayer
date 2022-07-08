import decompress from "./decompress";
import type { Score } from "./interfaces";

export default async function loadMXL() {
    const json: Score = await decompress("https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTitleScore.mxl?alt=media&token=cac7bb4a-0bbd-4fbf-9e20-32a72619f193")

    return json;
}