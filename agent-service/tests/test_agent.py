import pytest
import httpx
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def config():
    import uuid
    return {
        "configurable": {
            "passenger_id": "3442 587242",
            "thread_id": str(uuid.uuid4()),
        }
    }

@pytest.fixture
def tutorial_questions():
    return [
        "Hi there, what time is my flight?",
        "Am i allowed to update my flight to something sooner? I want to leave later today.",
        "Update my flight to sometime next week then",
        "The next available option is great",
        "what about lodging and transportation?",
        "Yeah i think i'd like an affordable hotel for my week-long stay (7 days). And I'll want to rent a car.",
        "OK could you place a reservation for your recommended hotel? It sounds nice.",
        "yes go ahead and book anything that's moderate expense and has availability.",
        "Now for a car, what are my options?",
        "Awesome let's just get the cheapest option. Go ahead and book for 7 days",
        "Cool so now what recommendations do you have on excursions?",
        "Are they available while I'm there?",
        "interesting - i like the museums, what options are there? ",
        "OK great pick one and book it for my second day there.",
    ]
    
def test_agent_service(config, tutorial_questions):
    for question in tutorial_questions:
        response = client.post("/agent", json={"messages": [{"role": "user", "content": question}], "config": config})
        assert response.status_code == 200
        events = response.json()
        assert "messages" in events