import {Collection, Db, MongoClient, type Document,} from "mongodb";
import {getEnv} from "./util/env.ts";

export class Database {
    private static database: Db;

    private static async connect() {
        const username = getEnv("MONGO_USERNAME");
        const password = getEnv("MONGO_PASSWORD");
        const host = getEnv("MONGO_HOST");
        const port = getEnv("MONGO_PORT");
        const connectionString = `mongodb://${username}:${password}@${host}:${port}`;
        const client = await new MongoClient(connectionString).connect();
        Database.database = client.db(getEnv("MONGO_DATABASE"));
    }

    public static async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
        if (!Database.database) {
            await Database.connect();
        }

        return Database.database.collection<T>(name);
    }
}