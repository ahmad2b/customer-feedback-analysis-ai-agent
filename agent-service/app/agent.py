from dotenv import load_dotenv

from langgraph.graph import StateGraph, END, START
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from app.state import State
from app.tools import save_feedback_to_postgres
from app.utils import logger as logging

load_dotenv()
    
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
)


llm_with_tools = llm


def assistant_node(state: State):
    """Handles user requests regarding stored feedback data."""
    logging.info("Assistant is processing user query.")
    user_message = state.messages[-1].content
    
    # Check if the user requested a summary
    if "summary" in user_message.lower():
        logging.info("User requested a summary, invoking the summary tool.")
        # Invoke the summary tool
        summary_response = llm_with_tools.invoke([HumanMessage(content=user_message)])
        return {"messages": [summary_response]}
    else:
        # General response generation
        response = llm.invoke([HumanMessage(content=user_message)])
        return {"messages": [response]}

def categorization_node(state: State):
    ''' Categorize the feedback into: Complaint, Praise, Suggestion, or Query '''
    logging.info("Categorizing the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Categorize the following customer feedback into one of these categories: Complaint, Praise, Suggestion, or Query.\n\nFeedback: {feedback}\n\nCategory:"
    )
    
    message = HumanMessage(content=prompt.format(feedback=state.feedback))
    category = llm_with_tools.invoke([message]).content.strip()
    
    valid_categories = ["Complaint", "Praise", "Suggestion", "Query"]
    if category not in valid_categories:
        logging.error(f"Invalid category received: {category}")
        category = "General"  # Default to a general category or handle as needed
    
    
    logging.info(f"Feedback categorized as: {category}")
    return {"category": category}

def entity_extraction_node(state: State):
    ''' Extract relevant entities (Product, Store Location, Employee Name) from the feedback '''
    logging.info("Extracting entities from the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Extract relevant entities (Product, Store Location, Employee Name) from the following customer feedback. Provide the result as a comma-separated list.\n\nFeedback: {feedback}\n\nEntities:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback))
    entities = llm_with_tools.invoke([message]).content.strip().split(", ")
    logging.info(f"Entities extracted: {entities}")
    return {"entities": entities}

def summarization_node(state: State):
    ''' Summarize the feedback in one concise sentence '''
    logging.info("Summarizing the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Summarize the following customer feedback in one concise sentence.\n\nFeedback: {feedback}\n\nSummary:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback))
    summary = llm_with_tools.invoke([message]).content.strip()
    logging.info(f"Feedback summarized as: {summary}")
    return {"summary": summary}

def sentiment_analysis_node(state: State):
    ''' Analyze the sentiment of the feedback: Positive, Negative, or Neutral '''
    logging.info("Analyzing the sentiment of the feedback")
    prompt = PromptTemplate(
        input_variables=["feedback"],
        template="Analyze the sentiment of the following customer feedback. Respond with only one word: Positive, Negative, or Neutral.\n\nFeedback: {feedback}\n\nSentiment:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback))
    sentiment = llm_with_tools.invoke([message]).content.strip()
    logging.info(f"Sentiment analyzed as: {sentiment}")
    return {"sentiment": sentiment}

def priority_assignment_node(state: State):
    ''' Assign priority based on category and sentiment: High, Medium, or Low '''
    logging.info("Assigning priority based on category and sentiment")
    prompt = PromptTemplate(
        input_variables=["category", "sentiment"],
        template="Assign a priority (High, Medium, or Low) based on the following feedback category and sentiment:\nCategory: {category}\nSentiment: {sentiment}\n\nPriority:"
    )
    message = HumanMessage(content=prompt.format(category=state.category, sentiment=state.sentiment))
    priority = llm_with_tools.invoke([message]).content.strip()
    logging.info(f"Priority assigned as: {priority}")
    return {"priority": priority}

def route_based_on_category(state: State):
    logging.info("Routing the feedback based on category")
    category = state.category
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
    
def customer_service_action(state: State):
    logging.info("Generating action items for Customer Service Team")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer complaint: {feedback}\nSummary: {summary}\nProvide 2-3 action items for the customer service team to resolve the issue:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback, summary=state.summary))
    action_items = llm_with_tools.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def hr_recognition_action(state: State):
    logging.info("Generating action items for HR/Employee Recognition")
    prompt = PromptTemplate(
        input_variables=["feedback", "entities"],
        template="Based on this customer praise: {feedback}\nMentioned entities: {entities}\nSuggest 1-2 ways to recognize the employee(s) mentioned:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback, entities=", ".join(state.entities)))
    action_items = llm_with_tools.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def product_development_action(state: State):
    logging.info("Generating product improvement initiatives")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer suggestion: {feedback}\nSummary: {summary}\nProvide 2-3 potential product improvement initiatives:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback, summary=state.summary))
    action_items = llm_with_tools.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def faq_update_action(state: State):
    logging.info("Generating FAQ/Knowledge Base update suggestions")
    prompt = PromptTemplate(
        input_variables=["feedback", "summary"],
        template="Based on this customer query: {feedback}\nSummary: {summary}\nSuggest 1-2 updates or additions to the FAQ/Knowledge Base:"
    )
    message = HumanMessage(content=prompt.format(feedback=state.feedback, summary=state.summary))
    action_items = llm_with_tools.invoke([message]).content.strip().split("\n")
    logging.info(f"Action items generated: {action_items}")
    return {"action_items": action_items}

def update_database(state: State):
    logging.info("Updating database with feedback analysis results")
       
    feedback_data = {
        "feedback": state.feedback,
        "category": state.category,
        "entities": ", ".join(state.entities),
        "summary": state.summary,
        "sentiment": state.sentiment,
        "priority": state.priority,
        "route": state.route,
        "action_items": ", ".join(state.action_items),
        "trend_analysis": state.trend_analysis
    }
    
    if not any(feedback_data.values()):
        raise ValueError("No data to update in the database")
    
    save_feedback_to_postgres(feedback_data)


# Define the graph workflow
workflow = StateGraph(State)

# workflow.add_node("assistant", assistant_node)
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


workflow.add_edge(START, "categorization")
workflow.add_edge("categorization", "entity_extraction")
workflow.add_edge("categorization", "summarization")
workflow.add_edge("categorization", "sentiment_analysis")
workflow.add_edge("entity_extraction", "priority_assignment")
workflow.add_edge("summarization", "priority_assignment")
workflow.add_edge("sentiment_analysis", "priority_assignment")
workflow.add_edge("priority_assignment", "route_feedback")
workflow.add_conditional_edges(
    "route_feedback",
    lambda x: x.route,
    {
        "Customer Service Team": "customer_service",
        "HR/Employee Recognition": "hr_recognition",
        "Product Development": "product_development",
        "FAQ/Knowledge Base Update": "faq_update",
        "General Processing": "update_database"
    }
)
workflow.add_edge("customer_service", "update_database")
workflow.add_edge("hr_recognition", "update_database")
workflow.add_edge("product_development", "update_database")
workflow.add_edge("faq_update", "update_database")
workflow.add_edge("update_database", END)

# Compile the graph
graph = workflow.compile()