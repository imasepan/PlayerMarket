import {type Collection, type Filter, type UpdateFilter, type UpdateOptions} from "mongodb";
import {Database} from "../database.ts";
import {RoleStats} from "../entity/role.stats.ts";
import {NotFoundError} from "../error/NotFoundError.ts";

export class RoleStatsRepository {
    private collection?: Collection<RoleStats>;

    private async connect() {
        if (!this.collection) {
            this.collection = await Database.getCollection<RoleStats>("role-stats");
        }
    }

    public async upsert(roleStats: RoleStats) {
        await this.connect();
        const query: Filter<RoleStats> = { puuid: roleStats.puuid, seasonId: roleStats.seasonId, role: roleStats.role };
        const update: UpdateFilter<RoleStats> = { $set: roleStats };
        const options: UpdateOptions = { upsert: true };
        await this.collection?.updateOne(query, update, options);
        return roleStats;
    }

    public async fetchAll() {
        await this.connect();
        const query: Filter<RoleStats> = {  };
        const result = this.collection?.find(query);

        if (!result) {
            throw new Error("PlayerStats result not found");
        }

        return result.map(a => new RoleStats(a.puuid, a.seasonId, a.role, a.stats)).toArray();
    }

    public async fetchAllById(puuid: string, seasonId: string) {
        await this.connect();
        const query: Filter<RoleStats> = { puuid: puuid, seasonId: seasonId};
        const result = await this.collection?.find(query).toArray();

        if (!result) {
            throw new NotFoundError(`RoleStats with puuid ${puuid} and seasonId ${seasonId} not found`);
        }

        return result;
    }

    public async fetchById(puuid: string, seasonId: string, role: string) {
        await this.connect();
        const query: Filter<RoleStats> = { puuid: puuid, seasonId: seasonId, role: role};
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new NotFoundError(`RoleStats with id ${puuid} and seasonId ${seasonId} and role ${role} not found`);
        }

        return result;
    }
}