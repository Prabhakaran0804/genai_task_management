from databases import Database
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
import asyncio

DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Database connection for async use
database = Database(DATABASE_URL)

# SQLAlchemy setup
#engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
#SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
Base = declarative_base()

async def create_tables():
    # Create all tables defined by Base (e.g., User)
    async with engine.begin() as conn:
        # This will create all tables defined in Base
        await conn.run_sync(Base.metadata.create_all)
