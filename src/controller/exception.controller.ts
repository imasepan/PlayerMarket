import type {Request, Response, NextFunction} from "express";
import {ExceptionMapper} from "../mapper/exception.mapper.ts";

export class ExceptionController {
    private exceptionMapper = new ExceptionMapper();

    constructor() {
        this.handler = this.handler.bind(this);
    }

    public handler(err: any, _req: Request, res: Response, _next: NextFunction) {
        const code = this.exceptionMapper.getCode(err);
        const message = this.exceptionMapper.getMessage(err);
        res.status(code).send({ error: message });
    }
}