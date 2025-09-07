import {HttpStatusCode} from "axios";
import {PlayerNotFoundError} from "../exception/player.exception.ts";

export class ExceptionMapper {
    public getCode(err: unknown) {
        if (err instanceof PlayerNotFoundError) {
            return HttpStatusCode.NotFound;
        }
        return HttpStatusCode.InternalServerError;
    }

    public getMessage(err: unknown) {
        if (err instanceof PlayerNotFoundError) {
            return HttpStatusCode.NotFound;
        }
        return;
    }
}