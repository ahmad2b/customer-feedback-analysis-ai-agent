import logging
import random
import os
from typing import TypedDict
from dotenv import load_dotenv
from datetime import datetime

from langgraph.graph import StateGraph, END, START
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from psycopg_pool import ConnectionPool
from langgraph.checkpoint.postgres import PostgresSaver

load_dotenv()

DB_URI=os.getenv("DB_URI")


# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FeedbackState(TypedDict):
    feedback: str 
    category: str 
    entities: list[str]
    summary: str
    sentiment: str
    priority: str
    route: str
    action_items: list[str]
    database_updated: bool
    trend_analysis: str
    management_dashboard: str
    analysis_summary: dict
    
# Initialize database connection pool
db_pool = ConnectionPool(DB_URI)
    
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
)

# Define the node functions
def categorization_node(state: FeedbackState):
    ''' Categorize the feedback into: Complaint, Praise, Suggestion, or Query '''
    logging.info("Categorizing the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Categorize the following customer feedback into one of these categories: Complaint, Praise, Suggestion, or Query.\n\nFeedback: {feedback}\n\nCategory:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"]))
    category = llm.invoke([message]).content.strip()
    logging.info(f"Feedback categorized as: {category}")
    return {"category": category}

def entity_extraction_node(state: FeedbackState):
    ''' Extract relevant entities (Product, Store Location, Employee Name) from the feedback '''
    logging.info("Extracting entities from the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Extract relevant entities (Product, Store Location, Employee Name) from the following customer feedback. Provide the result as a comma-separated list.\n\nFeedback: {feedback}\n\nEntities:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"]))
    entities = llm.invoke([message]).content.strip().split(", ")
    logging.info(f"Entities extracted: {entities}")
    return {"entities": entities}

def summarization_node(state: FeedbackState):
    ''' Summarize the feedback in one concise sentence '''
    logging.info("Summarizing the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Summarize the following customer feedback in one concise sentence.\n\nFeedback: {feedback}\n\nSummary:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"]))
    summary = llm.invoke([message]).content.strip()
    logging.info(f"Feedback summarized as: {summary}")
    return {"summary": summary}

def sentiment_analysis_node(state: FeedbackState):
    ''' Analyze the sentiment of the feedback: Positive, Negative, or Neutral '''
    logging.info("Analyzing the sentiment of the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Analyze the sentiment of the following customer feedback. Respond with only one word: Positive, Negative, or Neutral.\n\nFeedback: {feedback}\n\nSentiment:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"]))
    sentiment = llm.invoke([message]).content.strip()
    logging.info(f"Sentiment analyzed as: {sentiment}")
    return {"sentiment": sentiment}

def priority_assignment_node(state: FeedbackState):
    ''' Assign priority based on category and sentiment: High, Medium, or Low '''
    logging.info("Assigning priority based on category and sentiment")
    prompt = PromptTemplate(
        input_variables=["category", "sentiment"],
        template="Assign a priority (High, Medium, or Low) based on the following feedback category and sentiment:\nCategory: {category}\nSentiment: {sentiment}\n\nPriority:"
    )
    message = HumanMessage(content=prompt.format(category=state["category"], sentiment=state["sentiment"]))
    priority = llm.invoke([message]).content.strip()
    logging.info(f"Priority assigned as: {priority}")
    return {"priority": priority}

def route_based_on_category(state: FeedbackState):
    logging.info("Routing the feedback based on category")
    category = state["category"]
    logging.info(f"Feedback category: {category}")
    if category == "Complaint":
        logging.info("Routing to Customer Service Team")
        return {"route": "Customer Service Team"}
    elif category == "Praise":
        logging.info("Routing to HR/Employee Recognition")
        return {"route": "HR/Employee Recognition"}
    elif category == "Suggestion":
        logging.info("Routing to Product Development")
        return {"route": "Product Development"}
    elif category == "Query":
        logging.info("Routing to FAQ/Knowledge Base Update")
        return {"route": "FAQ/Knowledge Base Update"}
    else:
        logging.info("Routing to General Processing")
        return {"route": "General Processing"}
    
def customer_service_action(state: FeedbackState):
    logging.info("Generating action items for Customer Service Team")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer complaint: {feedback}\nSummary: {summary}\nProvide 2-3 action items for the customer service team to resolve the issue:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"], summary=state["summary"]))
    action_items = llm.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def hr_recognition_action(state: FeedbackState):
    logging.info("Generating action items for HR/Employee Recognition")
    prompt = PromptTemplate(
        input_variables=["feedback", "entities"],
        template="Based on this customer praise: {feedback}\nMentioned entities: {entities}\nSuggest 1-2 ways to recognize the employee(s) mentioned:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"], entities=", ".join(state["entities"])))
    action_items = llm.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def product_development_action(state: FeedbackState):
    logging.info("Generating product improvement initiatives")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer suggestion: {feedback}\nSummary: {summary}\nProvide 2-3 potential product improvement initiatives:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"], summary=state["summary"]))
    action_items = llm.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def faq_update_action(state: FeedbackState):
    logging.info("Generating FAQ/Knowledge Base update suggestions")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer query: {feedback}\nSummary: {summary}\nSuggest 1-2 updates or additions to the FAQ/Knowledge Base:"
    )
    message = HumanMessage(content=prompt.format(feedback=state["feedback"], summary=state["summary"]))
    action_items = llm.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def update_database(state: FeedbackState):
    logging.info("Updating database with feedback analysis results")
    # Simulating database update
    with db_pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO feedback_analysis 
                (feedback, category, entities, summary, sentiment, priority, route, action_items, trend_analysis)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                state["feedback"],
                state["category"],
                ", ".join(state["entities"]),
                state["summary"],
                state["sentiment"],
                state["priority"],
                state["route"],
                ", ".join(state["action_items"]),
                state["trend_analysis"]
            ))
    return {"database_updated": True}

