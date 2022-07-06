import decompress from 'mxldecompress';

const url = "https://firebasestorage.googleapis.com/v0/b/rollingsticksdev.appspot.com/o/media%2FTest.mxl?alt=media&token=002934fe-fc28-4223-a18c-7a57c45b743a"

export default async function loadMXL(_url: string = url) {
    return await decompress(_url);
}