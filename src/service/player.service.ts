import {PlayerRepository} from "../repository/player.repository.ts";
import type {Player} from "../entity/player.ts";

export class PlayerService {
    private static repository = new PlayerRepository();

    public async save(player: Player) {
        console.log("Upserting player", player);
        return await PlayerService.repository.upsert(player);
    }

    public async getAllPlayers() {
        console.debug("Getting all players");
        return await PlayerService.repository.fetchAll();
    }

    public async getPlayerById(puuid: string) {
        console.debug("Getting player by id", puuid);
        return await PlayerService.repository.fetchById(puuid);
    }

    public async getPlayerByUsername(username: string) {
        console.debug("Getting player by id", username);
        return await PlayerService.repository.fetchByUsername(username);
    }
}