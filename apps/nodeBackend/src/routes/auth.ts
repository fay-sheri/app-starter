import Router from "@koa/router";
import { validateBody } from "../middlewares/validate-body.js";
import { authMiddleware } from "../middlewares/auth.js"
import { LoginSchema, RegisterSchema } from "../schemas/auth.js";
import { login } from "../controllers/login.js";
import { register } from "../controllers/register.js";
import { refresh } from "../controllers/refresh.js";
import { logout } from "../controllers/logout.js"

const auth = new Router();

auth.post("/login", validateBody(LoginSchema), login);
auth.post("/register", validateBody(RegisterSchema), register);
auth.post("/refresh", refresh);
auth.post("/logout", logout)

export default auth;
