from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models.user import User
from app.routers import auth

app = FastAPI(title="App Starter Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 真正在数据库里建表的代码！
Base.metadata.create_all(bind=engine)

# ==========================================
# 把认证路由挂载到主程序上！
# 这行代码一加，/docs 里就会多出“认证”模块
# ==========================================
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "App Starter Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}