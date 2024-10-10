# Agent UI

This project is the frontend component of the Customer Feedback Analysis AI Agent. It is built using Next.js and integrates with the Vercel AI SDK to create generative user interfaces by streaming React Server Components to the client.

## Features

- Generative UI with React Server Components
- Integration with Vercel AI SDK
- Tailwind CSS for styling
- TypeScript support

## Getting Started

### Prerequisites

- Node.js
- npm, Yarn, or pnpm
- API keys for AI providers (e.g., OpenAI)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmad2b/customer-feedback-analysis-ai-agent.git
   cd agent-ui
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env` file based on the `.env.example` file and add your API keys:

   ```bash
   cp .env.example .env
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open http://localhost:3000 with your browser to see the result.
