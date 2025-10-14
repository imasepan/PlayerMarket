import {RoleStatsRepository} from "../repository/role.stats.repository.ts";
import type {RoleStats} from "../entity/role.stats.ts";

export class RoleStatsService {
    private static repository = new RoleStatsRepository();

    public async save(roleStats: RoleStats) {
        console.log("Upserting role stats", roleStats.puuid, roleStats.seasonId, roleStats.role);
        return await RoleStatsService.repository.upsert(roleStats);
    }

    public async getAllRoleStats() {
        console.debug("Getting all role stats");
        return await RoleStatsService.repository.fetchAll();
    }

    public async getAllStatsById(puuid: string, seasonId: string) {
        console.debug("Getting role stats by id", puuid, seasonId);
        return await RoleStatsService.repository.fetchAllById(puuid, seasonId);
    }

    public async getStatsById(puuid: string, seasonId: string, role: string) {
        console.debug("Getting role stats by id", puuid, seasonId, role);
        return await RoleStatsService.repository.fetchById(puuid, seasonId, role);
    }
}