import Express from "express";
import {PlayerController} from "./controller/player.controller.ts";
import {ExceptionController} from "./controller/exception.controller.ts";
import {HealthController} from "./controller/health.controller.ts";
import {RateController} from "./controller/rate.controller.ts";
import {TrackerService} from "./service/tracker.service.ts";
import {Region} from "./enums/region.ts";
import {SegmentType} from "./enums/segment.type.ts";
import {PlaywrightService} from "./service/playwright.service.ts";
import {PlayerService} from "./service/player.service.ts";
import {Player} from "./entity/player.ts";
import {PlayerStats} from "./entity/player.stats.ts";
import {PlayerStatsService} from "./service/player.stats.service.ts";
import {RoleStatsService} from "./service/role.stats.service.ts";
import {RoleStats} from "./entity/role.stats.ts";
import {GraphController} from "./controller/graph.controller.ts";

export interface SeasonStats {
    matchesPlayed: StatItem;
    matchesWon: StatItem;
    matchesLost: StatItem;
    matchesTied: StatItem;
    matchesWinPct: StatItem;
    matchesDisconnected: StatItem;
    matchesDuration: StatItem;
    timePlayed: StatItem;
    mVPs: StatItem;
    roundsPlayed: StatItem;
    roundsWon: StatItem;
    roundsLost: StatItem;
    roundsWinPct: StatItem;
    roundsDuration: StatItem;
    score: StatItem;
    scorePerMatch: StatItem;
    scorePerRound: StatItem;
    kills: StatItem;
    killsPerRound: StatItem;
    killsPerMatch: StatItem;
    deaths: StatItem;
    deathsPerRound: StatItem;
    deathsPerMatch: StatItem;
    assists: StatItem;
    assistsPerRound: StatItem;
    assistsPerMatch: StatItem;
    kDRatio: StatItem;
    kDARatio: StatItem;
    kADRatio: StatItem;
    damage: StatItem;
    damageDelta: StatItem;
    damageDeltaPerRound: StatItem;
    damagePerRound: StatItem;
    damagePerMatch: StatItem;
    damagePerMinute: StatItem;
    damageReceived: StatItem;
    headshots: StatItem;
    headshotsPerRound: StatItem;
    headshotsPercentage: StatItem;
    grenadeCasts: StatItem;
    grenadeCastsPerRound: StatItem;
    grenadeCastsPerMatch: StatItem;
    ability1Casts: StatItem;
    ability1CastsPerRound: StatItem;
    ability1CastsPerMatch: StatItem;
    ability2Casts: StatItem;
    ability2CastsPerRound: StatItem;
    ability2CastsPerMatch: StatItem;
    ultimateCasts: StatItem;
    ultimateCastsPerRound: StatItem;
    ultimateCastsPerMatch: StatItem;
    dealtHeadshots: StatItem;
    dealtBodyshots: StatItem;
    dealtLegshots: StatItem;
    receivedHeadshots: StatItem;
    receivedBodyshots: StatItem;
    receivedLegshots: StatItem;
    econRating: StatItem;
    econRatingPerMatch: StatItem;
    econRatingPerRound: StatItem;
    suicides: StatItem;
    firstBloods: StatItem;
    firstBloodsPerRound: StatItem;
    firstBloodsPerMatch: StatItem;
    firstDeaths: StatItem;
    firstDeathsPerRound: StatItem;
    lastDeaths: StatItem;
    survived: StatItem;
    traded: StatItem;
    kAST: StatItem;
    mostKillsInMatch: StatItem;
    flawless: StatItem;
    thrifty: StatItem;
    aces: StatItem;
    teamAces: StatItem;
    clutches: StatItem;
    clutchesLost: StatItem;
    clutches1v1: StatItem;
    clutches1v2: StatItem;
    clutches1v3: StatItem;
    clutches1v4: StatItem;
    clutches1v5: StatItem;
    clutchesLost1v1: StatItem;
    clutchesLost1v2: StatItem;
    clutchesLost1v3: StatItem;
    clutchesLost1v4: StatItem;
    clutchesLost1v5: StatItem;
    kills1K: StatItem;
    kills2K: StatItem;
    kills3K: StatItem;
    kills4K: StatItem;
    kills5K: StatItem;
    kills6K: StatItem;
    esr: StatItem;
    plants: StatItem;
    plantsPerMatch: StatItem;
    plantsPerRound: StatItem;
    attackKills: StatItem;
    attackKillsPerRound: StatItem;
    attackDeaths: StatItem;
    attackKDRatio: StatItem;
    attackAssists: StatItem;
    attackAssistsPerRound: StatItem;
    attackRoundsWon: StatItem;
    attackRoundsLost: StatItem;
    attackRoundsPlayed: StatItem;
    attackRoundsWinPct: StatItem;
    attackScore: StatItem;
    attackScorePerRound: StatItem;
    attackDamage: StatItem;
    attackDamageReceived: StatItem;
    attackDamagePerRound: StatItem;
    attackDamageDelta: StatItem;
    attackDamageDeltaPerRound: StatItem;
    attackHeadshots: StatItem;
    attackTraded: StatItem;
    attackSurvived: StatItem;
    attackFirstBloods: StatItem;
    attackFirstBloodsPerRound: StatItem;
    attackFirstDeaths: StatItem;
    attackFirstDeathsPerRound: StatItem;
    attackEsr: StatItem;
    attackKAST: StatItem;
    defuses: StatItem;
    defusesPerMatch: StatItem;
    defusesPerRound: StatItem;
    defenseKills: StatItem;
    defenseKillsPerRound: StatItem;
    defenseDeaths: StatItem;
    defenseKDRatio: StatItem;
    defenseAssists: StatItem;
    defenseAssistsPerRound: StatItem;
    defenseRoundsWon: StatItem;
    defenseRoundsLost: StatItem;
    defenseRoundsPlayed: StatItem;
    defenseRoundsWinPct: StatItem;
    defenseScore: StatItem;
    defenseScorePerRound: StatItem;
    defenseDamage: StatItem;
    defenseDamageReceived: StatItem;
    defenseDamagePerRound: StatItem;
    defenseDamageDelta: StatItem;
    defenseDamageDeltaPerRound: StatItem;
    defenseHeadshots: StatItem;
    defenseTraded: StatItem;
    defenseSurvived: StatItem;
    defenseFirstBloods: StatItem;
    defenseFirstBloodsPerRound: StatItem;
    defenseFirstDeaths: StatItem;
    defenseFirstDeathsPerRound: StatItem;
    defenseEsr: StatItem;
    defenseKAST: StatItem;
    rank: StatItem;
    trnPerformanceScore: StatItem;
    peakRank: StatItem;
}

