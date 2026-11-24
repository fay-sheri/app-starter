import Router from "@koa/router";
import { authMiddleware } from "../middlewares/auth.js"
import { validateBody } from "../middlewares/validate-body.js";
import { updateProfileSchema } from "../schemas/profile.js"
import { updateProfile } from "../controllers/updateProfile.js"

const r = new Router();
r.get("/user/me", authMiddleware, updateProfile)
r.patch("/user/me", authMiddleware, validateBody(updateProfileSchema), updateProfile)
