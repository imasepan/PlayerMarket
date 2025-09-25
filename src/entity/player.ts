export class Player {
    puuid: string;
    username: string;

    public constructor(puuid: string, username: string) {
        this.puuid = puuid;
        this.username = username;
    }
}