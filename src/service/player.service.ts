import {PlayerRepository} from "../repository/player.repository.ts";

export class PlayerService {
    private repository = new PlayerRepository();

    public async getPlayerByUsername(username: string) {
        console.debug("getPlayerByUsername", username);
        return await this.repository.fetchByUsername(username);
    }
}