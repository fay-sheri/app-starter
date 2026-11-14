from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, comment="用户id")
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False,comment="用户名")
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True,comment="用户邮箱")
    hashed_password: Mapped[str] = mapped_column(String, nullable=False,comment="用户密码")
    
    # 默认未激活，以后做邮箱验证用
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, comment="是否激活") 