import {type Collection, type Filter, type UpdateFilter, type UpdateOptions} from "mongodb";
import {Database} from "../database.ts";
import {PlayerNotFoundError} from "../exception/player.exception.ts";
import {PlayerStats} from "../entity/player.stats.ts";
import {PlayerStatsNotFoundException} from "../exception/player.stats.exception.ts";

export class PlayerGraphStatsRepository {

    private collection?: Collection<PlayerStats>;

    private async connect() {
        if (!this.collection) {
            this.collection = await Database.getCollection<PlayerStats>("players");
        }
    }

    public async fetchGraphStats(puuid: string, seasonId: string) {
        await this.connect();

        const query: Filter<PlayerStats> = { puuid, seasonId };

        const projection = {
            puuid: 1,
            seasonId: 1,
            "stats.roundsPlayed": 1,
            "stats.killsPerRound": 1,
            "stats.kAST": 1,
            "stats.kDARatio": 1,
            "stats.agentFirstDeathsPerRound": 1,
            "stats.assistsPerRound": 1,
            "stats.damagePerRound": 1,
            "stats.firstBloodsPerRound": 1,
        };

        const result = await this.collection?.findOne(query, { projection });

        if (!result) {
            throw new PlayerStatsNotFoundException(`${puuid}-${seasonId}`);
        }

        return {
            puuid: result.puuid,
            seasonId: result.seasonId,
            stats: {
                roundsPlayed: result.stats.roundsPlayed,
                killsPerRound: result.stats.killsPerRound,
                kAST: result.stats.kAST,
                kDARatio: result.stats.kDARatio,
                agentFirstDeathsPerRound: result.stats.firstDeathsPerRound,
                assistsPerRound: result.stats.assistsPerRound,
                damagePerRound: result.stats.damagePerRound,
                firstBloodsPerRound: result.stats.firstBloodsPerRound,},
        };
    }
}