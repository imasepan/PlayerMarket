import {type Collection, type Filter, type UpdateFilter, type UpdateOptions} from "mongodb";
import {Database} from "../database.ts";
import {PlayerStats} from "../entity/player.stats.ts";
import {NotFoundError} from "../error/NotFoundError.ts";

export class PlayerStatsRepository {
    private collection?: Collection<PlayerStats>;

    private async connect() {
        if (!this.collection) {
            this.collection = await Database.getCollection<PlayerStats>("player-stats");
        }
    }

    public async upsert(playerStats: PlayerStats) {
        await this.connect();
        const query: Filter<PlayerStats> = { puuid: playerStats.puuid, seasonId: playerStats.seasonId };
        const update: UpdateFilter<PlayerStats> = { $set: playerStats };
        const options: UpdateOptions = { upsert: true };
        await this.collection?.updateOne(query, update, options);
        return playerStats;
    }

    public async fetchAll() {
        await this.connect();
        const query: Filter<PlayerStats> = {  };
        const result = this.collection?.find(query);

        if (!result) {
            throw new Error("PlayerStats result not found");
        }

        return result.map(a => new PlayerStats(a.puuid, a.seasonId, a.stats)).toArray();
    }

    public async fetchAllById(puuid: string) {
        await this.connect();
        const query: Filter<PlayerStats> = { puuid: puuid };
        const result = await this.collection?.find(query).toArray();

        if (!result) {
            throw new NotFoundError(`PlayerStats with puuid ${puuid} not found`);
        }

        return result;
    }

    public async fetchById(puuid: string, seasonId: string) {
        await this.connect();
        const query: Filter<PlayerStats> = { puuid: puuid, seasonId: seasonId };
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new NotFoundError(`PlayerStats with id ${puuid} and seasonId ${seasonId} not found`);
        }

        return result;
    }
}