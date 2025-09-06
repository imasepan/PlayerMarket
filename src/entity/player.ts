import type {Document, ObjectId, WithId} from "mongodb";

export class Player implements WithId<Document> {
    _id: ObjectId;

    public constructor(id: ObjectId) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }
}