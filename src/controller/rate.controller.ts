import type {NextFunction, Request, Response} from "express";

export class RateController {
    private cache = new Map<string, number[]>();
    private readonly WINDOW_SIZE = 10 * 1000;
    private readonly MAX_REQUESTS = 20;

    constructor() {
        this.handler = this.handler.bind(this);
    }

    public handler(req: Request, res: Response, next: NextFunction) {
        // const route: string = req.route.path;
        // const regex = /^\/([^\/]+)\//;
        // const match = route.match(regex);

        const now = Date.now();
        const clientId = req.ip;

        if (!clientId) {
            res
                .status(400)
                .send({ error: "Client ID is missing" });
            return;
        }

        let timestamps = this.cache.get(clientId) || [];
        timestamps = timestamps.filter((ts) => now - ts <= this.WINDOW_SIZE);

        if (timestamps.length >= this.MAX_REQUESTS) {
            res
                .status(429)
                .json({ error: "Too many requests. Please try again later." });
            return;
        }

        timestamps.push(now);
        this.cache.set(clientId, timestamps);
        next();
    }
}