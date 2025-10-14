import {PlayerStatsRepository} from "../repository/player.stats.repository.ts";
import type {PlayerStats} from "../entity/player.stats.ts";

export class PlayerStatsService {
    private static repository = new PlayerStatsRepository();

    public async save(playerStats: PlayerStats) {
        console.log("Upserting player stats", playerStats.puuid, playerStats.seasonId);
        return await PlayerStatsService.repository.upsert(playerStats);
    }

    public async getAllStatsById(puuid: string) {
        console.debug("Getting all player stats");
        return await PlayerStatsService.repository.fetchAllById(puuid);
    }

    public async getStatsById(puuid: string, seasonId: string) {
        console.debug("Getting player stats by id", puuid, seasonId);
        return await PlayerStatsService.repository.fetchById(puuid, seasonId);
    }
}