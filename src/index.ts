import Express from "express";
import {PlayerController} from "./controller/player.controller.ts";
import {ExceptionController} from "./controller/exception.controller.ts";
import {HealthController} from "./controller/HealthController.ts";

Express()
    .use(Express.json())
    .use(new ExceptionController().handler)
    .use("/health", new HealthController().router)
    .use("/players", new PlayerController().router)
    .listen(8080);