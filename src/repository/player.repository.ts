import {type Collection, type Filter, ObjectId, type UpdateOptions} from "mongodb";
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

    public async fetchById(playerId: string) {
        await this.connect();
        const query: Filter<Player> = { _id: new ObjectId(playerId) };
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new PlayerNotFoundError(playerId);
        }

        return new Player(result._id);
    }

    public async fetchByUsername(username: string) {
        await this.connect();
        const query: Filter<Player> = { username: username };
        const result = await this.collection?.findOne(query);

        if (!result) {
            throw new PlayerNotFoundError(username);
        }

        return new Player(result._id);
    }

    public async upsert(player: Player) {
        await this.connect();
        const query: Filter<Player> = player;
        const options: UpdateOptions = { upsert: true };
        await this.collection?.updateOne(query, options);
        return player;
    }
}