import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";
// TODO remove this example code and initialize an express listener

console.log("hello world!");
// const username = "washed up player#bored";
const username = "kash#psn";
const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
//const seasonApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username) + "/segments/season?playlist=competitive&seasonId=16118998-4705-5813-86dd-0292a2439d90&source=web";
const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);

if (!profileData) {
    console.log("No Profile Data found");
    process.exit(1);
}   

// Process past seasons dynamically
const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 6);

for (const season of lastSixSeasons) {
    const seasonId = season.id;
    const seasonName = season.name;

    // dynamically construct the season API URL
    const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${seasonId}&source=web`;
    console.log(`Fetching data for ${seasonName} from ${seasonUrl}`);

    // const seasonData = await Playwright.fetch<ApiResponse>(seasonUrl);

    // const platformInfo = profileData.data.platformInfo;
    

    // if (!seasonData?.data?.stats) {
    //     console.log(`No season segment found for ${seasonName}`);
    //     continue;
    // }

    // const stats = seasonData.data.stats;

    const seasonData = await Playwright.fetch<SeasonApiResponse>(seasonUrl);
    const platformInfo = profileData.data.platformInfo;

    if (!seasonData?.data || seasonData.data.length === 0) {
        console.log(`No season data found for ${seasonName}`);
        continue;
    }

    const seasonEntry = seasonData.data[0]; // get the first season entry
    const stats = seasonEntry.stats;
    const attackKillsPerRound = Number(stats.attackKillsPerRound?.value ?? 0);
    const defenseKillsPerRound = Number(stats.defenseKillsPerRound?.value ?? 0);
    const totalKills = Number(stats.kills?.value ?? 0);
    const firstKills = Number(stats.firstBloods?.value ?? 0);
    const firstKillsPerRound = Number(stats.firstBloodsPerRound?.value ?? 0);
    const firstDeaths = Number(stats.firstDeaths?.value ?? 0);
    const firstDeathsPerRound = Number(stats.firstDeathsPerRound?.value ?? 0);
    const firstKillsToDeaths = firstDeaths > 0 ? firstKills / firstDeaths : firstKills;
    const KPR = Number(stats.killsPerRound?.value ?? 0);
    const KAST = Number(stats.KAST?.value ?? 0);
    const headshotPercentage = Number(stats.sPercentageheadshot?.value ?? 0);
    const trackerScore = Number(stats.trnPerformanceScore?.value ?? 0);

    console.log(`\n=== ${seasonName} ===`);
    console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
    console.log(`${platformInfo.platformUserHandle} had ${attackKillsPerRound} attack kills`);
    console.log(`${platformInfo.platformUserHandle} had ${defenseKillsPerRound} defense kills`);
    console.log(`${platformInfo.platformUserHandle} had ${KPR} kills per round`);
    console.log(`${platformInfo.platformUserHandle} had ${firstKills} first kills`);
    console.log(`${platformInfo.platformUserHandle} had ${firstKillsPerRound} first kills per round`);
    console.log(`${platformInfo.platformUserHandle} had ${firstDeathsPerRound} first deaths per round`);
    console.log(`${platformInfo.platformUserHandle} had an FK/FD ratio of ${firstKillsToDeaths}`);
    console.log(`${platformInfo.platformUserHandle} had a KAST of ${KAST}`);
    if(headshotPercentage > 25)
        console.log(`${platformInfo.platformUserHandle} had an above-average headshot percentage of ${headshotPercentage}`);
    console.log(`${platformInfo.platformUserHandle} had a tracker score of ${trackerScore}`);
}

    // seasonData?.data?.segments?.forEach(segment => {
    //     if(segment.type != "season") {
    //         return;
    //     }
    
    //     const metadata = segment.metadata;
    //     const seasonName = metadata.name;
    //     const playlistName = metadata.playlistName;
    
    //     const stats = segment.stats;
        
    //     for (const key in stats) {
    //         const stat = stats[key];
    //         if (key == "attackKills") {
    //             console.log(`${platformInfo.platformUserHandle} had ${stat.value} attack kills in season ${seasonName}`);
    //         }
    //         if (key == "defenseKills") {
    //             console.log(`${platformInfo.platformUserHandle} had ${stat.value} defense kills in season ${seasonName}`);
    //         }
    //         if (key == "kills") {
    //             console.log(`${platformInfo.platformUserHandle} had ${stat.value} total kills in season ${seasonName}`);
    //         }
    //     }
    // })
    // if (!seasonData?.data?.segments) {
    //     console.log(`No segments found for ${seasonName}`);
    //     continue;
    // }
    
// https://api.tracker.gg/api/v2/valorant/standard/profile/riot/washed%20up%20player%23bored/segments/season?playlist=competitive&seasonId=ac12e9b3-47e6-9599-8fa1-0bb473e5efc7&source=web