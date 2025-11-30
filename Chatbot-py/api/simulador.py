"""
SIMULADOR.PY
Simulador de juegos de casino (ruleta, blackjack, póker, jackpot)
Genera datos realistas para testing sin necesidad de casino real
"""

import random
import numpy as np
from typing import List, Dict, Tuple
from collections import deque

# Constantes de ruleta europea
NUMEROS_ROJOS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
NUMEROS_NEGROS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]


class SimuladorCasino:
    """
    Simula diferentes juegos de casino generando resultados realistas.
    Útil para testing y desarrollo sin conexión a casinos reales.
    """
    
    def __init__(self):
        """Inicializa el simulador con mesas virtuales"""
        self.mesas_activas = {
            'ruleta': {},
            'blackjack': {},
            'poker': {},
            'jackpot': {}
        }
        self._inicializar_mesas()
    
    def _inicializar_mesas(self):
        """Crea mesas virtuales para cada juego"""
        # Mesas de ruleta
        for i in range(1, 4):
            self.mesas_activas['ruleta'][f'table_{i}'] = {
                'historial': deque(maxlen=100),
                'total_tiradas': 0
            }
        
        # Mesas de blackjack
        for i in range(1, 4):
            self.mesas_activas['blackjack'][f'table_{i}'] = {
                'mazo_actual': self._crear_mazo(num_mazos=6),
                'cartas_usadas': [],
                'manos_jugadas': 0
            }
        
        # Mesas de póker
        for i in range(1, 3):
            self.mesas_activas['poker'][f'table_{i}'] = {
                'mazo_actual': self._crear_mazo(num_mazos=1),
                'ronda_actual': 'preflop',
                'manos_jugadas': 0
            }
        
        # Jackpots progresivos
        self.mesas_activas['jackpot']['progressive_1'] = {
            'premio_actual': 50000.0,
            'historial_premios': [45000, 52000, 48000, 55000, 51000],
            'incremento_por_jugada': 0.5
        }
    
    # ========== SIMULACIÓN DE RULETA ==========
    
    def simular_tirada_ruleta(self, mesa: str = 'table_1') -> Dict:
        """
        Simula una tirada de ruleta europea (0-36)
        
        Args:
            mesa: Identificador de la mesa
            
        Returns:
            Dict con resultado de la tirada
        """
        if mesa not in self.mesas_activas['ruleta']:
            mesa = 'table_1'
        
        # Generar número (ligeramente sesgado para realismo)
        if random.random() < 0.03:  # 3% de probabilidad de 0 (verde)
            numero = 0
        else:
            numero = random.randint(1, 36)
        
        # Determinar color
        if numero == 0:
            color = 'verde'
        elif numero in NUMEROS_ROJOS:
            color = 'rojo'
        else:
            color = 'negro'
        
        # Determinar par/impar
        paridad = 'par' if numero % 2 == 0 and numero != 0 else 'impar'
        
        # Actualizar mesa
        mesa_data = self.mesas_activas['ruleta'][mesa]
        mesa_data['historial'].append(numero)
        mesa_data['total_tiradas'] += 1
        
        return {
            'juego': 'ruleta',
            'mesa': mesa,
            'numero': numero,
            'color': color,
            'paridad': paridad,
            'docena': (numero - 1) // 12 + 1 if numero > 0 else 0,
            'columna': numero % 3 if numero > 0 else 0,
            'timestamp': self._get_timestamp()
        }
    
    def obtener_historial_ruleta(self, mesa: str = 'table_1', 
                                  cantidad: int = 20) -> List[int]:
        """Obtiene historial reciente de una mesa de ruleta"""
        if mesa not in self.mesas_activas['ruleta']:
            return []
        
        historial = list(self.mesas_activas['ruleta'][mesa]['historial'])
        return historial[-cantidad:] if historial else []
    
    # ========== SIMULACIÓN DE BLACKJACK ==========
    
    def simular_mano_blackjack(self, mesa: str = 'table_1') -> Dict:
        """
        Simula una mano de blackjack (jugador vs dealer)
        
        Args:
            mesa: Identificador de la mesa
            
        Returns:
            Dict con resultado de la mano
        """
        if mesa not in self.mesas_activas['blackjack']:
            mesa = 'table_1'
        
        mesa_data = self.mesas_activas['blackjack'][mesa]
        
        # Verificar si necesitamos nuevo mazo
        if len(mesa_data['mazo_actual']) < 20:
            mesa_data['mazo_actual'] = self._crear_mazo(num_mazos=6)
            mesa_data['cartas_usadas'] = []
        
        # Repartir cartas
        mano_jugador = [self._sacar_carta(mesa_data), self._sacar_carta(mesa_data)]
        mano_dealer = [self._sacar_carta(mesa_data), self._sacar_carta(mesa_data)]
        
        # Calcular valores
        valor_jugador = self._calcular_valor_blackjack(mano_jugador)
        valor_dealer = self._calcular_valor_blackjack([mano_dealer[0]])  # Solo carta visible
        
        # Simular resultado simple
        resultado = self._determinar_ganador_blackjack(
            self._calcular_valor_blackjack(mano_jugador),
            self._calcular_valor_blackjack(mano_dealer)
        )
        
        mesa_data['manos_jugadas'] += 1
        
        return {
            'juego': 'blackjack',
            'mesa': mesa,
            'mano_jugador': mano_jugador,
            'mano_dealer': mano_dealer,
            'valor_jugador': valor_jugador,
            'valor_dealer_visible': valor_dealer,
            'resultado': resultado,
            'cartas_visibles': mano_jugador + [mano_dealer[0]],
            'cartas_restantes': len(mesa_data['mazo_actual']),
            'timestamp': self._get_timestamp()
        }
    
    def obtener_cartas_visibles_blackjack(self, mesa: str = 'table_1') -> List[str]:
        """Obtiene cartas recientes visibles en blackjack"""
        if mesa not in self.mesas_activas['blackjack']:
            return []
        
        return self.mesas_activas['blackjack'][mesa]['cartas_usadas'][-20:]
    
    # ========== SIMULACIÓN DE PÓKER ==========
    
    def simular_mano_poker(self, mesa: str = 'table_1') -> Dict:
        """
        Simula una mano de póker Texas Hold'em
        
        Args:
            mesa: Identificador de la mesa
            
        Returns:
            Dict con estado de la mano
        """
        if mesa not in self.mesas_activas['poker']:
            mesa = 'table_1'
        
        mesa_data = self.mesas_activas['poker'][mesa]
        
        # Nuevo mazo si es necesario
        if len(mesa_data['mazo_actual']) < 10:
            mesa_data['mazo_actual'] = self._crear_mazo(num_mazos=1)
        
        # Repartir mano del jugador (2 cartas)
        mano_jugador = [
            mesa_data['mazo_actual'].pop(),
            mesa_data['mazo_actual'].pop()
        ]
        
        # Simular fase del juego
        fase = random.choice(['preflop', 'flop', 'turn', 'river'])
        
        cartas_comunitarias = []
        if fase in ['flop', 'turn', 'river']:
            cartas_comunitarias = [
                mesa_data['mazo_actual'].pop(),
                mesa_data['mazo_actual'].pop(),
                mesa_data['mazo_actual'].pop()
            ]
        if fase in ['turn', 'river']:
            cartas_comunitarias.append(mesa_data['mazo_actual'].pop())
        if fase == 'river':
            cartas_comunitarias.append(mesa_data['mazo_actual'].pop())
        
        mesa_data['manos_jugadas'] += 1
        mesa_data['ronda_actual'] = fase
        
        return {
            'juego': 'poker',
            'mesa': mesa,
            'mano_jugador': mano_jugador,
            'cartas_comunitarias': cartas_comunitarias,
            'fase': fase,
            'pot_simulado': random.randint(100, 1000),
            'jugadores_activos': random.randint(2, 6),
            'timestamp': self._get_timestamp()
        }
    
    # ========== SIMULACIÓN DE JACKPOT ==========
    
    def simular_jackpot(self, jackpot_id: str = 'progressive_1') -> Dict:
        """
        Simula estado actual de un jackpot progresivo
        
        Args:
            jackpot_id: Identificador del jackpot
            
        Returns:
            Dict con información del jackpot
        """
        if jackpot_id not in self.mesas_activas['jackpot']:
            jackpot_id = 'progressive_1'
        
        jackpot_data = self.mesas_activas['jackpot'][jackpot_id]
        
        # Incrementar premio levemente
        jackpot_data['premio_actual'] += jackpot_data['incremento_por_jugada']
        
        # Simular si hay ganador (muy baja probabilidad)
        if random.random() < 0.001:  # 0.1% de probabilidad
            premio_ganado = jackpot_data['premio_actual']
            jackpot_data['historial_premios'].append(premio_ganado)
            jackpot_data['premio_actual'] = random.uniform(40000, 55000)
            hubo_ganador = True
        else:
            premio_ganado = None
            hubo_ganador = False
        
        return {
            'juego': 'jackpot',
            'jackpot_id': jackpot_id,
            'premio_actual': round(jackpot_data['premio_actual'], 2),
            'historial_premios': jackpot_data['historial_premios'][-10:],
            'hubo_ganador': hubo_ganador,
            'premio_ganado': round(premio_ganado, 2) if premio_ganado else None,
            'timestamp': self._get_timestamp()
        }
    
    # ========== MÉTODOS AUXILIARES ==========
    
    def _crear_mazo(self, num_mazos: int = 1) -> List[str]:
        """Crea un mazo de cartas estándar"""
        palos = ['♠', '♥', '♦', '♣']
        valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        
        mazo = []
        for _ in range(num_mazos):
            for palo in palos:
                for valor in valores:
                    mazo.append(f"{valor}{palo}")
        
        random.shuffle(mazo)
        return mazo
    
    def _sacar_carta(self, mesa_data: Dict) -> str:
        """Saca una carta del mazo de una mesa"""
        carta = mesa_data['mazo_actual'].pop()
        mesa_data['cartas_usadas'].append(carta)
        return carta
    
    def _calcular_valor_blackjack(self, mano: List[str]) -> int:
        """Calcula el valor de una mano de blackjack"""
        valor = 0
        ases = 0
        
        for carta in mano:
            valor_carta = carta[:-1]
            
            if valor_carta in ['J', 'Q', 'K']:
                valor += 10
            elif valor_carta == 'A':
                ases += 1
                valor += 11
            else:
                valor += int(valor_carta)
        
        # Ajustar ases si es necesario
        while valor > 21 and ases > 0:
            valor -= 10
            ases -= 1
        
        return valor
    
    def _determinar_ganador_blackjack(self, valor_jugador: int, 
                                       valor_dealer: int) -> str:
        """Determina el ganador de una mano de blackjack"""
        if valor_jugador > 21:
            return 'dealer_gana'
        elif valor_dealer > 21:
            return 'jugador_gana'
        elif valor_jugador > valor_dealer:
            return 'jugador_gana'
        elif valor_dealer > valor_jugador:
            return 'dealer_gana'
        else:
            return 'empate'
    
    def _get_timestamp(self) -> str:
        """Genera timestamp simple"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def obtener_mesas_disponibles(self, juego: str) -> List[str]:
        """Retorna lista de mesas disponibles para un juego"""
        if juego in self.mesas_activas:
            return list(self.mesas_activas[juego].keys())
        return []
    
    def obtener_estadisticas_mesa(self, juego: str, mesa: str) -> Dict:
        """Obtiene estadísticas de una mesa específica"""
        if juego not in self.mesas_activas or mesa not in self.mesas_activas[juego]:
            return {'error': 'Mesa no encontrada'}
        
        mesa_data = self.mesas_activas[juego][mesa]
        
        if juego == 'ruleta':
            return {
                'total_tiradas': mesa_data['total_tiradas'],
                'ultimos_numeros': list(mesa_data['historial'])[-10:]
            }
        elif juego == 'blackjack':
            return {
                'manos_jugadas': mesa_data['manos_jugadas'],
                'cartas_restantes': len(mesa_data['mazo_actual'])
            }
        elif juego == 'poker':
            return {
                'manos_jugadas': mesa_data['manos_jugadas'],
                'ronda_actual': mesa_data['ronda_actual']
            }
        
        return {}
    
    def reiniciar_mesa(self, juego: str, mesa: str):
        """Reinicia una mesa específica"""
        if juego == 'ruleta' and mesa in self.mesas_activas['ruleta']:
            self.mesas_activas['ruleta'][mesa]['historial'].clear()
            self.mesas_activas['ruleta'][mesa]['total_tiradas'] = 0
        elif juego == 'blackjack' and mesa in self.mesas_activas['blackjack']:
            self.mesas_activas['blackjack'][mesa]['mazo_actual'] = self._crear_mazo(6)
            self.mesas_activas['blackjack'][mesa]['cartas_usadas'] = []
            self.mesas_activas['blackjack'][mesa]['manos_jugadas'] = 0
        elif juego == 'poker' and mesa in self.mesas_activas['poker']:
            self.mesas_activas['poker'][mesa]['mazo_actual'] = self._crear_mazo(1)
            self.mesas_activas['poker'][mesa]['manos_jugadas'] = 0


# Ejemplo de uso
if __name__ == "__main__":
    simulador = SimuladorCasino()
    
    print("🎰 SIMULADOR DE CASINO")
    print("=" * 50)
    
    # Simular ruleta
    print("\n🎡 RULETA:")
    for _ in range(5):
        tirada = simulador.simular_tirada_ruleta()
        print(f"   {tirada['numero']} ({tirada['color']})")
    
    # Simular blackjack
    print("\n🃏 BLACKJACK:")
    mano = simulador.simular_mano_blackjack()
    print(f"   Jugador: {mano['mano_jugador']} = {mano['valor_jugador']}")
    print(f"   Dealer: {mano['mano_dealer'][0]} (visible)")
    print(f"   Resultado: {mano['resultado']}")
    
    # Simular póker
    print("\n🎴 PÓKER:")
    poker = simulador.simular_mano_poker()
    print(f"   Mano: {poker['mano_jugador']}")
    print(f"   Comunitarias: {poker['cartas_comunitarias']}")
    print(f"   Fase: {poker['fase']}")
    
    # Simular jackpot
    print("\n💰 JACKPOT:")
    jackpot = simulador.simular_jackpot()
    print(f"   Premio actual: ${jackpot['premio_actual']:,.2f}")
    print(f"   Ganador: {'SÍ' if jackpot['hubo_ganador'] else 'NO'}")