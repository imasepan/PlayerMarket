// https://api.tracker.gg/api/v2/valorant/standard/profile/riot/washed%20up%20player%23bored/segments/season?playlist=competitive&seasonId=ac12e9b3-47e6-9599-8fa1-0bb473e5efc7&source=web

import { getEnv } from "./utils/env";
import { Playwright } from "./utils/playwright";
import { controllerSpiderGraph } from "./graph";
import { initiatorSpiderGraph } from "./graph";
import { sentinelSpiderGraph } from "./graph";
import { duelistSpiderGraph } from "./graph";
import { comparisonSpiderGraph } from "./graph"; // uncomment when you implement this
import readline from "readline";

// Pure data fetching function - NO interactive prompts
export async function fetchUserData(username: string): Promise<any | null> {
    try {
        const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
        const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);

        if (!profileData) {
            console.log("No Profile Data found");
            return null;
        }   

        // Process past 6 seasons
        const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 1);

        for (const season of lastSixSeasons) {
            const seasonId = season.id;
            const seasonName = season.name;

            // dynamically construct the season API URL
            const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${seasonId}&source=web`;
            console.log(`Fetching data for ${seasonName} from ${seasonUrl}`);

            const seasonData = await Playwright.fetch<SeasonApiResponse>(seasonUrl);
            const platformInfo = profileData.data.platformInfo;

            if (!seasonData?.data || seasonData.data.length === 0) {
                console.log(`No season data found for ${seasonName}`);
                continue;
            }
            
            console.log(`\n=== ${seasonName} ===`);
            
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
            );

            // Create the return data structure
            const agentStats: Record<string, any> = {};

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

                // Store all stats for return
                agentStats[agentName] = {
                    agentKDA,
                    agentKPR,
                    agentKAST,
                    agentFirstBloodsPR,
                    agentFirstDeathsPR,
                    assistsPR,
                    agentDamagePerRound,
                    agentEntryRate,
                    roundsPlayed
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
            }

            console.log("End of Data");
            
            // Return the structured data
            return {
                username: profileData.data.platformInfo.platformUserHandle,
                agents: agentStats,
                seasonName: seasonName
            };
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching data for ${username}:`, error);
        return null;
    }
}

// Function that generates spider graphs for a user
export async function generateSpiderGraphsForUser(username: string): Promise<void> {
    const userData = await fetchUserData(username);
    if (!userData) {
        console.log(`Failed to fetch data for ${username}`);
        return;
    }

    const baseApiURL = getEnv("API_URL_PROFILE") + encodeURIComponent(username);
    const profileData = await Playwright.fetch<baseApiResponse>(baseApiURL);
    if (!profileData) return;

    const lastSixSeasons = profileData.data.metadata.seasons.slice(0, 1);
    const season = lastSixSeasons[0];
    const seasonUrl = `${baseApiURL}/segments/season?playlist=competitive&seasonId=${season.id}&source=web`;
    const seasonData = await Playwright.fetch<SeasonApiResponse>(seasonUrl);
    if (!seasonData?.data) return;

    const agentEntries = seasonData.data.filter((e) => e.type === "agent");
    agentEntries.sort(
        (a, b) => Number(b.stats.roundsPlayed?.value ?? 0) - Number(a.stats.roundsPlayed?.value ?? 0)
    );

    for (const agent of agentEntries) {
        const agentName = agent.metadata.name;
        const roundsPlayed = agent.stats.roundsPlayed?.displayValue ?? "0";
        const agentKDA = Number(agent.stats.kDARatio?.displayValue ?? 0);
        const agentKPR = Number(agent.stats.killsPerRound?.displayValue ?? 0);
        const agentFirstDeathsPR = Number(agent.stats.firstDeathsPerRound?.displayValue ?? 0);
        const agentKAST = Number(agent.stats.kAST?.value ?? 0);
        const assistsPR = Number(agent.stats.assistsPerRound?.displayValue ?? 0);
        const agentDamagePerRound = Number(agent.stats.damagePerRound?.displayValue ?? 0);
        const agentFirstBloods = Number(agent.stats.firstBloods?.displayValue ?? 0);
        const agentFirstDeaths = Number(agent.stats.firstDeaths?.displayValue ?? 0);
        const agentEntryRate = agentFirstBloods > 0 ? (agentFirstBloods / (agentFirstBloods + agentFirstDeaths)) * 100 : 0;

        const controllerStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
        const initiatorStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
        const sentinelStats = { agentKPR, agentKAST, agentKDA, agentFirstDeathsPR, assistsPR };
        const duelistStats = { agentKPR, agentKAST, agentKDA, agentEntryRate, agentDamagePerRound };

        if (["Omen", "Clove", "Brimstone", "Harbor", "Astra"].includes(agentName)) {
            await controllerSpiderGraph(userData.username, agentName, roundsPlayed, controllerStats, season.name);
        } else if (["Skye", "Tejo", "Sova", "Fade", "KAY/O", "Gekko", "Breach"].includes(agentName)) {
            await initiatorSpiderGraph(userData.username, agentName, roundsPlayed, initiatorStats, season.name);
        } else if (["Cypher", "Vyse", "Deadlock", "Viper", "Killjoy"].includes(agentName)) {
            await sentinelSpiderGraph(userData.username, agentName, roundsPlayed, sentinelStats, season.name);
        } else if (["Jett", "Raze", "Waylay", "Reyna", "Iso", "Neon", "Yoru", "Phoenix", "Chamber"].includes(agentName)) {
            await duelistSpiderGraph(userData.username, agentName, roundsPlayed, duelistStats, season.name);
        }
    }
}

