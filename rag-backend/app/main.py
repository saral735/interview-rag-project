from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router


app = FastAPI(
    title="Interview RAG API",
    version="0.1.0"
)


# React frontend ko FastAPI access karne ki permission
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Interview RAG API is running"}


app.include_router(upload_router)
app.include_router(chat_router)