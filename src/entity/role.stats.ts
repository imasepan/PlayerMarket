import type {RoleBasedStats} from "../index.ts";

export class RoleStats {
    puuid: string;
    seasonId: string;
    role: string;
    stats: RoleBasedStats

    constructor(puuid: string, seasonId: string, role: string, roleBasedStats: RoleBasedStats) {
        this.puuid = puuid;
        this.seasonId = seasonId;
        this.role = role;
        this.stats = roleBasedStats;
    }
}