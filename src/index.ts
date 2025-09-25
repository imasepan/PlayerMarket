import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";
import { controllerSpiderGraph } from "./graph";
import { initiatorSpiderGraph } from "./graph";
import { sentinelSpiderGraph } from "./graph";
import { duelistSpiderGraph } from "./graph";
import readline from "readline";

// TODO remove this example code and initialize an express listener

// console.log("hello world!");
// const username = "washed up player#bored";
// const username = "kash#psn";
export async function fetchUserData(username: string): Promise<any | null> {
    const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
    //const seasonApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username) + "/segments/season?playlist=competitive&seasonId=16118998-4705-5813-86dd-0292a2439d90&source=web";
    const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);

    if (!profileData) {
        console.log("No Profile Data found");
        process.exit(1);
    }   

    // Process past 6 seasons
    const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 1);

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
                    const agentDamagePerRound = Number(agent.stats.damagePerRound?.displayValue ?? 0);
                    const agentFirstBloods = Number(agent.stats.firstBloods?.displayValue ?? 0);
                    const agentFirstDeaths = Number(agent.stats.firstDeaths?.displayValue ?? 0);
                    const agentFirstBloodsPR = Number(agent.stats.firstBloodsPerRound?.displayValue ?? 0);
                    const agentFirstDeathsPR = Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0);
                    const agentFKFD = agentFirstDeathsPR > 0 ? agentFirstBloodsPR / agentFirstDeathsPR : 0;
                    const agentEntryRate = agentFirstBloods > 0 ? (agentFirstBloods / (agentFirstBloods + agentFirstDeaths)) * 100 : 0;
                    const agentKAST = Number((agent.stats.kAST?.value ?? 0));
                    const clutchPercentage = (agent.stats.clutchesPercentage?.displayValue ?? 0);
                    const assistsPR = Number(agent.stats.assistsPerRound?.displayValue ?? 0);
                    const controllerStats = {
                        agentKPR,
                        agentKAST,
                        agentKDA,
                        agentFirstDeathsPR,
                        assistsPR,
                    };
                    const initiatorStats = {
                        agentKPR,
                        agentKAST,
                        agentKDA,
                        agentFirstDeathsPR,
                        assistsPR,
                    };
                    const sentinelStats = {
                        agentKPR,
                        agentKAST,
                        agentKDA,
                        agentFirstDeathsPR,
                        assistsPR,
                    };
                    const duelistStats = {
                        agentKPR,
                        agentKAST,
                        agentKDA,
                        agentEntryRate,
                        agentDamagePerRound,
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
                    if (["Omen", "Clove", "Brimstone", "Harbor", "Astra"].includes(agentName)) {
                        await controllerSpiderGraph(platformInfo.platformUserHandle, agentName, roundsPlayed, controllerStats, seasonName);
                    }
                    
                    if (["Skye", "Tejo", "Sova", "Fade", "KAY/O", "Gekko", "Breach"].includes(agentName)) {
                        await initiatorSpiderGraph(platformInfo.platformUserHandle, agentName, roundsPlayed, initiatorStats, seasonName);
                    }
                    
                    if (["Cypher", "Vyse", "Deadlock", "Viper", "Killjoy"].includes(agentName)) {
                        await sentinelSpiderGraph(platformInfo.platformUserHandle, agentName, roundsPlayed, sentinelStats, seasonName);
                    }
                    
                    if (["Jett", "Raze", "Waylay", "Reyna", "Iso", "Neon", "Yoru", "Phoenix", "Chamber"].includes(agentName)) {
                        await duelistSpiderGraph(platformInfo.platformUserHandle, agentName, roundsPlayed, duelistStats, seasonName);
                    }                    
                    // // Map roles to agent names and corresponding functions
                    // const agentRoles = [
                    //     {
                    //     names: ["Omen", "Clove", "Brimstone", "Harbor", "Astra"],
                    //     fn: controllerSpiderGraph,
                    //     stats: controllerStats,
                    //     },
                    //     {
                    //     names: ["Skye", "Tejo", "Sova", "Fade", "KAY/O", "Gekko", "Breach"],
                    //     fn: initiatorSpiderGraph,
                    //     stats: initiatorStats,
                    //     },
                    //     {
                    //     names: ["Cypher", "Vyse", "Deadlock", "Viper", "Killjoy", "Chamber"],
                    //     fn: sentinelSpiderGraph,
                    //     stats: sentinelStats,
                    //     },
                    //     {
                    //     names: ["Jett", "Raze", "Waylay", "Reyna", "Iso", "Neon", "Yoru", "Phoenix"],
                    //     fn: duelistSpiderGraph,
                    //     stats: duelistStats,
                    //     },
                    // ];
                    
                    // // Find the role for the agent
                    // const role = agentRoles.find(r => r.names.includes(agentName));
                    // if (role) {
                    //     await role.fn(platformInfo.platformUserHandle, agentName, roundsPlayed, role.stats, seasonName);
                    // }
                    const agentStats: Record<string, any> = {};

                    for (const agent of agentEntries) {
                        const agentName = agent.metadata.name;
                        const stats = {
                        agentKDA: Number(agent.stats.kDARatio?.displayValue ?? 0),
                        agentKPR: Number(agent.stats.killsPerRound?.displayValue ?? 0),
                        agentKAST: Number(agent.stats.kAST?.value ?? 0),
                        agentFirstBloodsPR: Number(agent.stats.firstBloodsPerRound?.displayValue ?? 0),
                        agentFirstDeathsPR: Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0),
                        assistsPR: Number(agent.stats.assistsPerRound?.displayValue ?? 0),
                        agentDamagePerRound: Number(agent.stats.damagePerRound?.displayValue ?? 0),
                        };
                        agentStats[agentName] = stats;
                    }

                    return {
                        username: profileData.data.platformInfo.platformUserHandle,
                        agents: agentStats,
                    };
                }
            }
        console.log("End of Data");
        }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }); //input data