export interface RoleBasedStats {
    matchesPlayed: StatItem;
    matchesWon: StatItem;
    matchesLost: StatItem;
    matchesTied: StatItem;
    matchesWinPct: StatItem;
    timePlayed: StatItem;
    scorePerRound: StatItem;
    kills: StatItem;
    deaths: StatItem;
    assists: StatItem;
    kDRatio: StatItem;
    kADRatio: StatItem
    damageDelta: StatItem;
    damageDeltaPerRound: StatItem;
    damagePerRound: StatItem;
    kAST: StatItem;
}

interface StatItem {
    displayName: string;
    displayCategory: string;
    category: string;
    metadata: object;
    value: number;
    displayValue: string;
    displayType: string;
}

interface AgentRoleMetadata {
    name: string;
    imageUrl: string;
}

// HTTP Server
Express()
    .use(Express.json())
    .use(new RateController().handler)
    .use("/health", new HealthController().router)
    .use("/players", new PlayerController().router)
    .use("/graph", new GraphController().router)
    .use(new ExceptionController().handler)
    .listen(8080);

// Scraping Task

const tracker = new TrackerService();
const playerService = new PlayerService();
const playerStatsService = new PlayerStatsService();
const roleStatsService = new RoleStatsService();

const now = new Date();
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const delay = midnight.getTime() - now.getTime();

console.log(delay / 1000);

// await parseStats();

async function parseStats() {
    const seasons = await tracker.getSeasons();
    for (const season of seasons) {
        const start = new Date(season.startTime);
        const end = new Date(season.endTime);
        const now = Date.now();
        if (end.getTime() < now || start.getTime() > now) {
            continue;
        }

        for (let i = 0;; i++) {
            const leaderboard = await tracker.getLeaderboard(Region.Global, season.id, i * 100);
            if (leaderboard.items.length == 0) {
                console.log(`Stopped at leaderboard ${i}`);
                break;
            }

            for (const item of leaderboard.items) {
                const username = item.id;
                if (!username) {
                    continue;
                }

                try {
                    await playerService.getPlayerByUsername(username);
                    continue;
                } catch {}


                try {
                    const profile = await tracker.getProfile(username);
                    const puuid = profile.platformInfo.platformUserId;
                    await playerService.save(new Player(puuid, username));

                    for (const segment of profile.segments) {
                        switch (segment.type) {
                            case SegmentType.Season: {
                                const stats = segment.stats as SeasonStats;
                                await playerStatsService.save(new PlayerStats(puuid, season.id, stats));
                                break;
                            }

                            case SegmentType.AgentRole: {
                                const metadata = segment.metadata as AgentRoleMetadata;
                                const stats = segment.stats as RoleBasedStats;
                                await roleStatsService.save(new RoleStats(puuid, season.id, metadata.name, stats));
                                break;
                            }
                        }
                    }

                } catch (e: unknown) {
                    if (e instanceof Error) {
                        console.error(e.message);
                    } else {
                        console.error(e);
                    }
                }

                // break;
            }
        }
    }
}

process.on("exit", () => {
    PlaywrightService.close().then(() => {
        console.log("PlaywrightService closed");
    });
})