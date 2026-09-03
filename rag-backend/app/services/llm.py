import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question: str, context: str) -> str:
    prompt = f"""
You are an AI assistant answering questions based only on the provided context.

Context:
{context}

Question:
{question}

Answer clearly and concisely.
If the answer is not present in the context, say:
"I don't have enough information in the provided documents."
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content