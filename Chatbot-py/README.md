# 🎰 Casino Predictor - Sistema de Análisis Estadístico para Juegos de Casino

> **⚠️ ADVERTENCIA LEGAL**: Este proyecto es **exclusivamente educativo y de simulación**. NO debe utilizarse para apuestas reales. El juego puede crear adicción. Si tienes problemas con el juego, busca ayuda profesional.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración Inicial](#-configuración-inicial)
- [Uso](#-uso)
- [Documentación de la API](#-documentación-de-la-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Ejemplos de Uso](#-ejemplos-de-uso)

---

## 🎯 Descripción

**Casino Predictor** es un sistema educativo que simula juegos de casino y proporciona análisis estadístico en tiempo real. Utiliza conceptos matemáticos reales de probabilidad, conteo de cartas y análisis de tendencias para enseñar cómo funcionan las matemáticas detrás de los juegos de casino.

### Juegos Soportados:
- 🎡 **Ruleta Europea**: Análisis de frecuencias y patrones de color
- 🃏 **Blackjack**: Sistema de conteo Hi-Lo y cálculo de ventaja del jugador
- 🎴 **Póker Texas Hold'em**: Evaluación de manos y cálculo de outs
- 💰 **Jackpot Progresivo**: Predicción de rangos y análisis de tendencias

---

## ✨ Características

- ✅ **Simulador Realista**: Genera resultados basados en probabilidades reales
- ✅ **Análisis Estadístico**: Predicciones basadas en ventanas históricas
- ✅ **Chat con IA**: Integración con Ollama/Llama para explicaciones inteligentes
- ✅ **API REST**: Backend Flask completo con endpoints documentados
- ✅ **CLI Interactivo**: Interfaz de línea de comandos amigable
- ✅ **Sin Entrenamiento ML**: Usa análisis estadístico directo (no requiere datasets)
- ✅ **Código Educativo**: Comentarios y docstrings detallados

---

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

### Obligatorios:
- **Python 3.8+** (recomendado 3.9 o 3.10)
- **pip** (gestor de paquetes de Python)
- **git** (para clonar el repositorio)

### Opcionales:
- **Ollama** (para funcionalidad de chat con IA)
  - Solo si quieres usar el chatbot inteligente
  - El sistema funciona perfectamente sin él

---

## 🚀 Instalación

### Paso 1: Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/tu-usuario/casino_predictor.git

# Entrar al directorio
cd casino_predictor
```

### Paso 2: Crear Entorno Virtual (Recomendado)

#### En Linux/Mac:
```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate
```

#### En Windows (PowerShell):
```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1
```

#### En Windows (CMD):
```cmd
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate.bat
```

### Paso 3: Instalar Dependencias

```bash
# Actualizar pip (recomendado)
pip install --upgrade pip

# Instalar todas las dependencias
pip install -r requirements.txt
```

**Alternativa (instalación manual):**
```bash
pip install flask flask-cors requests numpy pandas scikit-learn
```

### Paso 4: Verificar Instalación

```bash
# Ejecutar script de verificación
python -c "from flask import Flask; from core.predictor_casino import PredictorCasino; print('✅ Instalación correcta')"
```

Si ves `✅ Instalación correcta`, ¡todo está listo!

---

## ⚙️ Configuración Inicial

### Configuración Básica (Sin IA)

El sistema funciona inmediatamente después de la instalación. **No requiere configuración adicional** para el simulador y predictor.

### Configuración con IA (Opcional)

Si quieres usar el **chat con inteligencia artificial**, necesitas instalar Ollama:

#### 1. Instalar Ollama

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**macOS:**
```bash
# Descargar desde https://ollama.ai/download/mac
# O con Homebrew:
brew install ollama
```

**Windows:**
- Descargar instalador desde: https://ollama.ai/download/windows
- Ejecutar el instalador
- Reiniciar la terminal

#### 2. Iniciar Ollama

```bash
# En una terminal separada (déjala abierta)
ollama serve
```

#### 3. Descargar Modelo de IA

```bash
# En otra terminal
ollama pull llama3.2:3b
```

**Modelos alternativos:**
```bash
# Modelo más pequeño (más rápido, menos preciso)
ollama pull gemma:2b

# Modelo más grande (más lento, más preciso)
ollama pull llama3.2:7b
```

---

## 💻 Uso

### Opción 1: Modo CLI (Terminal Interactivo)

```bash
# Iniciar interfaz de línea de comandos
python main.py
```

**Menú principal:**
```
🎰 CASINO PREDICTOR
1. 🎡 Ruleta Europea
2. 🃏 Blackjack
3. 🎴 Póker Texas Hold'em
4. 💰 Jackpot Progresivo
5. 💬 Chat con IA (Ollama)
6. 📊 Ver estadísticas generales
7. ❌ Salir
```

**Modo rápido (chat directo):**
```bash
python main.py --quick
```

### Opción 2: Modo API (Backend Flask)

```bash
# Iniciar servidor backend
python app.py
```

El servidor estará disponible en: **http://localhost:5000**

**Verificar que funciona:**
```bash
# En otra terminal
curl http://localhost:5000/health
```

### Opción 3: Usar Ambos (Recomendado)

```bash
# Terminal 1: Backend
python app.py

# Terminal 2: CLI
python main.py

# Terminal 3 (opcional): Ollama
ollama serve
```

---

## 📡 Documentación de la API

### Endpoints Disponibles

#### 1. Estado del Servidor
```bash
GET /health
```

**Ejemplo:**
```bash
curl http://localhost:5000/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "predictor_loaded": true,
  "simulador_loaded": true,
  "ollama_available": false,
  "mesas_activas": {
    "ruleta": 3,
    "blackjack": 3,
    "poker": 2
  }
}
```

---

#### 2. Lista de Juegos
```bash
GET /games
```

**Ejemplo:**
```bash
curl http://localhost:5000/games
```

**Respuesta:**
```json
{
  "juegos": [
    {
      "id": "ruleta",
      "nombre": "Ruleta Europea",
      "descripcion": "Predicción de números y colores basada en historial",
      "emoji": "🎡"
    }
  ]
}
```

---

#### 3. Simular Jugada
```bash
POST /simulate
Content-Type: application/json

{
  "game": "ruleta",
  "table": "table_1"
}
```

**Ejemplos:**

**Ruleta:**
```bash
curl -X POST http://localhost:5000/simulate \
  -H "Content-Type: application/json" \
  -d '{"game": "ruleta", "table": "table_1"}'
```

**Blackjack:**
```bash
curl -X POST http://localhost:5000/simulate \
  -H "Content-Type: application/json" \
  -d '{"game": "blackjack", "table": "table_1"}'
```

**Respuesta (Ruleta):**
```json
{
  "resultado": {
    "juego": "ruleta",
    "mesa": "table_1",
    "numero": 17,
    "color": "negro",
    "paridad": "impar",
    "docena": 2,
    "columna": 2,
    "timestamp": "2025-11-26 15:30:45"
  }
}
```

---

#### 4. Obtener Predicción
```bash
POST /predict
Content-Type: application/json

{
  "game": "ruleta",
  "table": "table_1"
}
```

**Ejemplo completo (con simulaciones previas):**
```bash
# Primero simular 15 tiradas
for i in {1..15}; do
  curl -X POST http://localhost:5000/simulate \
    -H "Content-Type: application/json" \
    -d '{"game": "ruleta", "table": "table_1"}' \
    -s > /dev/null
  echo "Tirada $i completada"
done

# Luego obtener predicción
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"game": "ruleta", "table": "table_1"}'
```

**Respuesta:**
```json
{
  "prediccion": {
    "juego": "ruleta",
    "numero_predicho": 23,
    "confianza_prediccion": 8.5,
    "probabilidades_color": {
      "rojo": 51.2,
      "negro": 46.3,
      "verde": 2.5
    },
    "numeros_calientes": [
      {"numero": 23, "frecuencia": 3},
      {"numero": 17, "frecuencia": 2}
    ],
    "recomendacion": "Los rojos están calientes (51.2%). Considera apostar a rojo."
  }
}
```

---

#### 5. Chat con IA
```bash
POST /chat
Content-Type: application/json

{
  "message": "¿Cuál es la mejor estrategia para blackjack?"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuál es la mejor estrategia para blackjack?"}'
```

**Respuesta:**
```json
{
  "response": "La mejor estrategia para blackjack es la 'estrategia básica'...",
  "contexto_detectado": true,
  "juego_detectado": "blackjack"
}
```

---

#### 6. Estadísticas Generales
```bash
GET /stats
```

**Ejemplo:**
```bash
curl http://localhost:5000/stats
```

---

## 📁 Estructura del Proyecto

```
casino_predictor/
│
├── README.md                    # Este archivo
├── requirements.txt             # Dependencias de Python
├── .gitignore                   # Archivos a ignorar en Git
│
├── main.py                      # CLI principal
├── app.py                       # API REST Flask
│
├── core/                        # Núcleo del sistema
│   ├── __init__.py
│   └── predictor_casino.py      # Motor de predicción estadística
│
├── api/                         # Simulador y lógica de juegos
│   ├── __init__.py
│   └── simulador.py             # Simulador de casino
│
├── chatbot/                     # IA conversacional
│   ├── __init__.py
│   └── ollama_chat.py           # Chatbot con Ollama
│
├── utils/                       # Utilidades
│   ├── __init__.py
│   └── helpers.py               # Funciones auxiliares
│
└── data/                        # Datos (vacío por defecto)
    └── .gitkeep
```

---

## 🎮 Ejemplos de Uso

### Ejemplo 1: Análisis de Ruleta

```python
from core.predictor_casino import PredictorCasino
from api.simulador import SimuladorCasino

# Inicializar componentes
predictor = PredictorCasino()
simulador = SimuladorCasino()

# Simular 20 tiradas
historial = []
for _ in range(20):
    resultado = simulador.simular_tirada_ruleta('table_1')
    historial.append(resultado['numero'])
    print(f"Salió: {resultado['numero']} ({resultado['color']})")

# Obtener predicción
prediccion = predictor.predecir_ruleta(historial)
print(f"\nNúmero predicho: {prediccion['numero_predicho']}")
print(f"Probabilidad rojo: {prediccion['probabilidades_color']['rojo']}%")
```

### Ejemplo 2: Conteo en Blackjack

```python
# Simular 15 manos
cartas_vistas = []
for _ in range(15):
    mano = simulador.simular_mano_blackjack('table_1')
    cartas_vistas.extend(mano['cartas_visibles'])
    print(f"Tu mano: {mano['valor_jugador']}, Dealer: {mano['valor_dealer_visible']}")

# Analizar conteo
prediccion = predictor.predecir_blackjack(cartas_vistas)
print(f"\nTrue Count: {prediccion['true_count']}")
print(f"Ventaja del jugador: {prediccion['ventaja_jugador']}%")
print(f"Recomendación: {prediccion['recomendacion']}")
```

### Ejemplo 3: Chat con IA

```python
from chatbot.ollama_chat import ChatbotOllama

chatbot = ChatbotOllama()

# Verificar conexión
ok, mensaje = chatbot.verificar_conexion()
print(mensaje)

if ok:
    respuesta = chatbot.generar_respuesta(
        "¿Qué es el conteo de cartas en blackjack?"
    )
    print(respuesta)
```

---

## 🧪 Testing

### Tests Básicos

```bash
# Test 1: Verificar imports
python -c "from core.predictor_casino import PredictorCasino; print('✅ Core OK')"

# Test 2: Verificar simulador
python -c "from api.simulador import SimuladorCasino; s = SimuladorCasino(); print('✅ Simulador OK')"

# Test 3: Simular ruleta
python -c "from api.simulador import SimuladorCasino; s = SimuladorCasino(); print(s.simular_tirada_ruleta())"

# Test 4: Verificar API
curl http://localhost:5000/health
```

### Script de Prueba Completo

```bash
# Crear archivo test.sh
cat > test.sh << 'EOF'
#!/bin/bash
echo "🧪 Ejecutando tests..."

echo "1. Test de imports..."
python -c "from core.predictor_casino import PredictorCasino" && echo "✅ Core OK" || echo "❌ Core FAIL"

echo "2. Test de simulador..."
python -c "from api.simulador import SimuladorCasino; s = SimuladorCasino(); s.simular_tirada_ruleta()" && echo "✅ Simulador OK" || echo "❌ Simulador FAIL"

echo "3. Test de API (debe estar corriendo)..."
curl -s http://localhost:5000/health > /dev/null && echo "✅ API OK" || echo "❌ API no está corriendo"

echo "✅ Tests completados"
EOF

chmod +x test.sh
./test.sh
```

---

