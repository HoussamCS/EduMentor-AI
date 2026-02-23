from __future__ import annotations

from openai import OpenAI

from src.config import settings


class OpenAILLMService:
    def __init__(self):
        if not settings.openai_api_key:
            self.client = None
        else:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def complete(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
        if self.client is None:
            return "OpenAI API key is missing. Set OPENAI_API_KEY in .env"

        response = self.client.chat.completions.create(
            model=settings.openai_model,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content or ""
