import decompress from "./decompress";

export default async function loadMXL(url: string) {
    console.log(await decompress(url));
}