import {GraphRepository} from "../repository/graph.repository.ts";
import type {PlayerStats} from "../entity/player.stats.ts";

export class GraphService {
    private static repository = new GraphRepository();

    public async getGraphStats(puuid: string, seasonId: string) {
        console.debug(`Getting graph stats by seasonId ${seasonId} and puuid ${puuid}`);
        return await GraphService.repository.fetchGraphStats(puuid, seasonId);
    }
}