"""
APP.PY - Backend Flask para API REST
Conecta la interfaz con el predictor de casino
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from core.predictor_casino import PredictorCasino
from api.simulador import SimuladorCasino
from chatbot.ollama_chat import ChatbotOllama
from utils.helpers import validar_juego, log_evento
import os

app = Flask(__name__)
# Restringir CORS solo al frontend local
CORS(app, origins=[
    "http://localhost:5173",      # Vite dev server (default)
    "http://localhost:3000",      # Si usa otro puerto
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
])

# Inicializar componentes globalmente
predictor = None
simulador = None
chatbot = None
historial_chat = []

def init_sistema():
    """Inicializa todos los componentes al arrancar el servidor"""
    global predictor, simulador, chatbot
    
    try:
        predictor = PredictorCasino(ventana_historica=100)
        simulador = SimuladorCasino()
        chatbot = ChatbotOllama()
        
        print("✅ Predictor inicializado")
        print("✅ Simulador inicializado")
        
        mesas_ruleta = simulador.obtener_mesas_disponibles('ruleta')
        print(f"📍 Mesas de ruleta: {len(mesas_ruleta)}")
        
        return True
    except Exception as e:
        print(f"❌ Error inicializando sistema: {e}")
        return False


@app.route('/')
def index():
    """Endpoint raíz - información de la API"""
    return jsonify({
        'nombre': 'Casino Predictor API',
        'version': '1.0.0',
        'advertencia': 'Sistema educativo - NO usar para apuestas reales',
        'endpoints': {
            'health': '/health',
            'games': '/games',
            'tables': '/tables/<juego>',
            'simulate': '/simulate',
            'predict': '/predict',
            'chat': '/chat',
            'stats': '/stats'
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Endpoint para verificar estado del servidor"""
    ollama_ok = False
    if chatbot:
        ollama_ok, _ = chatbot.verificar_conexion()
    
    return jsonify({
        'status': 'ok',
        'predictor_loaded': predictor is not None,
        'simulador_loaded': simulador is not None,
        'ollama_available': ollama_ok,
        'mesas_activas': {
            'ruleta': len(simulador.obtener_mesas_disponibles('ruleta')) if simulador else 0,
            'blackjack': len(simulador.obtener_mesas_disponibles('blackjack')) if simulador else 0,
            'poker': len(simulador.obtener_mesas_disponibles('poker')) if simulador else 0
        }
    })


@app.route('/games', methods=['GET'])
def get_games():
    """Obtiene lista de juegos disponibles"""
    juegos = [
        {
            'id': 'ruleta',
            'nombre': 'Ruleta Europea',
            'descripcion': 'Predicción de números y colores basada en historial',
            'emoji': '🎡'
        },
        {
            'id': 'blackjack',
            'nombre': 'Blackjack',
            'descripcion': 'Análisis con conteo de cartas y probabilidades',
            'emoji': '🃏'
        },
        {
            'id': 'poker',
            'nombre': 'Póker Texas Hold\'em',
            'descripcion': 'Evaluación de manos y probabilidades de mejorar',
            'emoji': '🎴'
        },
        {
            'id': 'jackpot',
            'nombre': 'Jackpot Progresivo',
            'descripcion': 'Predicción de rangos de premio',
            'emoji': '💰'
        }
    ]
    
    return jsonify({'juegos': juegos})


@app.route('/tables/<juego>', methods=['GET'])
def get_tables(juego):
    """Obtiene mesas disponibles para un juego"""
    if not simulador:
        return jsonify({'error': 'Simulador no inicializado'}), 500
    
    if not validar_juego(juego):
        return jsonify({'error': f'Juego inválido: {juego}'}), 400
    
    mesas = simulador.obtener_mesas_disponibles(juego)
    
    return jsonify({
        'juego': juego,
        'mesas': mesas,
        'total': len(mesas)
    })


