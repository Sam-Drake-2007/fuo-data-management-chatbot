# main.py

import os
import json
from fastapi import FastAPI
from google import genai
from google.genai import types
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# fastapi dev main.py  <= command to run the server

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],
)

BASE_INSTRUCTIONS = ("""
    Use only plain text in your responses. 
    Do not use any markdown, HTML, or other formatting. 
    Respond concisely and clearly.
    You will be provided with the conversation history between the user and the bot. 
    Use this history to provide contextually relevant and coherent responses.
""")

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
)

@app.get("/")
async def read_root() -> dict:
    return {"status": "backend is running"}

@app.post("/generate")
async def generate_text(prompt: str, history: str) -> dict:
    history = json.loads(history)
    print(history)
    response = await generate(prompt, history)
    return {"response": response}

async def generate(prompt: str, history: list[list[str]]) -> str:
    
    model = "gemini-flash-latest"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]
    tools = [
        types.Tool(url_context=types.UrlContext()),
    ]
    
    instructions = BASE_INSTRUCTIONS + "\n\nConversation History:\n"
    user_history = history[0]
    bot_history = history[1]
    history = list(zip(user_history, bot_history))
    for turn in history:
        user_msg, bot_msg = turn
        instructions += f"User: {user_msg}\nBot: {bot_msg}\n"
    
    print(instructions)
    generate_content_config = types.GenerateContentConfig(
        tools=tools,
        system_instruction=[
            types.Part.from_text(text=instructions),
        ],
    )

    response = await client.aio.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )
    
    return response.text