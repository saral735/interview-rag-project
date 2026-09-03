from functools import lru_cache
from fastembed import TextEmbedding

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache
def get_embedding_model() -> TextEmbedding:
    return TextEmbedding(model_name=MODEL_NAME)


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    cleaned_texts = [
        text.strip()
        for text in texts
        if text and text.strip()
    ]

    if not cleaned_texts:
        return []

    model = get_embedding_model()

    embeddings = model.embed(cleaned_texts)

    return [
        embedding.tolist()
        for embedding in embeddings
    ]