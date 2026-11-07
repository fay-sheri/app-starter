import type { Context } from "koa";
import Router from "@koa/router";
import { validateBody } from "../middlewares/validate-body.js";
import { LoginSchema } from "../schemas/auth.js";
import type { LoginInput } from "../schemas/auth.js";

const auth = new Router();

auth.post("/login", validateBody(LoginSchema), async (ctx: Context) => {
  const { username, password } = ctx.state.validBody as LoginInput;
  console.log("username:", username, "password:", password);
  ctx.status = 200;
  ctx.body = {
    code: 200,
    message: "登录成功",
    data: {
      token: "eyJhbGciOiJIUzI1NiIs...",
      userInfo: {
        id: 1,
        username: "admin",
      },
    },
  };
});
export default auth;
