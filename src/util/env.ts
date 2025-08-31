export function getEnv (key: string) {
    const value = process.env[key];
    if (!value) throw new Error(`env ${key} not found`);
    return value;
}