// function inputUsername() {
//   rl.question("Enter username (or type exit to exit): ", async (username) => {
//     if(username.toLowerCase() === "exit") {
//         console.log("Exiting");
//         rl.close();
//         process.exit(1);
//         return;
//     }
//     await fetchUserData(username);
//     inputUsername();
//   });
// }
export function startSinglePlayerPrompt() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    function inputUsername() {
        rl.question("Enter username (or type exit to exit): ", async (username) => {
            if (username.toLowerCase() === "exit") {
                console.log("Exiting");
                rl.close();
                process.exit(1);
            }
            await fetchUserData(username);
            inputUsername();
        });
    }

    inputUsername();
}

if (import.meta.main) {
    startSinglePlayerPrompt();
}

// https://api.tracker.gg/api/v2/valorant/standard/profile/riot/washed%20up%20player%23bored/segments/season?playlist=competitive&seasonId=ac12e9b3-47e6-9599-8fa1-0bb473e5efc7&source=web

// import { getEnv } from "./utils/env";
// import { Playwright } from "./utils/playwright";
// import { controllerSpiderGraph } from "./graph";
// import { initiatorSpiderGraph } from "./graph";
// import { sentinelSpiderGraph } from "./graph";
// import { duelistSpiderGraph } from "./graph";
// import readline from "readline";

// // Pure data fetching function - NO interactive prompts
// export async function fetchUserData(username: string): Promise<any | null> {
//     try {
//         const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
//         const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);

//         if (!profileData) {
//             console.log("No Profile Data found");
//             return null;
//         }   

//         // Process past 6 seasons
//         const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 1);

//         for (const season of lastSixSeasons) {
//             const seasonId = season.id;
//             const seasonName = season.name;

//             // dynamically construct the season API URL
//             const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${seasonId}&source=web`;
//             console.log(`Fetching data for ${seasonName} from ${seasonUrl}`);

//             const seasonData = await Playwright.fetch<SeasonApiResponse>(seasonUrl);
//             const platformInfo = profileData.data.platformInfo;

//             if (!seasonData?.data || seasonData.data.length === 0) {
//                 console.log(`No season data found for ${seasonName}`);
//                 continue;
//             }
            
//             console.log(`\n=== ${seasonName} ===`);
            
//             const seasonEntry = seasonData.data.find((e) => e.type === "season");
//             if (seasonEntry) {
//                 const stats = seasonEntry.stats;
//                 const totalRounds = (stats.roundsPlayed?.displayValue ?? 0);
//                 const attackKillsPerRound = (stats.attackKillsPerRound?.displayValue ?? 0);
//                 const defenseKillsPerRound = (stats.defenseKillsPerRound?.displayValue ?? 0);
//                 const totalKills = (stats.kills?.value ?? 0);
//                 const firstKills = Number(stats.firstBloods?.displayValue ?? 0);
//                 const firstKillsPerRound = (stats.firstBloodsPerRound?.displayValue ?? 0);
//                 const firstDeaths = Number(stats.firstDeaths?.displayValue ?? 0);
//                 const firstDeathsPerRound = (stats.firstDeathsPerRound?.displayValue ?? 0);
//                 const firstKillsToDeaths = firstDeaths > 0 ? firstKills / firstDeaths : firstKills;
//                 const KDR = (stats.kDRatio?.displayValue ?? 0);
//                 const KDA = (stats.kDARatio?.displayValue ?? 0);
//                 const KPR = (stats.killsPerRound?.displayValue ?? 0);
//                 const KAST = (stats.kAST?.displayValue ?? 0);
//                 const headshotPercentage = Number(stats.headshotsPercentage?.displayValue ?? 0);
//                 const trackerScore = (stats.trnPerformanceScore?.displayValue ?? 0);
                
