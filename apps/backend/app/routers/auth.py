from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token,decrypt_password,is_frontend_rsa_oaep_encrypted
from app.core.config import settings
from app.models.user import User
from app.schemas.user import LoginRequest, Register_WithoutEmail


router = APIRouter(
    prefix="/api/auth",
    tags=["认证"]
)


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
    await db.commit()
    await db.refresh(new_user)

    return {
        "code": 200,
        "message": "注册成功",
        "data": {
            "userId": new_user.id,
            "username": new_user.username
        }
    }

@router.post("/login")
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