import Express, {type Router, type Request, type Response} from "express";
import {PlayerService} from "../service/player.service.ts";
import {PlayerStatsService} from "../service/player.stats.service.ts";
import {RoleStatsService} from "../service/role.stats.service.ts";
import {PlayerGraphStatsService} from "../service/player.graph.stats.service.ts";


export class graphController{
    private readonly _router: Router;
    private readonly playerGraphStatsService: PlayerGraphStatsService;

    public constructor() {
        this._router = Express.Router();
        this._router.use(Express.json());
        this._router.get("/:puuid/stats/:seasonId/graph", this.getGraphStats.bind(this));
        this.playerGraphStatsService = new PlayerGraphStatsService();
    }

    public get router() {
        return this._router;
    }

    private async getGraphStats(req: Request, res: Response) {
        const { puuid, seasonId } = req.params;
        const stats = await this.playerGraphStatsService.getGraphStats(puuid, seasonId);
        res.json(stats);
    }
}