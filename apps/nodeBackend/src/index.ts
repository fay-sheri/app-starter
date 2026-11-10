import 'dotenv/config'
import Koa from "koa";
import { routers } from "./routes/index.js";
import bodyParser from "@koa/bodyparser";
import cors from '@koa/cors'
import { errorHandler } from "./middlewares/error.js";

const app = new Koa();
app.use(errorHandler());
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
