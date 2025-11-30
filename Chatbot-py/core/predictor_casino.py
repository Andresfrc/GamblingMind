"""
PREDICTOR_CASINO.PY
Motor de predicción estadística para juegos de casino
Análisis basado en ventanas históricas y probabilidades condicionales
"""

import numpy as np
from collections import Counter, deque
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

# Constantes de ruleta europea
NUMEROS_ROJOS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
NUMEROS_NEGROS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]


class PredictorCasino:
    """
    Motor de predicción para juegos de casino usando análisis estadístico.
    No usa ML tradicional, sino análisis de frecuencias y patrones.
    """
    
    def __init__(self, ventana_historica: int = 100):
        """
        Args:
            ventana_historica: Cantidad de tiradas/manos a considerar para análisis
        """
        self.ventana_historica = ventana_historica
        self.historiales = {
            'ruleta': deque(maxlen=ventana_historica),
            'blackjack': deque(maxlen=ventana_historica),
            'poker': deque(maxlen=ventana_historica),
            'jackpot': deque(maxlen=ventana_historica)
        }
        
    def predecir_ruleta(self, historial: List[int]) -> Dict:
        """
        Predice siguiente número y color en ruleta europea (0-36)
        
        Args:
            historial: Lista de números recientes
            
        Returns:
            Dict con predicciones y probabilidades
        """
        if not historial:
            return self._prediccion_ruleta_vacia()
        
        # Actualizar historial interno
        for num in historial[-self.ventana_historica:]:
            self.historiales['ruleta'].append(num)
        
        # Análisis de frecuencias
        counter = Counter(self.historiales['ruleta'])
        total_tiradas = len(self.historiales['ruleta'])
        
        # Números calientes (más frecuentes)
        numeros_calientes = counter.most_common(5)
        
        # Números fríos (menos frecuentes)
        todos_numeros = set(range(37))
        numeros_en_historial = set(self.historiales['ruleta'])
        numeros_frios = list(todos_numeros - numeros_en_historial)[:5]
        
        # Análisis de colores
        count_rojo = sum(1 for n in self.historiales['ruleta'] if n in NUMEROS_ROJOS)
        count_negro = sum(1 for n in self.historiales['ruleta'] if n in NUMEROS_NEGROS)
        count_verde = sum(1 for n in self.historiales['ruleta'] if n == 0)
        
        prob_rojo = (count_rojo / total_tiradas * 100) if total_tiradas > 0 else 48.6
        prob_negro = (count_negro / total_tiradas * 100) if total_tiradas > 0 else 48.6
        prob_verde = (count_verde / total_tiradas * 100) if total_tiradas > 0 else 2.8
        
        # Análisis de secuencias
        secuencia_actual = self._analizar_secuencia_ruleta(list(self.historiales['ruleta']))
        
        # Predicción del próximo número (basado en frecuencias)
        if numeros_calientes:
            numero_predicho = numeros_calientes[0][0]
            confianza = min(numeros_calientes[0][1] / total_tiradas * 100, 95)
        else:
            numero_predicho = np.random.randint(0, 37)
            confianza = 2.7  # Probabilidad teórica 1/37
        
        return {
            'juego': 'ruleta',
            'numero_predicho': int(numero_predicho),
            'confianza_prediccion': round(confianza, 2),
            'probabilidades_color': {
                'rojo': round(prob_rojo, 2),
                'negro': round(prob_negro, 2),
                'verde': round(prob_verde, 2)
            },
            'numeros_calientes': [{'numero': n, 'frecuencia': f} for n, f in numeros_calientes],
            'numeros_frios': numeros_frios,
            'analisis_secuencia': secuencia_actual,
            'total_tiradas_analizadas': total_tiradas,
            'recomendacion': self._generar_recomendacion_ruleta(
                numero_predicho, prob_rojo, prob_negro, numeros_calientes
            )
        }
    
    def predecir_blackjack(self, cartas_visibles: List[str]) -> Dict:
        """
        Estima probabilidad de ganar en blackjack usando conteo simple
        
        Args:
            cartas_visibles: Lista de cartas vistas (ej: ['A', 'K', '5', '2'])
            
        Returns:
            Dict con probabilidades y recomendaciones
        """
        if not cartas_visibles:
            return self._prediccion_blackjack_vacia()
        
        # Sistema de conteo Hi-Lo simplificado
        conteo = 0
        cartas_altas = ['10', 'J', 'Q', 'K', 'A']
        cartas_bajas = ['2', '3', '4', '5', '6']
        
        for carta in cartas_visibles:
            # Extraer valor sin el palo (ej: "10♠" -> "10", "A♥" -> "A")
            valor = carta[:-1] if len(carta) > 1 else carta
            if valor in cartas_bajas:
                conteo += 1
            elif valor in cartas_altas:
                conteo -= 1
        
        # Calcular porcentaje de cartas vistas
        total_mazos = 6  # Asumimos 6 mazos
        total_cartas = total_mazos * 52
        cartas_vistas = len(cartas_visibles)
        porcentaje_usado = (cartas_vistas / total_cartas) * 100
        
        # Estimar ventaja del jugador
        true_count = conteo / max((total_cartas - cartas_vistas) / 52, 1)
        ventaja_jugador = true_count * 0.5  # Aproximación
        
        # Probabilidad base de ganar en blackjack: ~42-49% dependiendo de reglas
        prob_base = 46.0
        prob_ganar = prob_base + ventaja_jugador
        prob_ganar = max(0, min(100, prob_ganar))  # Limitar entre 0-100
        
        return {
            'juego': 'blackjack',
            'probabilidad_ganar': round(prob_ganar, 2),
            'conteo_actual': conteo,
            'true_count': round(true_count, 2),
            'ventaja_jugador': round(ventaja_jugador, 2),
            'cartas_vistas': cartas_vistas,
            'porcentaje_mazo_usado': round(porcentaje_usado, 2),
            'momento_favorable': true_count > 2,
            'recomendacion': self._generar_recomendacion_blackjack(
                true_count, prob_ganar, porcentaje_usado
            )
        }
    
    def predecir_poker(self, mano_actual: List[str], cartas_comunitarias: List[str]) -> Dict:
        """
        Analiza probabilidades en una mano de póker Texas Hold'em
        
        Args:
            mano_actual: 2 cartas del jugador (ej: ['As', 'Kd'])
            cartas_comunitarias: Cartas en la mesa (ej: ['2h', '5c', '9d'])
            
        Returns:
            Dict con análisis de la mano
        """
        # Evaluación simplificada de fuerza de mano
        fuerza_mano = self._evaluar_mano_poker(mano_actual, cartas_comunitarias)
        
        # Calcular outs aproximados
        fase = self._determinar_fase_poker(cartas_comunitarias)
        outs_estimados = self._calcular_outs_aproximados(mano_actual, cartas_comunitarias)
        
        # Probabilidad de mejorar
        cartas_restantes = 52 - len(mano_actual) - len(cartas_comunitarias)
        if fase == 'flop':
            prob_mejorar = (outs_estimados / cartas_restantes) * 100 * 2  # Regla del 4
        elif fase == 'turn':
            prob_mejorar = (outs_estimados / cartas_restantes) * 100 * 2  # Regla del 2
        else:
            prob_mejorar = 0
        
        return {
            'juego': 'poker',
            'fuerza_mano': fuerza_mano,
            'fase': fase,
            'outs_estimados': outs_estimados,
            'probabilidad_mejorar': round(min(prob_mejorar, 100), 2),
            'cartas_restantes': cartas_restantes,
            'recomendacion': self._generar_recomendacion_poker(
                fuerza_mano, prob_mejorar, fase
            )
        }
    
    def predecir_jackpot(self, historial_premios: List[float]) -> Dict:
        """
        Predice rango de próximo premio de jackpot
        
        Args:
            historial_premios: Lista de premios anteriores
            
        Returns:
            Dict con predicción de rango
        """
        if not historial_premios or len(historial_premios) < 3:
            return self._prediccion_jackpot_vacia()
        
        # Análisis estadístico básico (convertir a float nativo para JSON)
        promedio = float(np.mean(historial_premios))
        mediana = float(np.median(historial_premios))
        desviacion = float(np.std(historial_premios))
        minimo = float(np.min(historial_premios))
        maximo = float(np.max(historial_premios))
        
        # Predicción basada en tendencia
        tendencia = self._calcular_tendencia(historial_premios)
        
        # Rango predicho (intervalo de confianza simple)
        rango_inferior = max(0, promedio - desviacion)
        rango_superior = promedio + desviacion
        
        return {
            'juego': 'jackpot',
            'rango_predicho': {
                'minimo': round(rango_inferior, 2),
                'maximo': round(rango_superior, 2),
                'promedio': round(promedio, 2)
            },
            'estadisticas': {
                'promedio_historico': round(promedio, 2),
                'mediana': round(mediana, 2),
                'desviacion_estandar': round(desviacion, 2),
                'minimo_historico': round(minimo, 2),
                'maximo_historico': round(maximo, 2)
            },
            'tendencia': tendencia,
            'premios_analizados': len(historial_premios),
            'recomendacion': self._generar_recomendacion_jackpot(tendencia, promedio)
        }
    
    # ========== MÉTODOS AUXILIARES ==========
    
    def _prediccion_ruleta_vacia(self) -> Dict:
        """Predicción por defecto cuando no hay historial de ruleta"""
        return {
            'juego': 'ruleta',
            'numero_predicho': 0,
            'confianza_prediccion': 2.7,
            'probabilidades_color': {'rojo': 48.6, 'negro': 48.6, 'verde': 2.8},
            'numeros_calientes': [],
            'numeros_frios': [],
            'analisis_secuencia': 'Sin datos suficientes',
            'total_tiradas_analizadas': 0,
            'recomendacion': 'Se requiere más historial para predicciones precisas'
        }
    
    def _prediccion_blackjack_vacia(self) -> Dict:
        """Predicción por defecto cuando no hay cartas"""
        return {
            'juego': 'blackjack',
            'probabilidad_ganar': 46.0,
            'conteo_actual': 0,
            'true_count': 0,
            'ventaja_jugador': 0,
            'cartas_vistas': 0,
            'porcentaje_mazo_usado': 0,
            'momento_favorable': False,
            'recomendacion': 'Mazo neutro - Juega estrategia básica'
        }
    
    def _prediccion_jackpot_vacia(self) -> Dict:
        """Predicción por defecto para jackpot"""
        return {
            'juego': 'jackpot',
            'rango_predicho': {'minimo': 0, 'maximo': 0, 'promedio': 0},
            'estadisticas': {},
            'tendencia': 'desconocida',
            'premios_analizados': 0,
            'recomendacion': 'Se requieren más datos históricos'
        }
    
    def _analizar_secuencia_ruleta(self, historial: List[int]) -> str:
        """Analiza patrones en la secuencia de números"""
        if len(historial) < 5:
            return "Historial insuficiente"
        
        ultimos_5 = historial[-5:]
        
        # Detectar rachas de color
        colores = ['rojo' if n in NUMEROS_ROJOS else ('verde' if n == 0 else 'negro') for n in ultimos_5]
        
        if len(set(colores)) == 1:
            return f"Racha de {colores[0]} ({len(colores)} seguidos)"
        
        return "Secuencia mixta"
    
    def _generar_recomendacion_ruleta(self, numero: int, prob_rojo: float, 
                                      prob_negro: float, calientes: List) -> str:
        """Genera recomendación textual para ruleta"""
        if prob_rojo > 55:
            return f"Los rojos están calientes ({prob_rojo:.1f}%). Considera apostar a rojo."
        elif prob_negro > 55:
            return f"Los negros dominan ({prob_negro:.1f}%). Considera apostar a negro."
        elif calientes and calientes[0][1] > 5:
            return f"El número {calientes[0][0]} ha salido {calientes[0][1]} veces. Puede estar caliente."
        else:
            return "Distribución equilibrada. Juega con precaución."
    
    def _generar_recomendacion_blackjack(self, true_count: float, 
                                         prob_ganar: float, porcentaje_usado: float) -> str:
        """Genera recomendación para blackjack"""
        if true_count > 3:
            return f"¡Momento muy favorable! True count: {true_count:.1f}. Aumenta apuesta."
        elif true_count > 1:
            return f"Momento favorable. True count: {true_count:.1f}. Mantén estrategia agresiva."
        elif true_count < -2:
            return "Mazo desfavorable. Reduce apuestas o espera."
        else:
            return "Mazo neutro. Usa estrategia básica conservadora."
    
    def _generar_recomendacion_poker(self, fuerza: str, prob_mejorar: float, fase: str) -> str:
        """Genera recomendación para póker"""
        if fuerza in ['AA', 'KK', 'QQ']:
            return "Mano premium. Juega agresivamente."
        elif prob_mejorar > 30:
            return f"Buena probabilidad de mejorar ({prob_mejorar:.1f}%). Considera call."
        elif prob_mejorar > 15:
            return f"Probabilidad moderada ({prob_mejorar:.1f}%). Evalúa el pot odds."
        else:
            return "Mano débil. Considera fold si hay presión."
    
    def _generar_recomendacion_jackpot(self, tendencia: str, promedio: float) -> str:
        """Genera recomendación para jackpot"""
        if tendencia == 'creciente':
            return f"Tendencia alcista. Premio promedio: ${promedio:,.2f}"
        elif tendencia == 'decreciente':
            return "Tendencia a la baja. Espera acumulación."
        else:
            return f"Tendencia estable. Premio promedio: ${promedio:,.2f}"
    
    def _evaluar_mano_poker(self, mano: List[str], comunitarias: List[str]) -> str:
        """Evalúa fuerza de mano de póker (simplificado)"""
        if not mano or len(mano) != 2:
            return "desconocida"
        
        # Evaluar pocket cards
        valores = {'A': 14, 'K': 13, 'Q': 12, 'J': 11}
        
        cartas = []
        for carta in mano:
            valor_str = carta[:-1] if len(carta) > 1 else carta
            valor = valores.get(valor_str, int(valor_str) if valor_str.isdigit() else 0)
            cartas.append(valor)
        
        if cartas[0] == cartas[1]:
            if cartas[0] >= 13:
                return "Premium (pareja alta)"
            return "Pareja"
        elif max(cartas) >= 12:
            return "Cartas altas"
        
        return "Mano media"
    
    def _determinar_fase_poker(self, comunitarias: List[str]) -> str:
        """Determina fase del juego de póker"""
        if len(comunitarias) == 0:
            return "preflop"
        elif len(comunitarias) == 3:
            return "flop"
        elif len(comunitarias) == 4:
            return "turn"
        elif len(comunitarias) == 5:
            return "river"
        return "desconocida"
    
    def _calcular_outs_aproximados(self, mano: List[str], comunitarias: List[str]) -> int:
        """Calcula outs aproximados (simplificado)"""
        # Este es un cálculo muy básico
        # En una implementación real, evaluarías draws específicos
        if not comunitarias:
            return 6  # Outs promedio preflop
        
        return int(np.random.randint(4, 15))  # Simulación simple
    
    def _calcular_tendencia(self, datos: List[float]) -> str:
        """Calcula tendencia simple de una serie"""
        if len(datos) < 2:
            return "insuficiente"
        
        mitad = len(datos) // 2
        promedio_primera_mitad = float(np.mean(datos[:mitad]))
        promedio_segunda_mitad = float(np.mean(datos[mitad:]))
        
        if promedio_primera_mitad == 0:
            return "insuficiente"
        
        diferencia_porcentual = ((promedio_segunda_mitad - promedio_primera_mitad) / 
                                promedio_primera_mitad * 100)
        
        if diferencia_porcentual > 10:
            return "creciente"
        elif diferencia_porcentual < -10:
            return "decreciente"
        else:
            return "estable"