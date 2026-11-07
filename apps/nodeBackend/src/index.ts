import 'dotenv/config'
import Koa from "koa";
import { routers } from "./routes/index.js";
import bodyParser from "@koa/bodyparser";
import cors from '@koa/cors'

const app = new Koa();
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.status = (e as any).status || 500;
    ctx.body = { error: (e as Error).message };
  }
});
app.use(cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(bodyParser());  //结果挂到 ctx.request.body
app.use(routers.routes());

const port = 8000;
app.listen(port, () => console.log(`listen :${port}`));
