# Agent Service

This project is the backend of the Customer Feedback Analysis AI Agent. It is built using `Python`, `FastAPI`, `LangGraph`, `LangServe` and provides various actions for generating insights and action items based on customer feedback.

## Features

- Generate action items for HR/Employee Recognition
- Generate action items for Customer Service Team
- Generate product improvement initiatives
- Integration with AI models for natural language processing

## Getting Started

### Prerequisites

- Python 3.11+
- Poetry for dependency management
- Docker (optional, for containerized development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmad2b/customer-feedback-analysis-ai-agent.git
   cd agent-service
   ```

2. Install dependencies using Poetry:

   ```bash
   poetry install
   ```

3. Create a `.env` file based on the `.env.example` file and add your API keys:

   ```bash
   cp .env.example .env
   ```

4. Run the development server:

   ```bash
    poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Using Docker

1. Build the Docker image:

   ```bash
   cd agent-service
   docker-compose build
   ```

2. Run the Docker container:

   ```bash
    docker-compose up
   ```
