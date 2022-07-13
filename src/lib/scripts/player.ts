import donwloadScore from './downloadScore';

export default async function getScore(url: string) {
    return await donwloadScore(url)
}