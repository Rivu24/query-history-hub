
# Chat History Backend

This is a FastAPI backend for managing chat history and context for a conversational AI system.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file based on `.env.example` and add your configuration.

3. Start the server:
   ```
   python main.py
   ```

The server will run at http://localhost:8000 by default.

## API Endpoints

- `GET /` - Check if the API is running
- `POST /query` - Process a new user query
- `GET /history/{company_id}/{user_id}` - Get chat history for a user
- `GET /context/{company_id}/{user_id}` - Get context for a user
- `POST /generate-context` - Manually generate context for a user

## Data Structure

The system uses two main collections:

1. `user_chat_history`: Stores the complete conversation history
2. `user_chat_context`: Stores the context summaries and recent messages

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `OPENAI_API_KEY`: Your OpenAI API key for the agent
- `PORT`: Server port (default: 8000)
