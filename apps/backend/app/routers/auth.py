from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate

router = APIRouter(
    prefix="/api/auth",
    tags=["认证"]
)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.username == user_in.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="用户名已被注册")

    email_exists = db.query(User).filter(User.email == user_in.email).first()
    if email_exists:
        raise HTTPException(status_code=400, detail="邮箱已被注册")

    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "code": 200,
        "message": "注册成功",
        "data": {
            "userId": new_user.id,
            "username": new_user.username
        }
    }

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == request.username).first()
    
    if not user :
        return{
            "code": 401,
            "message": "账号或密码错误",
            "data": None
        }
    if not verify_password(request.password, user.hashed_password):
        return  {
            "code": 400,
            "message": "参数缺失或格式错误",
            "data": None
        }
    # 删掉了报错的 timedelta 行，直接生成 token
    access_token = create_access_token(
        subject=str(user.id),
        expires_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    return {
        "code": 200,
        "message": "登入成功",
        "data": {
            "token": access_token,
            "userInfo":{ 
                "id": user.id,
                "username": user.username
            }
        }
    }