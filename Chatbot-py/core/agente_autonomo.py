"""
AGENTE_AUTONOMO.PY
Agente de IA que opera de forma autónoma
"""

import time
from typing import Dict, List
from core.predictor_casino import PredictorCasino
from api.simulador import SimuladorCasino
from chatbot import get_chatbot


class AgenteAutonomo:
    """
    Agente de IA autónomo que:
    - Simula juegos continuamente
    - Analiza patrones automáticamente
    - Ajusta estrategias dinámicamente
    - Reporta hallazgos sin ser solicitado
    """
    
    def __init__(self):
        self.predictor = PredictorCasino()
        self.simulador = SimuladorCasino()
        self.chatbot = get_chatbot()
        
        # Objetivos del agente
        self.objetivo_principal = "maximizar_precision_predicciones"
        self.sub_objetivos = [
            "identificar_patrones_emergentes",
            "optimizar_ventana_historica",
            "detectar_anomalias"
        ]
        
        # Estado interno
        self.experimentos_realizados = 0
        self.patrones_detectados = []
        self.mejores_estrategias = {}
        self.activo = False
        self.estadisticas = {
            'total_simulaciones': 0,
            'hallazgos_relevantes': 0,
            'precision_promedio': 0.0
        }
    
    def iniciar_bucle_autonomo(self, duracion_segundos=300):
        """
        Inicia el bucle de control autónomo del agente
        
        Args:
            duracion_segundos: Duración del experimento
        """
        self.activo = True
        tiempo_inicio = time.time()
        
        print("\n" + "="*60)
        print("🤖 AGENTE AUTÓNOMO ACTIVADO")
        print("="*60)
        print(f"⏱️  Duración: {duracion_segundos} segundos ({duracion_segundos//60} minutos)")
        print(f"🎯 Objetivo: {self.objetivo_principal}")
        print(f"📊 Sub-objetivos: {len(self.sub_objetivos)}")
        print("="*60 + "\n")
        
        try:
            while self.activo and (time.time() - tiempo_inicio) < duracion_segundos:
                # CICLO DEL AGENTE: Percibir → Analizar → Decidir → Actuar
                
                # 1. PERCIBIR
                estado_entorno = self._percibir_entorno()
                
                # 2. ANALIZAR
                oportunidades = self._analizar_situacion(estado_entorno)
                
                # 3. DECIDIR
                accion = self._decidir_accion(oportunidades)
                
                # 4. ACTUAR
                resultado = self._ejecutar_accion(accion)
                
                # 5. APRENDER
                self._actualizar_conocimiento(resultado)
                
                # 6. REPORTAR (si encuentra algo interesante)
                if resultado.get('relevante', False):
                    self._reportar_hallazgo(resultado)
                
                # Mostrar progreso cada 10 experimentos
                if self.experimentos_realizados % 10 == 0:
                    self._mostrar_progreso(tiempo_inicio, duracion_segundos)
                
                # Pausa entre ciclos
                time.sleep(2)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Agente interrumpido por el usuario")
        
        self.detener()
    
    def _percibir_entorno(self) -> Dict:
        """Percibe el estado actual del entorno"""
        return {
            'mesas_activas': len(self.simulador.obtener_mesas_disponibles('ruleta')),
            'experimentos_totales': self.experimentos_realizados,
            'patrones_conocidos': len(self.patrones_detectados),
            'tiempo_actual': time.time()
        }
    
    def _analizar_situacion(self, estado: Dict) -> List[Dict]:
        """Analiza la situación y detecta oportunidades"""
        oportunidades = []
        
        # Oportunidad 1: Explorar ruleta
        if estado['experimentos_totales'] < 100:
            oportunidades.append({
                'tipo': 'explorar_ruleta',
                'prioridad': 3,
                'razon': 'Recolectar más datos'
            })
        
        # Oportunidad 2: Explorar blackjack
        if estado['experimentos_totales'] % 3 == 0:
            oportunidades.append({
                'tipo': 'explorar_blackjack',
                'prioridad': 2,
                'razon': 'Validar conteo de cartas'
            })
        
        # Oportunidad 3: Analizar jackpot
        if estado['experimentos_totales'] % 5 == 0:
            oportunidades.append({
                'tipo': 'analizar_jackpot',
                'prioridad': 1,
                'razon': 'Monitorear tendencias'
            })
        
        return oportunidades
    
    def _decidir_accion(self, oportunidades: List[Dict]) -> Dict:
        """Decide qué acción tomar basado en oportunidades"""
        if not oportunidades:
            return {'tipo': 'explorar_ruleta', 'razon': 'Acción por defecto'}
        
        # Elegir oportunidad de mayor prioridad
        mejor_oportunidad = max(oportunidades, key=lambda x: x['prioridad'])
        return mejor_oportunidad
    
    def _ejecutar_accion(self, accion: Dict) -> Dict:
        """Ejecuta la acción decidida"""
        tipo_accion = accion.get('tipo')
        
        if tipo_accion == 'explorar_ruleta':
            return self._experimento_ruleta()
        
        elif tipo_accion == 'explorar_blackjack':
            return self._experimento_blackjack()
        
        elif tipo_accion == 'analizar_jackpot':
            return self._experimento_jackpot()
        
        else:
            return self._experimento_ruleta()
    
    def _experimento_ruleta(self) -> Dict:
        """Experimento: Analizar patrones en ruleta"""
        # Simular 20 tiradas
        historial = []
        for _ in range(20):
            resultado = self.simulador.simular_tirada_ruleta('table_1')
            historial.append(resultado['numero'])
        
        # Analizar
        prediccion = self.predictor.predecir_ruleta(historial)
        
        # Evaluar relevancia
        confianza = prediccion['confianza_prediccion']
        relevante = confianza > 10
        
        if relevante:
            patron = {
                'tipo': 'ruleta_alta_confianza',
                'confianza': confianza,
                'numero_predicho': prediccion['numero_predicho'],
                'numeros_calientes': prediccion['numeros_calientes'][:3]
            }
            self.patrones_detectados.append(patron)
        
        self.experimentos_realizados += 1
        self.estadisticas['total_simulaciones'] += 20
        
        if relevante:
            self.estadisticas['hallazgos_relevantes'] += 1
        
        return {
            'tipo': 'ruleta',
            'exito': True,
            'relevante': relevante,
            'prediccion': prediccion,
            'confianza': confianza
        }
    
    def _experimento_blackjack(self) -> Dict:
        """Experimento: Validar conteo en blackjack"""
        # Simular 15 manos
        cartas_vistas = []
        for _ in range(15):
            mano = self.simulador.simular_mano_blackjack('table_1')
            cartas_vistas.extend(mano['cartas_visibles'])
        
        # Analizar
        prediccion = self.predictor.predecir_blackjack(cartas_vistas)
        
        # Evaluar
        true_count = prediccion['true_count']
        relevante = abs(true_count) > 2
        
        if relevante:
            patron = {
                'tipo': 'blackjack_momento_favorable',
                'true_count': true_count,
                'ventaja_jugador': prediccion['ventaja_jugador']
            }
            self.patrones_detectados.append(patron)
        
        self.experimentos_realizados += 1
        self.estadisticas['total_simulaciones'] += 15
        
        if relevante:
            self.estadisticas['hallazgos_relevantes'] += 1
        
        return {
            'tipo': 'blackjack',
            'exito': True,
            'relevante': relevante,
            'prediccion': prediccion,
            'true_count': true_count
        }
    
    def _experimento_jackpot(self) -> Dict:
        """Experimento: Monitorear tendencia de jackpot"""
        estado = self.simulador.simular_jackpot()
        prediccion = self.predictor.predecir_jackpot(estado['historial_premios'])
        
        tendencia = prediccion['tendencia']
        relevante = tendencia != 'estable'
        
        if relevante:
            patron = {
                'tipo': 'jackpot_tendencia',
                'tendencia': tendencia,
                'rango': prediccion['rango_predicho']
            }
            self.patrones_detectados.append(patron)
        
        self.experimentos_realizados += 1
        
        if relevante:
            self.estadisticas['hallazgos_relevantes'] += 1
        
        return {
            'tipo': 'jackpot',
            'exito': True,
            'relevante': relevante,
            'prediccion': prediccion,
            'tendencia': tendencia
        }
    
    def _actualizar_conocimiento(self, resultado: Dict):
        """Actualiza la base de conocimiento del agente"""
        if resultado.get('exito'):
            # Calcular precisión promedio
            if self.experimentos_realizados > 0:
                self.estadisticas['precision_promedio'] = (
                    self.estadisticas['hallazgos_relevantes'] / 
                    self.experimentos_realizados * 100
                )
    
    def _reportar_hallazgo(self, resultado: Dict):
        """Reporta hallazgos interesantes"""
        print("\n" + "🔔 " + "="*58)
        print("   ¡HALLAZGO INTERESANTE!")
        print("="*60)
        
        tipo = resultado.get('tipo', 'desconocido')
        prediccion = resultado.get('prediccion', {})
        
        if tipo == 'ruleta':
            print(f"🎡 RULETA:")
            print(f"   Confianza: {resultado.get('confianza', 0):.1f}%")
            print(f"   Número predicho: {prediccion.get('numero_predicho', 'N/A')}")
            print(f"   Números calientes: {prediccion.get('numeros_calientes', [])[:3]}")
        
        elif tipo == 'blackjack':
            print(f"🃏 BLACKJACK:")
            print(f"   True Count: {resultado.get('true_count', 0):.1f}")
            print(f"   Ventaja: {prediccion.get('ventaja_jugador', 0):.1f}%")
            print(f"   Recomendación: {prediccion.get('recomendacion', 'N/A')}")
        
        elif tipo == 'jackpot':
            print(f"💰 JACKPOT:")
            print(f"   Tendencia: {resultado.get('tendencia', 'N/A').upper()}")
            rango = prediccion.get('rango_predicho', {})
            print(f"   Rango: ${rango.get('minimo', 0):,.0f} - ${rango.get('maximo', 0):,.0f}")
        
        print("="*60 + "\n")
    
    def _mostrar_progreso(self, tiempo_inicio: float, duracion_total: float):
        """Muestra progreso del agente"""
        tiempo_transcurrido = time.time() - tiempo_inicio
        porcentaje = (tiempo_transcurrido / duracion_total) * 100
        
        print(f"\n📊 Progreso: {porcentaje:.1f}% | Experimentos: {self.experimentos_realizados} | Hallazgos: {self.estadisticas['hallazgos_relevantes']}")
    
    def detener(self):
        """Detiene el agente y muestra resumen"""
        self.activo = False
        print("\n" + "="*60)
        print("🛑 AGENTE DETENIDO")
        print("="*60)
        print(f"📊 Experimentos realizados: {self.experimentos_realizados}")
        print(f"🔬 Simulaciones totales: {self.estadisticas['total_simulaciones']}")
        print(f"✨ Hallazgos relevantes: {self.estadisticas['hallazgos_relevantes']}")
        print(f"📈 Precisión: {self.estadisticas['precision_promedio']:.1f}%")
        print(f"🧠 Patrones detectados: {len(self.patrones_detectados)}")
        print("="*60 + "\n")
        
        # Mostrar mejores patrones
        if self.patrones_detectados:
            print("🏆 MEJORES PATRONES DETECTADOS:")
            for i, patron in enumerate(self.patrones_detectados[-5:], 1):
                print(f"   {i}. {patron['tipo']}: {patron}")
            print()
    
    def obtener_informe(self) -> Dict:
        """Genera informe completo del agente"""
        return {
            'experimentos': self.experimentos_realizados,
            'estadisticas': self.estadisticas,
            'patrones': self.patrones_detectados,
            'objetivo_alcanzado': self.experimentos_realizados >= 50
        }


# Ejemplo de uso
if __name__ == "__main__":
    print("🤖 Iniciando Agente Autónomo...")
    
    agente = AgenteAutonomo()
    agente.iniciar_bucle_autonomo(duracion_segundos=60)  # 1 minuto de prueba
    
    # Obtener informe
    informe = agente.obtener_informe()
    print(f"\n📋 Informe final: {informe}")