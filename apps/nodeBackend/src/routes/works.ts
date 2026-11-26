import Router from "@koa/router";
import { validateQueryParams } from "../middlewares/validate-QueryParams.js";
import { getWorksQuerySchema } from "../schemas/works.js"
import { getworks } from "../controllers/getWorks.js"

const works = new Router();
works.get("/", validateQueryParams(getWorksQuerySchema), getworks)

export default works