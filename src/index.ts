import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";
import { spiderGraph } from "./graph";
import readline from "readline";

// TODO remove this example code and initialize an express listener

// console.log("hello world!");
// const username = "washed up player#bored";
// const username = "kash#psn";
async function fetchUserData(username: string) {
    const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
    //const seasonApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username) + "/segments/season?playlist=competitive&seasonId=16118998-4705-5813-86dd-0292a2439d90&source=web";
    const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);

    if (!profileData) {
        console.log("No Profile Data found");
        process.exit(1);
    }   

    // Process past 6 seasons
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
        } // if no data found 
        console.log(`\n=== ${seasonName} ===`);
        // const seasonEntry = seasonData.data[0]; // get the first season entry
        // const stats = seasonEntry.stats;
        const seasonEntry = seasonData.data.find((e) => e.type === "season");
            if (seasonEntry) {
                const stats = seasonEntry.stats;
                const totalRounds = (stats.roundsPlayed?.displayValue ?? 0);
                const attackKillsPerRound = (stats.attackKillsPerRound?.displayValue ?? 0);
                const defenseKillsPerRound = (stats.defenseKillsPerRound?.displayValue ?? 0);
                const totalKills = (stats.kills?.value ?? 0);
                const firstKills = Number(stats.firstBloods?.displayValue ?? 0);
                const firstKillsPerRound = (stats.firstBloodsPerRound?.displayValue ?? 0);
                const firstDeaths = Number(stats.firstDeaths?.displayValue ?? 0);
                const firstDeathsPerRound = (stats.firstDeathsPerRound?.displayValue ?? 0);
                const firstKillsToDeaths = firstDeaths > 0 ? firstKills / firstDeaths : firstKills;
                const KDR = (stats.kDRatio?.displayValue ?? 0);
                const KDA = (stats.kDARatio?.displayValue ?? 0);
                const KPR = (stats.killsPerRound?.displayValue ?? 0);
                const KAST = (stats.kAST?.displayValue ?? 0);
                const headshotPercentage = Number(stats.headshotsPercentage?.displayValue ?? 0);
                const trackerScore = (stats.trnPerformanceScore?.displayValue ?? 0);
                console.log(`${platformInfo.platformUserHandle} had ${totalRounds} total rounds`);
                console.log(`of these rounds...`)
                console.log(`${platformInfo.platformUserHandle} had a KD of ${KDR}`);
                console.log(`${platformInfo.platformUserHandle} had a KDA of ${KDA}`);
                console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
                console.log(`${platformInfo.platformUserHandle} had ${attackKillsPerRound} attack kills`);
                console.log(`${platformInfo.platformUserHandle} had ${defenseKillsPerRound} defense kills`);
                console.log(`${platformInfo.platformUserHandle} had ${KPR} kills per round`);
                console.log(`${platformInfo.platformUserHandle} had ${firstKills} first kills`);
                console.log(`${platformInfo.platformUserHandle} had ${firstKillsPerRound} first kills per round`);
                console.log(`${platformInfo.platformUserHandle} had ${firstDeaths} first deaths`);
                console.log(`${platformInfo.platformUserHandle} had ${firstDeathsPerRound} first deaths per round`);
                console.log(`${platformInfo.platformUserHandle} had an FK/FD ratio of ${firstKillsToDeaths}`);
                console.log(`${platformInfo.platformUserHandle} had a KAST of ${KAST}%`);
                if(headshotPercentage > 25)
                    console.log(`${platformInfo.platformUserHandle} had an above-average headshot percentage of ${headshotPercentage}`);
                console.log(`${platformInfo.platformUserHandle} had a tracker score of ${trackerScore}`);
                }
                const agentEntries = seasonData.data.filter((e) => e.type === "agent");
                agentEntries.sort(
                    (a, b) => Number(b.stats.roundsPlayed?.value ?? 0) - Number(a.stats.roundsPlayed?.value ?? 0)
                ); // sorts agents by rounds played
            for (const agent of agentEntries) {
                    const agentName = agent.metadata.name;
                    const roundsPlayed = (agent.stats.roundsPlayed?.displayValue ?? 0);
                    const agentKDA = Number(agent.stats.kDARatio?.displayValue ?? 0);
                    const agentKPR = Number(agent.stats.killsPerRound?.displayValue ?? 0);
                    const agentFirstBloodsPR = Number(agent.stats.firstBloodsPerRound?.displayValue ?? 0);
                    const agentFirstDeathsPR = Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0);
                    const agentFKFD = agentFirstDeathsPR > 0 ? agentFirstBloodsPR / agentFirstDeathsPR : 0;
                    const agentKAST = Number((agent.stats.kAST?.value ?? 0));
                    const clutchPercentage = (agent.stats.clutchesPercentage?.displayValue ?? 0);
                    const assistsPR = Number(agent.stats.assistsPerRound?.displayValue ?? 0);
                    const playerStats = {
                        agentKPR,
                        agentKAST,
                        agentKDA,
                        agentFKFD,
                        assistsPR,
                    };                
                    console.log(`=== ${platformInfo.platformUserHandle} played ${agentName} for ${roundsPlayed} rounds ===`);
                    console.log(`their ${agentName} had a K/DA of ${agentKDA}`);
                    console.log(`their ${agentName} had ${agentKPR} Kills Per Round`);
                    console.log(`their ${agentName} had ${agentFirstBloodsPR} first bloods per round`);
                    console.log(`their ${agentName} had ${agentFirstDeathsPR} first deaths per round`);
                    console.log(`their ${agentName} had an fk/fd of ${agentFKFD}`);
                    console.log(`their ${agentName} had a KAST of ${agentKAST}`);
                    console.log(`their ${agentName} had a clutch percentage of ${clutchPercentage}%`);
                    console.log(`their ${agentName} had ${assistsPR} Assists Per Round`);
                    await spiderGraph(platformInfo.platformUserHandle, agentName, roundsPlayed, playerStats, seasonName);
                }
            }
        console.log("End of Data");
        }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }); //input data
function inputUsername() {
  rl.question("Enter username (or type exit to exit): ", async (username) => {
    if(username.toLowerCase() === "exit") {
        console.log("Exiting");
        rl.close();
        process.exit(1);
        return;
    }
    await fetchUserData(username);
    inputUsername();
  });
}

inputUsername();
// https://api.tracker.gg/api/v2/valorant/standard/profile/riot/washed%20up%20player%23bored/segments/season?playlist=competitive&seasonId=ac12e9b3-47e6-9599-8fa1-0bb473e5efc7&source=web