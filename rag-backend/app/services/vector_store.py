from qdrant_client.models import PointStruct

from app.qdrant_client import qdrant_client, COLLECTION_NAME


def store_embeddings(chunks: list[str], embeddings: list[list[float]]):
    points = []

    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        points.append(
            PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "text": chunk
                }
            )
        )

    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

    return len(points)