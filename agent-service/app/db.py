import os
from dotenv import load_dotenv
from psycopg_pool import ConnectionPool

load_dotenv()

DB_URI = os.getenv("DB_URI")
db_pool = ConnectionPool(DB_URI)