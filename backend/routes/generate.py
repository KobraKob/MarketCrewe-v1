import json
from fastapi import APIRouter, HTTPException
from workflows.weekly_content_workflow import run_weekly_content_plan
from pydantic import BaseModel
from openai import RateLimitError

generate_router = APIRouter()

class ContentRequest(BaseModel):
    brand_name: str
    industry: str
    audience: str
    tone: str
    goals: str
    products: list[str]

@generate_router.post("")
def generate_content(request: ContentRequest):
    # Save the incoming data to brand_data.json
    with open("intake/brand_data.json", "w") as f:
        json.dump(request.dict(), f, indent=4)

    context = {
        "brand_name": request.brand_name,
        "industry": request.industry,
        "audience": request.audience,
        "tone": request.tone,
        "goals": [goal.strip() for goal in request.goals.split(',')],
        "products": request.products
    }
    try:
        generated_content = run_weekly_content_plan(context)
        return {"content": generated_content}
    except RateLimitError as e:
        raise HTTPException(status_code=429, detail=f"Rate limit exceeded. Please try again later. Details: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
