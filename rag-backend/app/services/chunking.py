def split_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunk = text[start:end]

        if chunk.strip():
            chunks.append(chunk.strip())

        start += chunk_size - chunk_overlap

    return chunks