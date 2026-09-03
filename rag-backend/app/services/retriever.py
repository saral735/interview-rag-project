from app.qdrant_client import qdrant_client, COLLECTION_NAME
from app.services.embeddings import generate_embeddings


def search_similar_chunks(query: str, limit: int = 3):
    query_embedding = generate_embeddings([query])[0]

    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
    )

    return results.points