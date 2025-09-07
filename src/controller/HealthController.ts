import Express, {type Request, type Response, type Router} from "express";

export class HealthController {
    private readonly start = Date.now();
    private readonly _router: Router;


    public constructor() {
        this._router = Express.Router();
        this._router.use(Express.json());
        this._router.get("/", this.health.bind(this));
    }

    public get router() {
        return this._router;
    }

    private health(_req: Request, res: Response) {
        const uptime = Date.now() - this.start;
        res.json({
            uptime: uptime
        });
    }
}