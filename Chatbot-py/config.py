"""
CONFIG.PY
Configuración centralizada del sistema
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

USE_GROQ = True
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = "mixtral-8x7b-32768"


USE_HUGGINGFACE = False
HUGGINGFACE_API_KEY = ""
HUGGINGFACE_MODEL = "meta-llama/Llama-3.2-3B-Instruct"


USE_OLLAMA = False
OLLAMA_MODEL = "llama3.2:3b"
OLLAMA_URL = "http://localhost:11434/api/generate"


AGENTE_AUTONOMO_ENABLED = True
AGENTE_DURACION_SEGUNDOS = 300
AGENTE_PAUSA_ENTRE_CICLOS = 2
AGENTE_OBJETIVO_PRINCIPAL = "maximizar_precision_predicciones"


AGENTE_EXPERIMENTOS_MINIMOS = 50
AGENTE_UMBRAL_RELEVANCIA = 10


VENTANA_HISTORICA = 100
LOG_EVENTOS = True
LOG_VERBOSE = False
