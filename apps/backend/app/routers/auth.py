<<<<<<< HEAD
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
=======
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token,decrypt_password,is_frontend_rsa_oaep_encrypted
from app.core.config import settings
from app.models.user import User
<<<<<<< HEAD
from app.schemas.user import LoginRequest, Register_WithoutEmail

=======
from app.schemas.user import UserCreate
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)

router = APIRouter(
    prefix="/api/auth",
    tags=["认证"]
)

<<<<<<< HEAD
=======
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.username == user_in.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="用户名已被注册")
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)

@router.post("/register")
async def register(request: Register_WithoutEmail, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == request.username))
    user_exist = result.scalars().first()
    if user_exist:
        return JSONResponse(
            status_code=400,
            content={
                "code": 400,
                "message": "该用户名已被注册",
                "data": None
            }
        )

    # user_password_verify = is_frontend_rsa_oaep_encrypted(request.password)
    # if not user_password_verify:
    #     return JSONResponse(
    #         status_code=422,
    #         content={
    #             "code": 422,
    #             "message": "密码加密参数异常",
    #             "data": None
    #         }
    #     )
#     email_exists = db.query(User).filter(User.email == request.email).first()
#     if email_exists:
#         raise HTTPException(status_code=400, detail="邮箱已被注册")
# 

    new_user = User(
        username=request.username,
        #email=user_in.email,
        hashed_password=hash_password(decrypt_password(request.password))
    )
    
    db.add(new_user)
<<<<<<< HEAD
    await db.commit()
    await db.refresh(new_user)

=======
    db.commit()
    db.refresh(new_user)
    
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)
    return {
        "code": 200,
        "message": "注册成功",
        "data": {
            "userId": new_user.id,
            "username": new_user.username
        }
    }

@router.post("/login")
<<<<<<< HEAD
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(User).where(User.username == request.username))
    user = result.scalars().first()
    
    if not user :
        return JSONResponse(
            status_code=401,
            content={
                "code": 401,
                "message": "账号或密码错误",
                "data": None
            }
        )
    
    if not verify_password(decrypt_password(request.password), user.hashed_password):
        return JSONResponse(
            status_code=422,
            content={
                "code": 422,
                "message": "参数缺失或格式错误",
                "data": None
            }
        )
=======
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
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)
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
<<<<<<< HEAD
    }
=======
    }
>>>>>>> c6d9d31 (status_code-response rsa_encrypt)
