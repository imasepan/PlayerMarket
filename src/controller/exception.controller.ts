import type {Request, Response, NextFunction} from "express";
import {ExceptionMapper} from "../mapper/exception.mapper.ts";

export class ExceptionController {
    private exceptionMapper = new ExceptionMapper();

    constructor() {
        this.handler = this.handler.bind(this);
    }

    public handler(_req: Request, res: Response, next: NextFunction) {
        try {
            next();
        } catch (err) {
            const code = this.exceptionMapper.getCode(err);
            const message = this.exceptionMapper.getMessage(err);
            res.status(code).send(message);
        }
    }
}