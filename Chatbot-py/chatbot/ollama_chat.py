"""
OLLAMA_CHAT.PY
Chatbot inteligente usando Ollama para análisis de juegos de casino
Adaptado del chatbot_llm.py original
"""

import requests
import json


class ChatbotOllama:
    """
    Chatbot especializado en análisis de juegos de casino usando Ollama/Llama.
    Proporciona explicaciones, estrategias y análisis de probabilidades.
    """
    
    def __init__(self, model="gemma3:4b", url="http://localhost:11434/api/generate"):
        self.model = model
        self.url = url
        self.system_prompt = self._crear_system_prompt()
        
    
    def _crear_system_prompt(self):
        """Define el contexto y comportamiento del chatbot"""
        return """Eres un experto analista de juegos de casino y probabilidades.
Tu trabajo es ayudar a los usuarios a entender estrategias, probabilidades y análisis estadístico de juegos de casino.

Conocimientos clave:
- Probabilidades matemáticas en ruleta, blackjack, póker y jackpots
- Estrategias óptimas basadas en matemáticas
- Análisis de riesgo y gestión de bankroll
- Sistemas de conteo y ventajas estadísticas
- Conceptos de esperanza matemática y varianza

⚠️ IMPORTANTE:
- Este es un sistema EDUCATIVO y de SIMULACIÓN
- NO promuevas el juego compulsivo
- SIEMPRE menciona que la casa tiene ventaja matemática
- Enfócate en el análisis matemático y estadístico

Reglas:
1. Responde siempre en español de forma clara y educativa
2. Basa tus respuestas en probabilidades matemáticas reales
3. Si no tienes datos específicos, usa probabilidades teóricas conocidas
4. Sé objetivo y honesto sobre las ventajas de la casa
5. Usa un tono profesional pero accesible
6. Incluye advertencias sobre juego responsable cuando sea relevante"""

    def generar_respuesta(self, pregunta, contexto_prediccion=None, historial=None):
        """
        Genera respuesta inteligente basada en la pregunta y contexto.
        
        Args:
            pregunta: Pregunta del usuario
            contexto_prediccion: Dict con datos de predicción (opcional)
            historial: Lista de mensajes previos para contexto (opcional)
        
        Returns:
            str: Respuesta generada por el modelo
        """
        prompt_completo = self._construir_prompt(pregunta, contexto_prediccion, historial)
        
        payload = {
            "model": self.model,
            "prompt": prompt_completo,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 400,
                "num_predict": 400
            }
        }
        
        try:
            response = requests.post(self.url, json=payload, timeout=60)
            
            if response.status_code == 200:
                respuesta = response.json()['response'].strip()
                return self._limpiar_respuesta(respuesta)
            else:
                return f"⚠️ Error al conectar con Ollama (código {response.status_code}). ¿Está corriendo 'ollama serve'?"
                
        except requests.exceptions.ConnectionError:
            return "⚠️ No se pudo conectar con Ollama. Asegúrate de que esté corriendo:\n   Abre una terminal y ejecuta: ollama serve"
        except requests.exceptions.Timeout:
            return "⏱️ El modelo está tardando mucho. Intenta con una pregunta más simple."
        except Exception as e:
            return f"❌ Error inesperado: {str(e)}"
    
    def _construir_prompt(self, pregunta, contexto_prediccion, historial):
        """Construye el prompt completo con todo el contexto necesario"""
        
        partes = [self.system_prompt, "\n---\n"]
        
        # Agregar datos de predicción si existen
        if contexto_prediccion:
            partes.append("DATOS DE LA PREDICCIÓN:\n")
            juego = contexto_prediccion.get('juego', 'desconocido')
            partes.append(f"Juego: {juego}\n")
            
            if juego == 'ruleta':
                partes.append(f"Número predicho: {contexto_prediccion.get('numero_predicho', 'N/A')}\n")
                partes.append(f"Confianza: {contexto_prediccion.get('confianza_prediccion', 0)}%\n")
                probs = contexto_prediccion.get('probabilidades_color', {})
                partes.append(f"Probabilidades - Rojo: {probs.get('rojo', 0)}%, Negro: {probs.get('negro', 0)}%, Verde: {probs.get('verde', 0)}%\n")
                
            elif juego == 'blackjack':
                partes.append(f"Probabilidad de ganar: {contexto_prediccion.get('probabilidad_ganar', 0)}%\n")
                partes.append(f"True Count: {contexto_prediccion.get('true_count', 0)}\n")
                partes.append(f"Ventaja del jugador: {contexto_prediccion.get('ventaja_jugador', 0)}%\n")
                
            elif juego == 'poker':
                partes.append(f"Fuerza de mano: {contexto_prediccion.get('fuerza_mano', 'N/A')}\n")
                partes.append(f"Probabilidad de mejorar: {contexto_prediccion.get('probabilidad_mejorar', 0)}%\n")
                partes.append(f"Fase: {contexto_prediccion.get('fase', 'N/A')}\n")
                
            elif juego == 'jackpot':
                rango = contexto_prediccion.get('rango_predicho', {})
                partes.append(f"Rango predicho: ${rango.get('minimo', 0):,.2f} - ${rango.get('maximo', 0):,.2f}\n")
                partes.append(f"Tendencia: {contexto_prediccion.get('tendencia', 'N/A')}\n")
            
            partes.append("\n")
        
        # Agregar historial de conversación reciente
        if historial and len(historial) > 0:
            partes.append("CONTEXTO DE LA CONVERSACIÓN:\n")
            for msg in historial[-6:]:
                partes.append(f"{msg['rol']}: {msg['contenido']}\n")
            partes.append("\n")
        
        # Pregunta actual
        partes.append(f"PREGUNTA DEL USUARIO:\n{pregunta}\n\n")
        partes.append("RESPUESTA (en español, máximo 3 párrafos):")
        
        return "".join(partes)
    
    def _limpiar_respuesta(self, respuesta):
        """Limpia y formatea la respuesta del modelo"""
        if "RESPUESTA:" in respuesta:
            respuesta = respuesta.split("RESPUESTA:")[-1].strip()
        
        lineas = [linea.strip() for linea in respuesta.split("\n") if linea.strip()]
        return "\n\n".join(lineas)
    
    def verificar_conexion(self):
        """Verifica que Ollama esté corriendo y el modelo disponible"""
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=5)
            if response.status_code == 200:
                modelos = [m['name'] for m in response.json()['models']]
                if self.model in modelos:
                    return True, f"✅ Modelo {self.model} está listo"
                else:
                    return False, f"⚠️ Modelo {self.model} no encontrado. Descárgalo con: ollama pull {self.model}"
            return False, "⚠️ Ollama está corriendo pero no responde correctamente"
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout, Exception) as e:
            return False, "❌ Ollama no está corriendo. Ejecuta: ollama serve"


# Ejemplo de uso
if __name__ == "__main__":
    chatbot = ChatbotOllama()
    
    # Verificar conexión
    ok, mensaje = chatbot.verificar_conexion()
    print(mensaje)
    
    if ok:
        # Ejemplo 1: Pregunta general
        print("\n--- Pregunta general ---")
        respuesta = chatbot.generar_respuesta("¿Cuál es la ventaja de la casa en ruleta europea?")
        print(respuesta)
        
        # Ejemplo 2: Pregunta con contexto de predicción
        print("\n--- Pregunta con contexto ---")
        datos_ruleta = {
            'juego': 'ruleta',
            'numero_predicho': 17,
            'confianza_prediccion': 5.2,
            'probabilidades_color': {'rojo': 52.0, 'negro': 45.5, 'verde': 2.5},
            'numeros_calientes': [{'numero': 17, 'frecuencia': 8}]
        }
        respuesta = chatbot.generar_respuesta(
            "¿Es buena idea apostar al 17?",
            contexto_prediccion=datos_ruleta
        )
        print(respuesta)