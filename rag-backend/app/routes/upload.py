from fastapi import APIRouter, UploadFile, File
from app.services.pdf_service import extract_text_from_pdf
from app.services.chunking import split_text
from app.services.embeddings import generate_embeddings
from app.services.vector_store import store_embeddings

import tempfile
import os


router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Temporary PDF file create karo
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(await file.read())
        temp_file_path = temp_file.name

    try:
        # Step 1: Extract text from PDF
        text = extract_text_from_pdf(temp_file_path)

        # Step 2: Split text into chunks
        chunks = split_text(text)

        # Step 3: Generate embeddings
        embeddings = generate_embeddings(chunks)

        # Step 4: Store chunks + embeddings in Qdrant
        stored_count = store_embeddings(
            chunks,
            embeddings
        )

        return {
            "filename": file.filename,
            "message": "PDF processed and stored successfully",
            "total_chunks": len(chunks),
            "total_embeddings": len(embeddings),
            "stored_in_qdrant": stored_count,
            "embedding_dimension": (
                len(embeddings[0])
                if embeddings
                else 0
            )
        }

    finally:
        # Temporary file delete
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)