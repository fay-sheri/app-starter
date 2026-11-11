from contextlib import asynccontextmanager
from fastapi import FastAPI,Request,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.database import engine, Base, creat_tables
from app.models.user import User
from app.routers import auth

import traceback  #500全局检测时的后端问题查看

# 真正在数据库里建表的代码！
@asynccontextmanager
async def lifespan(app: FastAPI):
    await creat_tables()
    yield
    await engine.dispose()

app = FastAPI(title="App Starter Backend",lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 把认证路由挂载到主程序上！
# 这行代码一加，/docs 里就会多出“认证”模块
# ==========================================
app.include_router(auth.router)

# 处理 HTTPException (如 400, 401)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    traceback.print_exc()       #开发时使用
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
        }
    )

# 处理 422 参数校验失败 (如 Pydantic 拦截的格式错误)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "参数缺失或格式错误",
            "data": None
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "code": 500,
            "message": "服务器内部错误",
            "data": None
        }
    )

@app.get("/")
async def root():
    return {"message": "App Starter Backend is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}