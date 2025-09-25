export class RoleStatsNotFoundException extends Error {
    public constructor(key: string) {
        super(`RoleStats with key ${key} not found`);
    }
}