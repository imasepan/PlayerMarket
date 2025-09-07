export class PlayerNotFoundError extends Error {
    public constructor(key: string) {
        super(`Player with key ${key} not found`);
    }
}