def trend_analysis(state: FeedbackState):
    logging.info("Performing trend analysis")
    # Simulating trend analysis
    trends = [
        "Increase in product quality complaints over the last week",
        "Positive feedback about customer service response times",
        "Growing interest in eco-friendly packaging options"
    ]
    trend_summary = random.choice(trends)
    logging.info(f"Trend identified: {trend_summary}")
    return {"trend_analysis": trend_summary}

def update_management_dashboard(state: FeedbackState):
    logging.info("Updating management dashboard")
    # Simulating dashboard update
    dashboard_summary = f"Dashboard updated at {datetime.now()}. Latest trend: {state['trend_analysis']}"
    logging.info(f"Management dashboard summary: {dashboard_summary}")
    return {"management_dashboard": dashboard_summary}

def generate_analysis_summary(state: FeedbackState):
    logging.info("Generating analysis summary")
    with db_pool.connection() as conn:
        with conn.cursor() as cur:
            # Get sentiment counts
            cur.execute("""
                SELECT sentiment, COUNT(*) 
                FROM feedback_analysis 
                GROUP BY sentiment
            """)
            sentiment_counts = dict(cur.fetchall())

            # Get top categories
            cur.execute("""
                SELECT category, COUNT(*) 
                FROM feedback_analysis 
                GROUP BY category 
                ORDER BY COUNT(*) DESC 
                LIMIT 3
            """)
            top_categories = dict(cur.fetchall())

            # Get top trends
            cur.execute("""
                SELECT trend_analysis, COUNT(*) 
                FROM feedback_analysis 
                GROUP BY trend_analysis 
                ORDER BY COUNT(*) DESC 
                LIMIT 3
            """)
            top_trends = dict(cur.fetchall())

    analysis_summary = {
        "sentiment_distribution": sentiment_counts,
        "top_categories": top_categories,
        "top_trends": top_trends,
        "total_feedback_processed": sum(sentiment_counts.values()),
        "last_updated": datetime.now().isoformat()
    }

    logging.info(f"Analysis summary generated: {analysis_summary}")
    return {"analysis_summary": analysis_summary}

# Define the graph workflow
workflow = StateGraph(FeedbackState)

# Add nodes to the graph
workflow.add_node("categorization", categorization_node)
workflow.add_node("entity_extraction", entity_extraction_node)
workflow.add_node("summarization", summarization_node)
workflow.add_node("sentiment_analysis", sentiment_analysis_node)
workflow.add_node("priority_assignment", priority_assignment_node)
workflow.add_node("route_feedback", route_based_on_category)
workflow.add_node("customer_service", customer_service_action)
workflow.add_node("hr_recognition", hr_recognition_action)
workflow.add_node("product_development", product_development_action)
workflow.add_node("faq_update", faq_update_action)
workflow.add_node("update_database", update_database)
workflow.add_node("trend_analysis_node", trend_analysis)
workflow.add_node("update_dashboard", update_management_dashboard)
workflow.add_node("generate_summary", generate_analysis_summary)

# Add edges to the graph
workflow.add_edge(START, "categorization")
workflow.add_edge("categorization", "entity_extraction")
workflow.add_edge("categorization", "summarization")
workflow.add_edge("categorization", "sentiment_analysis")

workflow.add_edge("entity_extraction", "priority_assignment")
workflow.add_edge("summarization", "priority_assignment")
workflow.add_edge("sentiment_analysis", "priority_assignment")

workflow.add_edge("priority_assignment", "route_feedback")

# Conditional edges based on routing
workflow.add_conditional_edges(
    "route_feedback",
    lambda x: x["route"],
    {
        "Customer Service Team": "customer_service",
        "HR/Employee Recognition": "hr_recognition",
        "Product Development": "product_development",
        "FAQ/Knowledge Base Update": "faq_update",
        "General Processing": "update_database"
    }
)

# Final steps
workflow.add_edge("customer_service", "update_database")
workflow.add_edge("hr_recognition", "update_database")
workflow.add_edge("product_development", "update_database")
workflow.add_edge("faq_update", "update_database")
workflow.add_edge("update_database", "trend_analysis_node")
workflow.add_edge("trend_analysis_node", "update_dashboard")
workflow.add_edge("update_dashboard", "generate_summary")

workflow.add_edge("generate_summary", END)



# Compile the graph
graph = workflow.compile()