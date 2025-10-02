import {PlayerGraphStatsRepository} from "../repository/player.graph.stats.repository.ts";
import type {PlayerStats} from "../entity/player.stats.ts";

export class PlayerGraphStatsService {
    private static repository = new PlayerGraphStatsRepository();

    public async getGraphStats(puuid: string, seasonId: string) {
        console.debug("Getting player stats by id", puuid, seasonId);
        return await PlayerGraphStatsService.repository.fetchGraphStats(puuid, seasonId);
    }
}