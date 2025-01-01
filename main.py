from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Allow CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory chat storage
chat_history = []

# Chat message model
class ChatMessage(BaseModel):
    sender: str
    message: str

# POST endpoint to send a message
@app.post("/api/chat")
async def post_message(msg: ChatMessage):
    chat_history.append(msg.dict())
    return {"status": "Message sent", "message": msg}

# GET endpoint to retrieve chat history
@app.get("/api/chat")
async def get_messages():
    return {"status": "Success", "chat_history": chat_history}
