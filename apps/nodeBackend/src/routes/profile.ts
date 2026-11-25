import Router from "@koa/router";
import { authMiddleware } from "../middlewares/auth.js"
import { validateBody } from "../middlewares/validate-body.js";
import { updateProfileSchema } from "../schemas/profile.js"
import { getProfile } from "../controllers/getProfile.js"
import { updateProfile } from "../controllers/updateProfile.js"

const profile = new Router();
profile.get("/me", authMiddleware, getProfile)
profile.patch("/me", authMiddleware, validateBody(updateProfileSchema), updateProfile)

export default profile