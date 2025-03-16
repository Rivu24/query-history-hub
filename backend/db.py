
from pymongo import MongoClient
from typing import Dict, List, Any, Optional
import os
from datetime import datetime
import uuid

# Database connection
client = None
db = None

def initialize_db():
    """Initialize the MongoDB connection"""
    global client, db
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    db = client["chat_database"]
    
    # Create indexes for faster queries
    db.user_chat_history.create_index([("companyId", 1), ("userId", 1)])
    db.user_chat_context.create_index([("companyId", 1), ("userId", 1)])

def save_query_to_history(user_id: str, company_id: str, query: str, timestamp: str, user_name: Optional[str] = None):
    """Save a user query to the chat history"""
    message_id = str(uuid.uuid4())
    
    # Check if the user exists
    user_exists = db.user_chat_history.find_one({
        "companyId": company_id, 
        "userId": user_id
    })
    
    if not user_exists:
        # Create a new user entry
        db.user_chat_history.insert_one({
            "companyId": company_id,
            "userId": user_id,
            "name": user_name or f"User {user_id}",
            "messages": []
        })
    
    # Add the message to the user's chat history
    db.user_chat_history.update_one(
        {"companyId": company_id, "userId": user_id},
        {"$push": {"messages": {
            "id": message_id,
            "content": query,
            "isQuery": True,
            "timestamp": timestamp
        }}}
    )
    
    return message_id

def save_answer_to_history(user_id: str, company_id: str, answer: str, timestamp: str):
    """Save an LLM answer to the chat history"""
    message_id = str(uuid.uuid4())
    
    # Add the message to the user's chat history
    db.user_chat_history.update_one(
        {"companyId": company_id, "userId": user_id},
        {"$push": {"messages": {
            "id": message_id,
            "content": answer,
            "isQuery": False,
            "timestamp": timestamp
        }}}
    )
    
    return message_id

def save_query_to_context_history(user_id: str, company_id: str, query: str, timestamp: str):
    """Save a user query to the context history"""
    message_id = str(uuid.uuid4())
    
    # Check if the user has a context entry
    context_exists = db.user_chat_context.find_one({
        "companyId": company_id, 
        "userId": user_id
    })
    
    if not context_exists:
        # Create a new context entry
        db.user_chat_context.insert_one({
            "companyId": company_id,
            "userId": user_id,
            "context": "",
            "lastUpdated": timestamp,
            "messages": []
        })
    
    # Add the message to the context history
    db.user_chat_context.update_one(
        {"companyId": company_id, "userId": user_id},
        {"$push": {"messages": {
            "id": message_id,
            "content": query,
            "isQuery": True,
            "timestamp": timestamp
        }}}
    )
    
    return message_id

def save_answer_to_context_history(user_id: str, company_id: str, answer: str, timestamp: str):
    """Save an LLM answer to the context history"""
    message_id = str(uuid.uuid4())
    
    # Add the message to the context history
    db.user_chat_context.update_one(
        {"companyId": company_id, "userId": user_id},
        {"$push": {"messages": {
            "id": message_id,
            "content": answer,
            "isQuery": False,
            "timestamp": timestamp
        }}}
    )
    
    return message_id

def get_message_count(user_id: str, company_id: str) -> int:
    """Get the count of messages for a user"""
    user = db.user_chat_history.find_one({"companyId": company_id, "userId": user_id})
    if user and "messages" in user:
        return len(user["messages"])
    return 0

def make_context_from_chat_history(user_id: str, company_id: str):
    """Generate a context summary from chat history"""
    # Fetch the user's chat history
    user = db.user_chat_history.find_one({"companyId": company_id, "userId": user_id})
    
    if not user or "messages" not in user or len(user["messages"]) == 0:
        return None
    
    # Extract messages for context creation
    messages = user["messages"]
    
    # Create a simple context summary (in a real system, this might use an LLM)
    context = "User conversation summary:\n"
    for msg in messages:
        prefix = "User: " if msg["isQuery"] else "Assistant: "
        context += f"{prefix}{msg['content']}\n"
    
    timestamp = datetime.now().isoformat()
    
    # Check if the user has a context entry
    context_exists = db.user_chat_context.find_one({
        "companyId": company_id, 
        "userId": user_id
    })
    
    if not context_exists:
        # Create a new context entry
        db.user_chat_context.insert_one({
            "companyId": company_id,
            "userId": user_id,
            "context": context,
            "lastUpdated": timestamp,
            "messages": []
        })
    else:
        # Update the existing context
        db.user_chat_context.update_one(
            {"companyId": company_id, "userId": user_id},
            {"$set": {
                "context": context,
                "lastUpdated": timestamp
            }}
        )
    
    return context

def fetch_chat_history(user_id: str, company_id: str) -> Dict[str, Any]:
    """Fetch the chat history for a user"""
    user = db.user_chat_history.find_one({"companyId": company_id, "userId": user_id})
    
    if not user:
        return {"userId": user_id, "name": f"User {user_id}", "messages": []}
    
    # Return only what's needed for the frontend
    return {
        "userId": user["userId"],
        "name": user["name"],
        "messages": user["messages"]
    }

def fetch_context(user_id: str, company_id: str) -> Dict[str, Any]:
    """Fetch the context for a user"""
    context = db.user_chat_context.find_one({"companyId": company_id, "userId": user_id})
    
    if not context:
        return {
            "userId": user_id,
            "context": "",
            "lastUpdated": datetime.now().isoformat(),
            "messages": []
        }
    
    return {
        "userId": context["userId"],
        "context": context["context"],
        "lastUpdated": context["lastUpdated"],
        "messages": context["messages"]
    }
