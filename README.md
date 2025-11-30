# 🎰 GamblingMind - Sistema de Predicción de Casino

Sistema educativo de análisis estadístico para juegos de casino. Combina un backend Python con análisis estadístico y un frontend React interactivo.

⚠️ **PROYECTO EDUCATIVO** - No usar para apuestas reales.

## 📋 Requisitos

- **Python 3.10+** (backend)
- **Node.js 18+** (frontend)
- **Ollama** (para chatbot con IA)

## 🚀 Instalación Rápida

### 1. Backend (Python Flask)

```bash
cd Chatbot-py
python -m venv venv

# Windows
venv\Scripts\activate
# o Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

El backend estará disponible en `http://localhost:5000`

### 2. Frontend (React + Vite)

```bash
# En la raíz del proyecto
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 3. Ollama (Chatbot con IA)

```bash
# En otra terminal
ollama serve

# En otra terminal (descargar modelo)
ollama pull llama3.2:3b
```

## 📁 Estructura del Proyecto

```
GamblingMind/
├── Chatbot-py/              # Backend Python
│   ├── core/               # Motor de predicción
│   │   └── predictor_casino.py
│   ├── api/                # Simulador de juegos
│   │   └── simulador.py
│   ├── chatbot/            # Chatbot con Ollama
│   │   └── ollama_chat.py
│   ├── utils/              # Utilidades
│   │   └── helpers.py
│   ├── app.py              # API REST Flask
│   ├── main.py             # CLI
│   └── requirements.txt
│
├── src/                     # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas
│   ├── services/          # API client
│   ├── context/           # Context API
│   ├── styles/            # CSS
│   └── App.jsx
│
├── .env.example            # Variables de entorno
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta si es necesario:

```bash
cp .env.example .env
```

Contenido de `.env`:
```
VITE_API_URL=http://localhost:5000
```

## 📚 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Info de la API |
| GET | `/health` | Estado del servidor |
| GET | `/games` | Lista de juegos disponibles |
| GET | `/tables/<game>` | Mesas de un juego |
| POST | `/simulate` | Simular una jugada |
| POST | `/predict` | Obtener predicción |
| POST | `/chat` | Chat con IA |
| GET | `/stats` | Estadísticas generales |

## 🎮 Juegos Soportados

- **Ruleta Europea** - Predicción de números y colores
- **Blackjack** - Análisis con conteo de cartas
- **Póker Texas Hold'em** - Evaluación de manos
- **Jackpot Progresivo** - Predicción de rangos

## 🤖 Chatbot IA

El chatbot utiliza **Ollama** con el modelo `llama3.2:3b`.

**Requisitos:**
1. Descargar Ollama desde https://ollama.ai
2. Ejecutar: `ollama serve`
3. Descargar modelo: `ollama pull llama3.2:3b`

## 📊 Tecnologías

### Frontend
- React 19
- Vite 7
- Context API (State Management)
- Lucide React (Iconos)

### Backend
- Flask 3.0
- Flask-CORS 4.0
- NumPy 2.1
- Pandas 2.0
- Scikit-learn 1.3
- Requests (para Ollama)

## ⚠️ Advertencias Importantes

Este sistema es **únicamente educativo**:
- No usa machine learning real
- Las predicciones son análisis estadísticos basados en frecuencias
- La ruleta y juegos de azar tienen ventaja de la casa
- NO usar dinero real bajo ninguna circunstancia

## 🔒 Seguridad

- CORS restringido a localhost
- Sin autenticación (desarrollo local)
- Sin validación de inputs (MEJORAR)
- Sin rate limiting (AGREGAR)

## 📝 Desarrollar

### Ejecutar tests de backend
```bash
cd Chatbot-py
python -m pytest
```

### Linting frontend
```bash
npm run lint
```

### Build para producción
```bash
npm run build
```

## 🐛 Issues Conocidos

1. Las predicciones de ruleta son estadísticas, no determinísticas
2. Falta validación robusta de inputs
3. No hay persistencia de datos
4. Historial de chat no se sincroniza entre pestañas

## 📖 Documentación Adicional

- [Backend README](./Chatbot-py/README.md)
- [API Specification](./docs/API.md)

## 📄 Licencia

Este es un proyecto educativo. Úsalo responsablemente.

## 👨‍💻 Autor

GamblingMind - Sistema educativo de análisis de juegos de casino
