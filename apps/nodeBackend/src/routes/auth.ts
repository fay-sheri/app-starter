import Router from "@koa/router";
import { validateBody } from "../middlewares/validate-body.js";
import { LoginSchema, RegisterSchema } from "../schemas/auth.js";
import { login } from "../controllers/login.js";
import { register } from "../controllers/register.js";

const auth = new Router();

auth.post("/login", validateBody(LoginSchema), login);
auth.post("/register", validateBody(RegisterSchema), register);

export default auth;
