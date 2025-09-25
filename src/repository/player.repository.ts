import {type Collection, type Filter, type UpdateFilter, type UpdateOptions} from "mongodb";
import {Player} from "../entity/player.ts";
import {Database} from "../database.ts";
import {PlayerNotFoundError} from "../exception/player.exception.ts";

export class PlayerRepository {
    private collection?: Collection<Player>;

    private async connect() {
        if (!this.collection) {
            this.collection = await Database.getCollection<Player>("players");
        }
    }

    public async upsert(player: Player) {
        await this.connect();
        const query: Filter<Player> = { puuid: player.puuid };
        const update: UpdateFilter<Player> = { $set: player };
        const options: UpdateOptions = { upsert: true };
        await this.collection?.updateOne(query, update, options);
        return player;
    }

    public async fetchAll() {
        await this.connect();
        const query: Filter<Player> = {  };
        const result = this.collection?.find(query);

        if (!result) {
            throw new PlayerNotFoundError("all");
        }

        return result.toArray();
    }

    public async fetchById(puuid: string) {
        await this.connect();
        const query: Filter<Player> = { puuid: puuid };
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new PlayerNotFoundError(puuid);
        }

        return new Player(result.puuid, result.username);
    }

    public async fetchByUsername(username: string) {
        await this.connect();
        const query: Filter<Player> = { username: username };
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new PlayerNotFoundError(username);
        }

        return new Player(result.puuid, result.username);
    }
}