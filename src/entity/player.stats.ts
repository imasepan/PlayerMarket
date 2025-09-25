import type {SeasonStats} from "../index.ts";

export class PlayerStats {
    puuid: string;
    seasonId: string;
    stats: SeasonStats;
    
    constructor(puuid: string, seasonId: string, seasonStats: SeasonStats) {
        this.puuid = puuid;
        this.seasonId = seasonId;
        this.stats = seasonStats;
    }
}