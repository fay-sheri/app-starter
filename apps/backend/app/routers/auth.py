from fastapi import APIRouter, Depends, Response, Request
from fastapi.responses import JSONResponse

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from datetime import datetime, timezone, timedelta                 

from app.core.database import get_db
from app.core.security import get_current_user, hash_password, verify_password, create_access_token,decrypt_password,is_frontend_rsa_oaep_encrypted, create_refresh_token, decode_token
from app.core.config import settings
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import LoginRequest, Register_WithoutEmail, TokenRequest


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

    user_password_verify = is_frontend_rsa_oaep_encrypted(request.password)
    if not user_password_verify:
        return JSONResponse(
            status_code=422,
            content={
                "code": 422,
                "message": "密码加密参数异常",
                "data": None
            }
        )
    # result = await db.execute(select(User).where(User.email == request.email))
    # email_exist = result.scalars().first()
    # if email_exists:
    #     raise HTTPException(status_code=400, detail="邮箱已被注册")


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
async def login(request: LoginRequest,response: Response, db: AsyncSession = Depends(get_db)):

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
    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user.id, RefreshToken.is_revoked == False)
        .values(is_revoked=True)
    )
    await db.commit()
    # 签发双 Token
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    # 将 Refresh Token 存入数据库
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_token = RefreshToken(token=refresh_token, user_id=user.id, expires_at=expires_at)
    db.add(db_token)
    await db.commit()

    response.set_cookie(
        key="refresh_token", 
        value=refresh_token,
        httponly=True, 
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
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

@router.post("/refresh")
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    # 从 Cookie 中获取
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return JSONResponse(status_code=401, content={"code": 401, "message": "No Refresh Token", "data": None})

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Invalid type")
        user_id = payload.get("sub")
    except ValueError:
        return JSONResponse(status_code=401, content={"code": 401, "message": "Refresh Token 无效或过期", "data": None})

    # 并发控制更新
    stmt = (
        update(RefreshToken)
        .where(RefreshToken.token == refresh_token, RefreshToken.is_revoked == False)
        .values(is_revoked=True)
    )
    result = await db.execute(stmt)
    
    if result.rowcount != 1:
        await db.rollback()
        return JSONResponse(status_code=401, content={"code": 401, "message": "Token 已被撤销", "data": None})

    # 签发全新的 Token 对
    new_access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)
    
    # 存入新的 Refresh Token
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    new_db_token = RefreshToken(token=new_refresh_token, user_id=int(user_id), expires_at=expires_at)
    db.add(new_db_token)
    await db.commit()

    # 更新 Cookie
    response.set_cookie(
        key="refresh_token", 
        value=new_refresh_token,
        httponly=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {
        "code": 200,
        "message": "刷新成功",
        "data": {
            "token": new_access_token,
        }
    }

@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    # 从 Cookie 中获取
    refresh_token = request.cookies.get("refresh_token")
    
    if refresh_token:
        result = await db.execute(select(RefreshToken).where(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False
        ))
        db_token = result.scalars().first()
        
        if db_token:
            db_token.is_revoked = True
            await db.commit()
    
    # 清除浏览器的 Cookie
    response.delete_cookie("refresh_token")
    
    return {"code": 200, "message": "登出成功", "data": None}

@router.post("/me")
async def get_my_profile(user_id: int = Depends(get_current_user)):
    return {
        "message" : "你好"
    }