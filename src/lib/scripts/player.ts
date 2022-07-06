import decompress from './decompress';

const testURL = "https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTest.mxl?alt=media&token=002934fe-fc28-4223-a18c-7a57c45b743a"

export default async function loadMXL(url: string) {
    return await decompress(url ?? testURL);
}