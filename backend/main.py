
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
import os
from dotenv import load_dotenv
import json
from db import (
    save_query_to_history,
    save_answer_to_history,
    save_query_to_context_history,
    save_answer_to_context_history,
    make_context_from_chat_history,
    fetch_chat_history,
    fetch_context,
    get_message_count,
    initialize_db,
)
from agent import azmth_agent

# Load environment variables
load_dotenv()

app = FastAPI(title="Chat History API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database connection
initialize_db()

# Models
class Message(BaseModel):
    content: str
    isQuery: bool
    timestamp: Optional[str] = None

class ContextRequest(BaseModel):
    userId: str
    companyId: str

class QueryRequest(BaseModel):
    userId: str
    companyId: str
    query: str
    userName: Optional[str] = None

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

# Routes
@app.get("/", response_model=ApiResponse)
async def root():
    return {"success": True, "message": "Chat History API is running"}

@app.post("/query", response_model=ApiResponse)
async def process_query(request: QueryRequest):
    try:
        # Get current time
        timestamp = datetime.now().isoformat()
        
        # Save the query to history
        save_query_to_history(request.userId, request.companyId, request.query, timestamp, request.userName)
        
        # Process the query with the agent
        answer = await azmth_agent(request.userId, request.companyId, request.query)
        
        # Save the answer to history
        answer_timestamp = datetime.now().isoformat()
        save_answer_to_history(request.userId, request.companyId, answer, answer_timestamp)
        
        # Check if we need to update the context
        msg_count = get_message_count(request.userId, request.companyId)
        if msg_count % 5 == 0:  # Every 5 messages
            make_context_from_chat_history(request.userId, request.companyId)
        
        return {
            "success": True,
            "message": "Query processed successfully",
            "data": {
                "answer": answer,
                "timestamp": answer_timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{company_id}/{user_id}", response_model=ApiResponse)
async def get_chat_history(company_id: str, user_id: str):
    try:
        history = fetch_chat_history(user_id, company_id)
        return {
            "success": True,
            "message": "Chat history retrieved successfully",
            "data": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/context/{company_id}/{user_id}", response_model=ApiResponse)
async def get_context(company_id: str, user_id: str):
    try:
        context = fetch_context(user_id, company_id)
        return {
            "success": True,
            "message": "Context retrieved successfully",
            "data": context
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-context", response_model=ApiResponse)
async def generate_context(request: ContextRequest):
    try:
        make_context_from_chat_history(request.userId, request.companyId)
        return {
            "success": True,
            "message": "Context generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