@app.route('/simulate', methods=['POST'])
def simulate():
    """Simula una jugada en un juego específico"""
    if not simulador:
        return jsonify({'error': 'Simulador no inicializado'}), 500
    
    data = request.json or {}
    juego = data.get('game', '').strip().lower()
    mesa = data.get('table', 'table_1').strip()
    
    if not validar_juego(juego):
        return jsonify({'error': f'Juego inválido: {juego}'}), 400
    
    try:
        if juego == 'ruleta':
            resultado = simulador.simular_tirada_ruleta(mesa)
        elif juego == 'blackjack':
            resultado = simulador.simular_mano_blackjack(mesa)
        elif juego == 'poker':
            resultado = simulador.simular_mano_poker(mesa)
        elif juego == 'jackpot':
            resultado = simulador.simular_jackpot(data.get('jackpot_id', 'progressive_1'))
        else:
            return jsonify({'error': 'Juego no implementado'}), 400
        
        log_evento('simulacion', {'juego': juego, 'mesa': mesa}, verbose=False)
        
        return jsonify({'resultado': resultado})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    """Obtiene predicción para un juego específico"""
    if not predictor or not simulador:
        return jsonify({'error': 'Sistema no inicializado'}), 500
    
    data = request.json or {}
    juego = data.get('game', '').strip().lower()
    mesa = data.get('table', 'table_1').strip()
    
    if not validar_juego(juego):
        return jsonify({'error': f'Juego inválido: {juego}'}), 400
    
    try:
        if juego == 'ruleta':
            historial = simulador.obtener_historial_ruleta(mesa, 100)
            if len(historial) < 10:
                return jsonify({
                    'error': 'Historial insuficiente',
                    'mensaje': 'Se necesitan al menos 10 tiradas para predicción'
                }), 400
            
            prediccion = predictor.predecir_ruleta(historial)
            
        elif juego == 'blackjack':
            cartas_visibles = simulador.obtener_cartas_visibles_blackjack(mesa)
            if len(cartas_visibles) < 10:
                return jsonify({
                    'error': 'Cartas insuficientes',
                    'mensaje': 'Se necesitan al menos 10 cartas vistas para predicción'
                }), 400
            
            prediccion = predictor.predecir_blackjack(cartas_visibles)
            
        elif juego == 'poker':
            # Simular mano para obtener datos
            mano_data = simulador.simular_mano_poker(mesa)
            prediccion = predictor.predecir_poker(
                mano_data['mano_jugador'],
                mano_data['cartas_comunitarias']
            )
            prediccion['mano_simulada'] = mano_data
            
        elif juego == 'jackpot':
            estado = simulador.simular_jackpot(data.get('jackpot_id', 'progressive_1'))
            prediccion = predictor.predecir_jackpot(estado['historial_premios'])
            
        else:
            return jsonify({'error': 'Juego no implementado'}), 400
        
        log_evento('prediccion', {'juego': juego, 'mesa': mesa}, verbose=False)
        
        return jsonify({'prediccion': prediccion})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint principal para el chat con IA"""
    global historial_chat
    
    if not chatbot:
        return jsonify({
            'error': 'Chatbot no inicializado',
            'response': '❌ El chatbot no está disponible'
        }), 500
    
    data = request.json or {}
    message = data.get('message', '').strip()
    
    if not message:
        return jsonify({'error': 'Mensaje vacío'}), 400
    
    try:
        # Detectar si pregunta por un juego específico con contexto
        contexto_prediccion = None
        
        # Palabras clave por juego
        palabras_ruleta = ['ruleta', 'numero', 'rojo', 'negro', 'color']
        palabras_blackjack = ['blackjack', 'carta', 'conteo', 'mazo']
        palabras_poker = ['poker', 'mano', 'texas']
        palabras_jackpot = ['jackpot', 'premio', 'progresivo']
        
        message_lower = message.lower()
        
        # Intentar inferir contexto si menciona un juego
        if any(p in message_lower for p in palabras_ruleta):
            if simulador:
                historial = simulador.obtener_historial_ruleta('table_1', 50)
                if len(historial) >= 10:
                    contexto_prediccion = predictor.predecir_ruleta(historial)
        
        elif any(p in message_lower for p in palabras_blackjack):
            if simulador:
                cartas = simulador.obtener_cartas_visibles_blackjack('table_1')
                if len(cartas) >= 10:
                    contexto_prediccion = predictor.predecir_blackjack(cartas)
        
        # Generar respuesta con el chatbot
        response = chatbot.generar_respuesta(
            message,
            contexto_prediccion=contexto_prediccion,
            historial=historial_chat
        )
        
        # Actualizar historial
        historial_chat.append({'rol': 'Usuario', 'contenido': message})
        historial_chat.append({'rol': 'Asistente', 'contenido': response})
        
        # Mantener historial limitado
        if len(historial_chat) > 10:
            historial_chat = historial_chat[-10:]
        
        return jsonify({
            'response': response,
            'contexto_detectado': contexto_prediccion is not None,
            'juego_detectado': contexto_prediccion.get('juego') if (contexto_prediccion and isinstance(contexto_prediccion, dict)) else None
        })
        
    except Exception as e:
        print(f"Error en /chat: {e}")
        return jsonify({
            'error': str(e),
            'response': f'⚠️ Ocurrió un error al procesar tu pregunta: {str(e)}'
        }), 500


@app.route('/stats', methods=['GET'])
def get_stats():
    """Estadísticas generales del sistema"""
    if not simulador:
        return jsonify({'error': 'Simulador no inicializado'}), 500
    
    stats = {
        'juegos_disponibles': 4,
        'mesas_por_juego': {}
    }
    
    for juego in ['ruleta', 'blackjack', 'poker', 'jackpot']:
        mesas = simulador.obtener_mesas_disponibles(juego)
        stats['mesas_por_juego'][juego] = {
            'total_mesas': len(mesas),
            'mesas': mesas
        }
        
        # Agregar estadísticas específicas por juego
        if juego == 'ruleta' and mesas:
            mesa_stats = simulador.obtener_estadisticas_mesa(juego, mesas[0])
            stats['mesas_por_juego'][juego]['ejemplo_stats'] = mesa_stats
    
    return jsonify({'estadisticas': stats})


@app.route('/reset/<juego>/<mesa>', methods=['POST'])
def reset_table(juego, mesa):
    """Reinicia una mesa específica"""
    if not simulador:
        return jsonify({'error': 'Simulador no inicializado'}), 500
    
    if not validar_juego(juego):
        return jsonify({'error': f'Juego inválido: {juego}'}), 400
    
    mesas_disponibles = simulador.obtener_mesas_disponibles(juego)
    if mesa not in mesas_disponibles:
        return jsonify({'error': f'Mesa inválida: {mesa}'}), 404
    
    try:
        simulador.reiniciar_mesa(juego, mesa)
        return jsonify({
            'success': True,
            'mensaje': f'Mesa {mesa} de {juego} reiniciada'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 INICIANDO SERVIDOR BACKEND FLASK - CASINO PREDICTOR")
    print("="*60)
    print("⚠️  ADVERTENCIA: Sistema educativo - NO usar para apuestas reales")
    print("="*60)
    
    # Inicializar sistema
    if not init_sistema():
        print("\n⚠️ ADVERTENCIA: El servidor arrancará pero sin funcionalidad completa")
    
    # Verificar Ollama
    if chatbot:
        ok, mensaje = chatbot.verificar_conexion()
        print(f"\n{mensaje}")
        if not ok:
            print("\n💡 Para habilitar el chat con IA:")
            print("   1. Abre otra terminal")
            print("   2. Ejecuta: ollama serve")
            print("   3. Descarga el modelo: ollama pull llama3.2:3b")
    
    print("\n" + "="*60)
    print("✅ SERVIDOR BACKEND LISTO")
    print("="*60)
    print("🌐 Backend corriendo en: http://localhost:5000")
    print("📡 Endpoints disponibles:")
    print("   • GET  /              - Info de la API")
    print("   • GET  /health        - Estado del servidor")
    print("   • GET  /games         - Lista de juegos")
    print("   • GET  /tables/<game> - Mesas de un juego")
    print("   • POST /simulate      - Simular jugada")
    print("   • POST /predict       - Obtener predicción")
    print("   • POST /chat          - Chat con IA")
    print("   • GET  /stats         - Estadísticas")
    print("\n📝 Para detener el servidor: Ctrl+C")
    print("="*60 + "\n")
    
    # Iniciar servidor
    app.run(debug=True, host='0.0.0.0', port=5000)