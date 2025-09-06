import {type Collection, ObjectId} from "mongodb";
import type {Player} from "../entity/player.ts";
import {Database} from "../database.ts";

export class PlayerRepository {
    private collection?: Collection<Player>;

    private async fetchById(id: string) {
        if (!this.collection) {
            this.collection = await Database.getCollection<Player>("players");
        }

        const query = { _id: new ObjectId(id) };
        const result = await this.collection.findOne(query);
    }
}