//                 console.log(`${platformInfo.platformUserHandle} had ${totalRounds} total rounds`);
//                 console.log(`of these rounds...`)
//                 console.log(`${platformInfo.platformUserHandle} had a KD of ${KDR}`);
//                 console.log(`${platformInfo.platformUserHandle} had a KDA of ${KDA}`);
//                 console.log(`${platformInfo.platformUserHandle} had ${totalKills} total kills`);
//                 console.log(`${platformInfo.platformUserHandle} had ${attackKillsPerRound} attack kills`);
//                 console.log(`${platformInfo.platformUserHandle} had ${defenseKillsPerRound} defense kills`);
//                 console.log(`${platformInfo.platformUserHandle} had ${KPR} kills per round`);
//                 console.log(`${platformInfo.platformUserHandle} had ${firstKills} first kills`);
//                 console.log(`${platformInfo.platformUserHandle} had ${firstKillsPerRound} first kills per round`);
//                 console.log(`${platformInfo.platformUserHandle} had ${firstDeaths} first deaths`);
//                 console.log(`${platformInfo.platformUserHandle} had ${firstDeathsPerRound} first deaths per round`);
//                 console.log(`${platformInfo.platformUserHandle} had an FK/FD ratio of ${firstKillsToDeaths}`);
//                 console.log(`${platformInfo.platformUserHandle} had a KAST of ${KAST}%`);
//                 if(headshotPercentage > 25)
//                     console.log(`${platformInfo.platformUserHandle} had an above-average headshot percentage of ${headshotPercentage}`);
//                 console.log(`${platformInfo.platformUserHandle} had a tracker score of ${trackerScore}`);
//             }
            
//             const agentEntries = seasonData.data.filter((e) => e.type === "agent");
//             agentEntries.sort(
//                 (a, b) => Number(b.stats.roundsPlayed?.value ?? 0) - Number(a.stats.roundsPlayed?.value ?? 0)
//             );

//             // Create the return data structure
//             const agentStats: Record<string, any> = {};

//             for (const agent of agentEntries) {
//                 const agentName = agent.metadata.name;
//                 const roundsPlayed = (agent.stats.roundsPlayed?.displayValue ?? 0);
//                 const agentKDA = Number(agent.stats.kDARatio?.displayValue ?? 0);
//                 const agentKPR = Number(agent.stats.killsPerRound?.displayValue ?? 0);
//                 const agentDamagePerRound = Number(agent.stats.damagePerRound?.displayValue ?? 0);
//                 const agentFirstBloods = Number(agent.stats.firstBloods?.displayValue ?? 0);
//                 const agentFirstDeaths = Number(agent.stats.firstDeaths?.displayValue ?? 0);
//                 const agentFirstBloodsPR = Number(agent.stats.firstBloodsPerRound?.displayValue ?? 0);
//                 const agentFirstDeathsPR = Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0);
//                 const agentFKFD = agentFirstDeathsPR > 0 ? agentFirstBloodsPR / agentFirstDeathsPR : 0;
//                 const agentEntryRate = agentFirstBloods > 0 ? (agentFirstBloods / (agentFirstBloods + agentFirstDeaths)) * 100 : 0;
//                 const agentKAST = Number((agent.stats.kAST?.value ?? 0));
//                 const clutchPercentage = (agent.stats.clutchesPercentage?.displayValue ?? 0);
//                 const assistsPR = Number(agent.stats.assistsPerRound?.displayValue ?? 0);

//                 // Store all stats for return
//                 agentStats[agentName] = {
//                     agentKDA,
//                     agentKPR,
//                     agentKAST,
//                     agentFirstBloodsPR,
//                     agentFirstDeathsPR,
//                     assistsPR,
//                     agentDamagePerRound,
//                     agentEntryRate,
//                     roundsPlayed
//                 };

