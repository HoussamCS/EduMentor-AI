"""
OpenAI LLM service for generating completions.

This module provides a wrapper around the OpenAI API for chat completions.
"""
from __future__ import annotations

from openai import OpenAI

from src.config import settings


class OpenAILLMService:
    """Service for interacting with OpenAI's chat completion API."""
    
    def __init__(self):
        """Initialize the OpenAI client with API key from settings."""
        if not settings.openai_api_key:
            self.client = None
        else:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def complete(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
        """
        Generate a chat completion using OpenAI's API.
        
        Args:
            system_prompt: The system message to set context
            user_prompt: The user's question or prompt
            temperature: Controls randomness (0.0-2.0, default 0.2)
            
        Returns:
            The generated completion text
        """
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
