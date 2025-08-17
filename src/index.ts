import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";


console.log("hello world!");
const username = "washed up player#bored";
const apiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
const profileData = await Playwright.fetch<ApiResponse>(apiURL);

if (!profileData) {
    console.log("No Profile Data found");
    process.exit(1);
}

const platformInfo = profileData.data.platformInfo;

profileData?.data?.segments?.forEach(segment => {
    if(segment.type != "season") {
        return;
    }

    const metadata = segment.metadata;
    const seasonName = metadata.name;
    const playlistName = metadata.playlistName;

    const stats = segment.stats;
    
    for (const key in stats) {
        const stat = stats[key];
        if (key == "attackKills") {
            console.log(`${platformInfo.platformUserHandle} had ${stat.value} attack kills in season ${seasonName}`);
        }
        if (key == "defenseKills") {
            console.log(`${platformInfo.platformUserHandle} had ${stat.value} defense kills in season ${seasonName}`);
        }
        if (key == "kills") {
            console.log(`${platformInfo.platformUserHandle} had ${stat.value} total kills in season ${seasonName}`);
        }
        
    }
})