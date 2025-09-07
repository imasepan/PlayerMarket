import Express, {type Router, type Request, type Response} from "express";
import {PlayerService} from "../service/player.service.ts";

export class PlayerController {
    private readonly _router: Router;
    private readonly playerService: PlayerService;

    public constructor() {
        this._router = Express.Router();
        this._router.use(Express.json());
        this._router.get("/", this.getPlayer.bind(this));
        this.playerService = new PlayerService();
    }

    public get router() {
        return this._router;
    }

    private async getPlayer(req: Request, res: Response) {
        const player = await this.playerService.getPlayerByUsername("");
        res.json(player);
    }
}