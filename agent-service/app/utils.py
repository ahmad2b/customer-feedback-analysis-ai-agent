import os
import redis
import logging as logger
from dotenv import load_dotenv

load_dotenv()

logger.basicConfig(level=logger.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


REDIS_URL = os.getenv("REDIS_URL")
redis_client = redis.Redis.from_url(REDIS_URL)