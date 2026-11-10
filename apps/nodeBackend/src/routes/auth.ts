import Router from "@koa/router";
import { validateBody } from "../middlewares/validate-body.js";
import { LoginSchema } from "../schemas/auth.js";
import { login } from "../controllers/login.js";

const auth = new Router();

auth.post("/login", validateBody(LoginSchema), login);
export default auth;
