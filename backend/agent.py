
from typing import Dict, Any
import os
from datetime import datetime
import openai
from db import (
    save_query_to_context_history,
    save_answer_to_context_history,
    fetch_context
)

# Initialize OpenAI client
openai.api_key = os.environ.get("OPENAI_API_KEY", "your-api-key")

async def azmth_agent(user_id: str, company_id: str, query: str) -> str:
    """
    Process a user query through the Azmth agent
    
    Args:
        user_id: The ID of the user
        company_id: The ID of the company
        query: The user's query text
    
    Returns:
        The agent's response as a string
    """
    try:
        # Get current timestamp
        timestamp = datetime.now().isoformat()
        
        # Save the query to context history
        save_query_to_context_history(user_id, company_id, query, timestamp)
        
        # Fetch the user's context
        user_context = fetch_context(user_id, company_id)
        context = user_context.get("context", "")
        
        # In a real implementation, you would use this context with your LLM
        # Here we're just simulating a response based on the query
        
        # For demonstration, we'll generate a simple response
        # In a real system, this would call your LLM with the query and context
        if "password" in query.lower():
            answer = "You can reset your password by clicking on the 'Forgot Password' link on the login page."
        elif "business hours" in query.lower():
            answer = "Our business hours are 9 AM to 5 PM, Monday through Friday."
        elif "account" in query.lower():
            answer = "I can help with your account. Could you please provide your account number for verification?"
        else:
            answer = f"Thank you for your question about '{query}'. Let me help you with that. Based on our previous conversations, I can provide you with the information you need."
        
        # Save the answer to context history
        answer_timestamp = datetime.now().isoformat()
        save_answer_to_context_history(user_id, company_id, answer, answer_timestamp)
        
        return answer
        
    except Exception as e:
        print(f"Error in azmth_agent: {str(e)}")
        return f"I'm sorry, but I encountered an error while processing your request. Error: {str(e)}"
