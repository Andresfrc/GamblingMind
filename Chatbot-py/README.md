# 🎰 Casino Predictor Backend

API REST y CLI para análisis estadístico de juegos de casino.

## 🚀 Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

## 📋 Requisitos

- Python 3.10+
- Flask 3.0.0
- NumPy 2.1.2
- Pandas 2.0.3
- Scikit-learn 1.3.0
- Ollama (opcional, para chatbot)

## 🏃 Ejecutar

### Como API REST

```bash
python app.py
```

La API estará disponible en `http://localhost:5000`

### Como CLI (interfaz de línea de comandos)

```bash
python main.py
```

O en modo rápido (chat directo):
```bash
python main.py --quick
```

## 📁 Estructura

```
Chatbot-py/
├── core/
│   └── predictor_casino.py    # Motor de predicción estadística
├── api/
│   └── simulador.py           # Simulador de juegos
├── chatbot/
│   └── ollama_chat.py         # Interfaz Ollama/Llama
├── utils/
│   └── helpers.py             # Funciones auxiliares
├── data/                       # Datos generados
├── app.py                     # API REST Flask
├── main.py                    # CLI
└── requirements.txt
```

## 🎮 Módulos Principales

### PredictorCasino (core/predictor_casino.py)

Motor de predicción basado en análisis estadístico:

```python
from core.predictor_casino import PredictorCasino

predictor = PredictorCasino(ventana_historica=100)

# Predecir ruleta
historial = [17, 5, 32, 14, ...]
prediccion = predictor.predecir_ruleta(historial)

# Predecir blackjack
cartas = ['10♠', 'K♥', '5♦', ...]
prediccion = predictor.predecir_blackjack(cartas)

# Predecir poker
mano = ['As', 'Kd']
comunitarias = ['2h', '5c', '9d']
prediccion = predictor.predecir_poker(mano, comunitarias)
```

### SimuladorCasino (api/simulador.py)

Simula juegos de casino de forma realista:

```python
from api.simulador import SimuladorCasino

simulador = SimuladorCasino()

# Simular ruleta
resultado = simulador.simular_tirada_ruleta('table_1')
# {'numero': 17, 'color': 'negro', 'paridad': 'impar', ...}

# Simular blackjack
resultado = simulador.simular_mano_blackjack('table_1')
# {'mano_jugador': ['10♠', 'K♥'], 'valor': 20, ...}

# Simular poker
resultado = simulador.simular_mano_poker('table_1')
# {'mano_jugador': ['As', 'Kd'], 'fase': 'flop', ...}

# Obtener mesas
mesas = simulador.obtener_mesas_disponibles('ruleta')
```

### ChatbotOllama (chatbot/ollama_chat.py)

Chatbot especializado en análisis de casino:

```python
from chatbot.ollama_chat import ChatbotOllama

chatbot = ChatbotOllama()

# Verificar conexión
ok, msg = chatbot.verificar_conexion()

# Generar respuesta
respuesta = chatbot.generar_respuesta(
    pregunta="¿Cuál es la ventaja de la casa en blackjack?",
    contexto_prediccion={...},  # Opcional
    historial=[...]              # Opcional
)
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "predictor_loaded": true,
  "simulador_loaded": true,
  "ollama_available": true,
  "mesas_activas": {...}
}
```

### Obtener Juegos
```
GET /games
```

### Obtener Mesas
```
GET /tables/<juego>
```

### Simular Jugada
```
POST /simulate
Content-Type: application/json

{
  "game": "ruleta",
  "table": "table_1"
}
```

### Obtener Predicción
```
POST /predict
Content-Type: application/json

{
  "game": "ruleta",
  "table": "table_1"
}
```

Respuesta:
```json
{
  "prediccion": {
    "juego": "ruleta",
    "numero_predicho": 17,
    "confianza_prediccion": 8.5,
    "probabilidades_color": {
      "rojo": 52.3,
      "negro": 45.2,
      "verde": 2.5
    },
    "numeros_calientes": [...],
    "recomendacion": "..."
  }
}
```

### Chat con IA
```
POST /chat
Content-Type: application/json

{
  "message": "¿Cuál es la mejor estrategia para blackjack?"
}
```

Respuesta:
```json
{
  "response": "La mejor estrategia es seguir la estrategia básica de blackjack...",
  "contexto_detectado": false,
  "juego_detectado": null
}
```

### Estadísticas
```
GET /stats
```

### Reiniciar Mesa
```
POST /reset/<juego>/<mesa>
```

## 🤖 Configurar Ollama

El chatbot requiere Ollama y un modelo LLM.

### Instalación de Ollama

1. Descargar desde https://ollama.ai
2. Instalar y abrir
3. En terminal ejecutar:
   ```bash
   ollama serve
   ```

### Descargar Modelo

```bash
ollama pull llama3.2:3b
```

Modelos alternativos:
- `llama3.2:1b` - Muy rápido, menos preciso
- `llama2:7b` - Más grande, más preciso (requiere más RAM)
- `mistral:7b` - Equilibrado

## 🧪 Testing

Ejecutar ejemplo de simulador:
```bash
python api/simulador.py
```

Ejecutar ejemplo de chatbot:
```bash
python chatbot/ollama_chat.py
```

## 📊 Limitaciones Conocidas

1. **Predicción de Ruleta**: Usa análisis de frecuencias (números calientes/fríos)
   - No garantiza predicción determinística
   - La ruleta es aleatoria, cualquier patrón es coincidencia

2. **Blackjack**: Conteo Hi-Lo simplificado
   - Asume 6 mazos
   - No implementa todas las variantes

3. **Póker**: Evaluación básica de manos
   - No tiene en cuenta dinámica de jugadores
   - Cálculo de outs simplificado

4. **Chatbot**: Depende de Ollama
   - Si Ollama no está disponible, el chat no funciona
   - Requiere conexión a localhost

## 🔒 Seguridad

- ✅ CORS restringido a localhost
- ❌ Sin autenticación (usar solo localmente)
- ❌ Sin validación robusta de inputs (MEJORAR)
- ❌ Sin rate limiting (AGREGAR)
- ❌ Sin HTTPS (AGREGAR en producción)

## 🚀 Producción

**NO usar en producción sin:**

1. Agregar autenticación
2. Validar todos los inputs
3. Implementar rate limiting
4. Usar HTTPS
5. Configurar logging a archivo
6. Agregar tests unitarios
7. Documentar cambios

## 📝 Variables de Entorno

Actualmente no hay .env en Python, pero se podría agregar:

```python
import os
API_PORT = os.getenv('API_PORT', 5000)
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2:3b')
```

## 🐛 Troubleshooting

### Error: "Ollama no está corriendo"
```bash
ollama serve
```

### Error: "Modelo no encontrado"
```bash
ollama pull llama3.2:3b
```

### Error: "Puerto 5000 en uso"
```python
# En app.py, cambiar puerto
app.run(port=5001)
```

### Error: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

## 📖 Documentación

- [README Principal](../README.md)
- [API Completa](../docs/API.md) (pendiente)

## 📄 Notas

- Sistema **EDUCATIVO** únicamente
- No usar para apuestas reales
- Las predicciones son estadísticas, no garantizadas
- La casa siempre tiene ventaja matemática
