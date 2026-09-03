from fastapi import APIRouter
from pydantic import BaseModel

from app.services.retriever import search_similar_chunks
from app.services.llm import generate_answer

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/")
def chat(request: ChatRequest):

    results = search_similar_chunks(request.question)

    context = "\n\n".join(
        result.payload.get("text", "")
        for result in results
    )

    answer = generate_answer(
        request.question,
        context
    )

    return {
        "question": request.question,
        "answer": answer
    }