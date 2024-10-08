from contextlib import asynccontextmanager
import warnings
from dotenv import load_dotenv

from fastapi import FastAPI
from langchain_core._api import LangChainBetaWarning
from langserve import add_routes

from app.agent import graph as agent_graph


load_dotenv()

warnings.filterwarnings("ignore", category=LangChainBetaWarning)

@asynccontextmanager
async def lifespan(app: FastAPI):
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