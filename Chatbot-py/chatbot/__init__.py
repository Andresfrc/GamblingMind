"""
Chatbot module - Selector automático de IA
"""

from .ollama_chat import ChatbotOllama

# Importar chatbots según configuración
try:
    from config import USE_GROQ, USE_HUGGINGFACE, USE_OLLAMA
    
    if USE_GROQ:
        from .groq_chat import ChatbotGroq
        from config import GROQ_API_KEY, GROQ_MODEL
        
        def get_chatbot():
            """Retorna chatbot configurado con Groq"""
            return ChatbotGroq(api_key=GROQ_API_KEY, model=GROQ_MODEL)
    
    elif USE_HUGGINGFACE:
        from .huggingface_chat import ChatbotHuggingFace
        from config import HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL
        
        def get_chatbot():
            """Retorna chatbot configurado con Hugging Face"""
            return ChatbotHuggingFace(api_key=HUGGINGFACE_API_KEY, model=HUGGINGFACE_MODEL)
    
    else:
        # Usar Ollama por defecto
        def get_chatbot():
            """Retorna chatbot configurado con Ollama"""
            return ChatbotOllama()

except ImportError:
    # Si no existe config.py, usar Ollama
    def get_chatbot():
        """Retorna chatbot por defecto (Ollama)"""
        return ChatbotOllama()


__all__ = ['ChatbotOllama', 'get_chatbot']