//                 console.log(`=== ${platformInfo.platformUserHandle} played ${agentName} for ${roundsPlayed} rounds ===`);
//                 console.log(`their ${agentName} had a K/DA of ${agentKDA}`);
//                 console.log(`their ${agentName} had ${agentKPR} Kills Per Round`);
//                 console.log(`their ${agentName} had ${agentFirstBloodsPR} first bloods per round`);
//                 console.log(`their ${agentName} had ${agentFirstDeathsPR} first deaths per round`);
//                 console.log(`their ${agentName} had an fk/fd of ${agentFKFD}`);
//                 console.log(`their ${agentName} had a KAST of ${agentKAST}`);
//                 console.log(`their ${agentName} had a clutch percentage of ${clutchPercentage}%`);
//                 console.log(`their ${agentName} had ${assistsPR} Assists Per Round`);
//             }

//             console.log("End of Data");
            
//             // Return the structured data
//             return {
//                 username: profileData.data.platformInfo.platformUserHandle,
//                 agents: agentStats,
//             };
//         }
        
//         return null;
//     } catch (error) {
//         console.error(`Error fetching data for ${username}:`, error);
//         return null;
//     }
// }

// // Function that generates spider graphs for a user (used by the interactive mode)
// export async function generateSpiderGraphsForUser(username: string): Promise<void> {
//     const userData = await fetchUserData(username);
//     if (!userData) {
//         console.log(`Failed to fetch data for ${username}`);
//         return;
//     }

//     const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
//     const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);
//     if (!profileData) return;

//     const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 1);
//     const season = lastSixSeasons[0];
//     const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${season.id}&source=web`;
//     const seasonData = await Playwright.fetch<SeasonApiResponse>(seasonUrl);
//     if (!seasonData?.data) return;

//     const agentEntries = seasonData.data.filter((e) => e.type === "agent");
//     agentEntries.sort(
//         (a, b) => Number(b.stats.roundsPlayed?.value ?? 0) - Number(a.stats.roundsPlayed?.value ?? 0)
//     );

//     for (const agent of agentEntries) {
//         const agentName = agent.metadata.name;
//         const roundsPlayed = agent.stats.roundsPlayed?.displayValue ?? "0";
//         const agentKDA = Number(agent.stats.kDARatio?.displayValue ?? 0);
//         const agentKPR = Number(agent.stats.killsPerRound?.displayValue ?? 0);
//         const agentFirstDeathsPR = Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0);
//         const agentKAST = Number(agent.stats.kAST?.value ?? 0);
//         const assistsPR = Number(agent.stats.assistsPerRound?.displayValue ?? 0);
//         const agentDamagePerRound = Number(agent.stats.damagePerRound?.displayValue ?? 0);
//         const agentFirstBloods = Number(agent.stats.firstBloods?.displayValue ?? 0);
//         const agentFirstDeaths = Number(agent.stats.firstDeaths?.displayValue ?? 0);
//         const agentEntryRate = agentFirstBloods > 0 ? (agentFirstBloods / (agentFirstBloods + agentFirstDeaths)) * 100 : 0;

//         const controllerStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
//         const initiatorStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
//         const sentinelStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
//         const duelistStats = { agentKPR, agentKAST, agentKDA, agentEntryRate, agentDamagePerRound };

//         if (["Omen", "Clove", "Brimstone", "Harbor", "Astra"].includes(agentName)) {
//             await controllerSpiderGraph(userData.username, agentName, roundsPlayed, controllerStats, season.name);
//         } else if (["Skye", "Tejo", "Sova", "Fade", "KAY/O", "Gekko", "Breach"].includes(agentName)) {
//             await initiatorSpiderGraph(userData.username, agentName, roundsPlayed, initiatorStats, season.name);
//         } else if (["Cypher", "Vyse", "Deadlock", "Viper", "Killjoy"].includes(agentName)) {
//             await sentinelSpiderGraph(userData.username, agentName, roundsPlayed, sentinelStats, season.name);
//         } else if (["Jett", "Raze", "Waylay", "Reyna", "Iso", "Neon", "Yoru", "Phoenix", "Chamber"].includes(agentName)) {
//             await duelistSpiderGraph(userData.username, agentName, roundsPlayed, duelistStats, season.name);
//         }
//     }
// }

// // Interactive prompt functionality - ONLY runs when this file is executed directly
// export function startSinglePlayerPrompt() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     function inputUsername() {
//         rl.question("Enter username (or type exit to exit): ", async (username) => {
//             if (username.toLowerCase() === "exit") {
//                 console.log("Exiting");
//                 rl.close();
//                 process.exit(0);
//                 return;
//             }
//             await generateSpiderGraphsForUser(username);
//             inputUsername();
//         });
//     }

//     inputUsername();
// }

// // CRITICAL: Only run interactive mode when this file is executed directly
// if (import.meta.main) {
//     startSinglePlayerPrompt();
// }