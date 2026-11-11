from sqlalchemy import DateTime,func
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase,Mapped, mapped_column
from datetime import datetime

from app.core.config import settings

# 1. 创建数据库引擎（连接 SQLite）
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,      #输出 SQL 日志
    connect_args={"check_same_thread": False}
)

# 2. 创建数据库会话工厂
SessionLocal = async_sessionmaker(class_=AsyncSession, expire_on_commit=False, autocommit=False, autoflush=False, bind=engine)

# 3. 创建 ORM 基类，以后所有的数据库表（如 User 表）都要继承它
class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(DateTime, default=func.now(), comment="创建时间")
    update_time: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), comment="修改时间")


async def creat_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# 4. 依赖注入函数
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
