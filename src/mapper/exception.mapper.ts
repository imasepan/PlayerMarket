import {HttpStatusCode} from "axios";
import {NotFoundError} from "../error/NotFoundError.ts";

export class ExceptionMapper {
    public getCode(err: unknown) {
        if (err instanceof NotFoundError) {
            return HttpStatusCode.NotFound;
        }
        return HttpStatusCode.InternalServerError;
    }

    public getMessage(err: unknown) {
        if (err instanceof Error) {
            return err.message;
        }
        return "An unknown error occurred.";
    }
}