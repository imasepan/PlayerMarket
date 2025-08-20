import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";


console.log("hello world!");
const username = "washed up player#bored";
const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
//const seasonApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username) + "/segments/season?playlist=competitive&seasonId=16118998-4705-5813-86dd-0292a2439d90&source=web";
const profileData = await Playwright.fetch<ApiResponse>(baseApiURL);

if (!profileData) {
    console.log("No Profile Data found");
    process.exit(1);
}

const platformInfo = profileData.data.platformInfo;

// profileData?.data?.segments?.forEach(segment => {
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

// const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 6); // makes a new array with the first 6 seasons

// lastSixSeasons.forEach(season => {
//     const seasonId = season.id; //get season id for each season
//     const seasonName = season.name; //get name for each season

//     const segment = profileData.data.segments.find( //find matching segments for each season
//         seg => seg.type === "season" && seg.attributes.seasonId === seasonId //only looks at season and checks for id match
//     );

//     if (!segment) {
//         console.log(`No stats found for ${seasonName}`); //if season data doesnt exist 
//         return;
//     }

//     const stats = segment.stats; //stats for the season
//     const attackKills = stats.attackKills?.value ?? 0; //attack kills for the season
//     const defenseKills = stats.defenseKills?.value ?? 0; //defense kills for the season
//     const totalKills = stats.kills?.value ?? 0; //total kills for the season

//     console.log(`\n=== ${seasonName} ===`); //outputting
//     console.log(`${platformInfo.platformUserHandle} had ${attackKills} attack kills`);
//     console.log(`${platformInfo.platformUserHandle} had ${defenseKills} defense kills`);
//     console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
// });

// Process current season segments
// profileData?.data?.segments?.forEach(segment => {
//     if (segment.type !== "season") return;

//     const metadata = segment.metadata;
//     const seasonName = metadata.name;
//     const playlistName = metadata.playlistName;
//     const stats = segment.stats;

//     const attackKills = stats.attackKills?.value ?? 0;
//     const defenseKills = stats.defenseKills?.value ?? 0;
//     const totalKills = stats.kills?.value ?? 0;

//     console.log(`\n=== ${seasonName} (${playlistName}) ===`);
//     console.log(`${platformInfo.platformUserHandle} had ${attackKills} attack kills`);
//     console.log(`${platformInfo.platformUserHandle} had ${defenseKills} defense kills`);
//     console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
// });

// Process past seasons dynamically
const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 6);

for (const season of lastSixSeasons) {
    const seasonId = season.id;
    const seasonName = season.name;

    // dynamically construct the season API URL
    const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${seasonId}&source=web`;
    console.log(`Fetching data for ${seasonName} from ${seasonUrl}`);

    const seasonData = await Playwright.fetch<ApiResponse>(seasonUrl);

    if (!seasonData?.data?.segments) {
        console.log(`No segments found for ${seasonName}`);
        continue;
    }

    const seasonSegment = seasonData.data.segments.find(seg => seg.type === "season");
    if (!seasonSegment) {
        console.log(`No season segment found for ${seasonName}`);
        continue;
    }

    const stats = seasonSegment.stats;
    const attackKills = stats.attackKills?.value ?? 0;
    const defenseKills = stats.defenseKills?.value ?? 0;
    const totalKills = stats.kills?.value ?? 0;

    console.log(`\n=== ${seasonName} ===`);
    console.log(`${platformInfo.platformUserHandle} had ${attackKills} attack kills`);
    console.log(`${platformInfo.platformUserHandle} had ${defenseKills} defense kills`);
    console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
}
