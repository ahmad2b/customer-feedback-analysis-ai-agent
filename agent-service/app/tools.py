"""Define he agent's tools."""

from app.utils import logger as  logging
from app.db import db_pool

def save_feedback_to_postgres(feedback_data: dict):
    logging.info("Saving feedback to PostgreSQL")
    logging.debug(f"Feedback data: {feedback_data}")

    with db_pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO feedback_analysis 
                (feedback, category, entities, summary, sentiment, priority, route, action_items)
                VALUES (%(feedback)s, %(category)s, %(entities)s, %(summary)s, %(sentiment)s, %(priority)s, %(route)s, %(action_items)s)
                """,
                feedback_data
            )
            conn.commit()