// Helper function to ask questions
function askQuestion(rl: readline.Interface, query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
}

// Single player mode
export async function startSinglePlayerMode(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    async function inputUsername() {
        try {
            const username = await askQuestion(rl, "Enter username (or type exit to exit): ");
            if (username.toLowerCase() === "exit") {
                console.log("Exiting");
                rl.close();
                return;
            }
            await generateSpiderGraphsForUser(username);
            await inputUsername(); // Continue asking
        } catch (error) {
            console.error("Error in single player mode:", error);
            rl.close();
        }
    }

    await inputUsername();
}

// Comparison mode
export async function startComparisonMode(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        const username1 = await askQuestion(rl, "Enter first username: ");
        const username2 = await askQuestion(rl, "Enter second username: ");

        if (!username1 || !username2) {
            console.log("Both usernames are required!");
            rl.close();
            return;
        }

        console.log(`Fetching data for ${username1} and ${username2}...`);

        const player1 = await fetchUserData(username1);
        const player2 = await fetchUserData(username2);

        if (!player1 || !player2) {
            console.log("Could not fetch data for one or both players.");
            console.log("Player 1 data:", !!player1);
            console.log("Player 2 data:", !!player2);
            rl.close();
            return;
        }

        console.log("Data fetched successfully!");
        console.log(`${player1.username} has data for agents:`, Object.keys(player1.agents));
        console.log(`${player2.username} has data for agents:`, Object.keys(player2.agents));

        const agent1 = await askQuestion(rl, `Enter agent for ${username1}: `);
        const agent2 = await askQuestion(rl, `Enter agent for ${username2}: `);

        const stats1 = player1.agents[agent1];
        const stats2 = player2.agents[agent2];

        if (!stats1 || !stats2) {
            console.log("One or both selected agents not found for the players.");
            console.log(`${agent1} found for ${player1.username}:`, !!stats1);
            console.log(`${agent2} found for ${player2.username}:`, !!stats2);
            rl.close();
            return;
        }

        console.log(`${player1.username}'s ${agent1} stats:`, stats1);
        console.log(`${player2.username}'s ${agent2} stats:`, stats2);

        //Uncomment when you implement comparisonSpiderGraph
        await comparisonSpiderGraph(
            player1.username,
            agent1,
            stats1,
            player2.username,
            agent2,
            stats2,
            player1.seasonName || "Latest Season"
        );

        console.log(`Comparison data prepared for ${player1.username} (${agent1}) vs ${player2.username} (${agent2})`);
        rl.close();
    } catch (error) {
        console.error("Error in comparison mode:", error);
        rl.close();
    }
}

// Main menu
export async function startMainMenu(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        console.log("=== Valorant Player Analysis Tool ===");
        console.log("1. Single Player Analysis (Generate spider graphs)");
        console.log("2. Player Comparison");
        console.log("3. Exit");
        
        const choice = await askQuestion(rl, "Select an option (1-3): ");
        rl.close();

        switch (choice) {
            case "1":
                await startSinglePlayerMode();
                break;
            case "2":
                await startComparisonMode();
                break;
            case "3":
                console.log("Goodbye!");
                break;
            default:
                console.log("Invalid choice. Please run again and select 1, 2, or 3.");
                break;
        }
    } catch (error) {
        console.error("Error in main menu:", error);
        rl.close();
    }
}

// Command line argument handling
if (import.meta.main) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // No arguments - show main menu
        startMainMenu();
    } else if (args[0] === "single" || args[0] === "s") {
        // Single player mode
        startSinglePlayerMode();
    } else if (args[0] === "compare" || args[0] === "comp" || args[0] === "c") {
        // Comparison mode
        startComparisonMode();
    } else if (args[0] === "help" || args[0] === "-h" || args[0] === "--help") {
        console.log("Usage:");
        console.log("  bun run index.ts                 - Show main menu");
        console.log("  bun run index.ts single          - Single player mode");
        console.log("  bun run index.ts compare         - Comparison mode");
        console.log("  bun run index.ts help            - Show this help");
    } else {
        console.log("Unknown argument. Use 'help' to see available options.");
    }
}