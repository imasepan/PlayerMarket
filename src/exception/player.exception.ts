import {ObjectId} from "mongodb";

export class PlayerNotFoundError extends Error {
    public constructor(value: ObjectId | string) {
        if (value instanceof ObjectId) {
            super(`Player with Id ${value.toHexString()} not found`);
        } else {
            super(`Player with Username ${value} not found`);
        }
    }
}