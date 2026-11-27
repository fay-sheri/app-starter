import auth from "./auth.js"
import profile from "./profile.js"
import works from "./works.js"

import Router from '@koa/router'

export const routers = new Router({ prefix: '/api' }) 
routers.use('/auth',auth.routes(),auth.allowedMethods());
routers.use("/users",profile.routes(),profile.allowedMethods())
routers.use("/works",works.routes(),works.allowedMethods())