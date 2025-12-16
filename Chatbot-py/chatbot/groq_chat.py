"""
GROQ_CHAT.PY
Chatbot usando Groq API (GRATIS, RÁPIDO y SIN OLLAMA)
"""

from groq import Groq


class ChatbotGroq:
    """
    Chatbot usando Groq API - Súper rápido y gratuito
    No requiere Ollama, funciona con API en la nube
    """
    
    def __init__(self, api_key: str, model: str = "llama3-70b-8192"):
        self.client = Groq(api_key=api_key)
        self.model = model
        self.system_prompt = self._crear_system_prompt()
    
    def _crear_system_prompt(self):
        return """Eres un experto analista de juegos de casino y probabilidades.
Respondes SIEMPRE en español de forma clara, educativa y concisa.

⚠️ IMPORTANTE: Este es un sistema EDUCATIVO. NO promuevas juego compulsivo.

Conocimientos:
- Probabilidades matemáticas en ruleta, blackjack, póker, jackpots
- Estrategias óptimas basadas en matemáticas
- Análisis de riesgo y gestión de bankroll
- Conteo de cartas y ventajas estadísticas

Reglas:
1. Respuestas en español, máximo 3 párrafos
2. Basadas en probabilidades reales
3. Menciona que la casa tiene ventaja
4. Tono profesional pero accesible
5. Advertencias sobre juego responsable cuando sea relevante"""
    
    def generar_respuesta(self, pregunta, contexto_prediccion=None, historial=None):
        """Genera respuesta con Groq"""
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Agregar contexto si existe
        if contexto_prediccion:
            contexto_texto = self._formatear_contexto(contexto_prediccion)
            messages.append({"role": "system", "content": contexto_texto})
        
        # Agregar historial
        if historial:
            for msg in historial[-4:]:
                role = "user" if msg['rol'] == "Usuario" else "assistant"
                messages.append({"role": role, "content": msg['contenido'][:200]})
        
        # Agregar pregunta actual
        messages.append({"role": "user", "content": pregunta})
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=400,
                top_p=0.9
            )
            
            respuesta = completion.choices[0].message.content
            return respuesta.strip()
            
        except Exception as e:
            return f"⚠️ Error con Groq API: {str(e)}\nVerifica tu API key en config.py"
    
    def _formatear_contexto(self, contexto):
        """Formatea el contexto de predicción"""
        juego = contexto.get('juego', 'desconocido')
        texto = f"Datos del juego ({juego}):\n"
        
        for key, value in list(contexto.items())[:5]:
            if key != 'juego':
                texto += f"- {key}: {value}\n"
        
        return texto
    
    def verificar_conexion(self):
        """Verifica conexión con Groq"""
        try:
            # Test simple
            self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5
            )
            return True, "✅ Groq API conectada correctamente"
        except Exception as e:
            return False, f"❌ Error con Groq: {str(e)}"


# Ejemplo de uso
if __name__ == "__main__":
    # Reemplaza con tu API key real
    API_KEY = "gsk_tu_key_aqui"
    
    chatbot = ChatbotGroq(api_key=API_KEY)
    
    # Verificar
    ok, msg = chatbot.verificar_conexion()
    print(msg)
    
    if ok:
        resp = chatbot.generar_respuesta("¿Qué es el conteo de cartas?")
        print(f"\n{resp}")