export class PlayerStatsNotFoundException extends Error {
    public constructor(key: string) {
        super(`PlayerStats with key ${key} not found`);
    }
}