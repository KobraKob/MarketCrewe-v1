# backend/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routes.generate import generate_router
from routes.deliver_email import email_router
from routes.deliver_zip import zip_router

app = FastAPI(title="MarketCrew Delivery API")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # You can tighten this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Location"],  # Expose Location header for redirects
)

# Routes
app.include_router(generate_router, prefix="/generate")
app.include_router(email_router, prefix="/deliver")
app.include_router(zip_router, prefix="/deliver")
