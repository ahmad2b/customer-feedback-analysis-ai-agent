from contextlib import asynccontextmanager
import warnings
from dotenv import load_dotenv
import os

from fastapi import FastAPI
from langchain_core._api import LangChainBetaWarning
from langserve import add_routes

from app.agent import graph as agent_graph

from psycopg_pool import ConnectionPool

load_dotenv()

warnings.filterwarnings("ignore", category=LangChainBetaWarning)



DB_URI = os.getenv("DB_URI")
db_pool = ConnectionPool(DB_URI)

def init_db():
    with db_pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS feedback_analysis (
                    id SERIAL PRIMARY KEY,
                    feedback TEXT NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    entities TEXT,
                    summary TEXT,
                    sentiment VARCHAR(20),
                    priority VARCHAR(20),
                    route VARCHAR(50),
                    action_items TEXT,
                    trend_analysis TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS analysis_summaries (
                    id SERIAL PRIMARY KEY,
                    summary_data JSONB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
        title="Agent Service v2",
        version="Text Analyis Pipeline Agent",
        lifespan=lifespan
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}


add_routes(
    app, 
    agent_graph,
    
)