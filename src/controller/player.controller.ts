import Express, {type Router, type Request, type Response} from "express";
import {PlayerService} from "../service/player.service.ts";
import {PlayerStatsService} from "../service/player.stats.service.ts";
import {RoleStatsService} from "../service/role.stats.service.ts";
import {HttpStatusCode} from "axios";

export class PlayerController {
    private readonly _router: Router;
    private readonly playerService: PlayerService;
    private readonly playerStatsService: PlayerStatsService;
    private readonly roleStatsService: RoleStatsService;

    public constructor() {
        this._router = Express.Router();
        this._router.use(Express.json());
        this._router.get("/", this.getAllPlayers.bind(this));
        this._router.get("/:puuid", this.getPlayer.bind(this));
        this._router.get("/:puuid/stats", this.getAllPlayerStats.bind(this));
        this._router.get("/:puuid/stats/:seasonId", this.getPlayerStats.bind(this));
        this._router.get("/:puuid/stats/:seasonId/roles", this.getAllPlayerRoleStats.bind(this));
        this._router.get("/:puuid/stats/:seasonId/roles/:role", this.getPlayerRoleStats.bind(this));
        this.playerService = new PlayerService();
        this.playerStatsService = new PlayerStatsService();
        this.roleStatsService = new RoleStatsService();
    }

    public get router() {
        return this._router;
    }

    private async getAllPlayers(_req: Request, res: Response) {
        const players = await this.playerService.getAllPlayers();
        res.status(HttpStatusCode.Ok).json(players);
    }

    private async getPlayer(req: Request, res: Response) {
        const { puuid } = req.params;
        const player = await this.playerService.getPlayerById(puuid);
        res.status(HttpStatusCode.Ok).json(player);
    }

    private async getAllPlayerStats(req: Request, res: Response) {
        const { puuid } = req.params;
        const stats = await this.playerStatsService.getAllStatsById(puuid);
        res.status(HttpStatusCode.Ok).json(stats);
    }

    private async getPlayerStats(req: Request, res: Response) {
        const { puuid, seasonId } = req.params;
        const stats = await this.playerStatsService.getStatsById(puuid, seasonId);
        res.status(HttpStatusCode.Ok).json(stats);
    }

    private async getAllPlayerRoleStats(req: Request, res: Response) {
        const { puuid, seasonId } = req.params;
        const stats = await this.roleStatsService.getAllStatsById(puuid, seasonId);
        res.status(HttpStatusCode.Ok).json(stats);
    }

    private async getPlayerRoleStats(req: Request, res: Response) {
        const { puuid, seasonId, role } = req.params;
        const stats = await this.roleStatsService.getStatsById(puuid, seasonId, role);
        res.status(HttpStatusCode.Ok).json(stats);
    }
}