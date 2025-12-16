"""
MAIN.PY - Script Principal (CLI)
Interfaz de línea de comandos para el predictor de casino con Agente Autónomo
"""

import os
import sys
from core.predictor_casino import PredictorCasino
from api.simulador import SimuladorCasino
from chatbot import get_chatbot
from utils.helpers import formatear_prediccion, log_evento


class CasinoPredictorCLI:
    """Interfaz CLI para el sistema de predicción de casino"""
    
    def __init__(self):
        self.predictor = PredictorCasino(ventana_historica=100)
        self.simulador = SimuladorCasino()
        self.chatbot = get_chatbot()
        self.historial_chat = []
        
    def mostrar_menu_principal(self):
        """Muestra el menú principal"""
        print("\n" + "="*60)
        print("🎰 CASINO PREDICTOR - Sistema de Análisis con IA")
        print("="*60)
        print("⚠️  PROYECTO EDUCATIVO - NO USAR PARA APUESTAS REALES")
        print("="*60)
        print("\n📋 MENÚ PRINCIPAL:")
        print("1. 🎡 Ruleta Europea")
        print("2. 🃏 Blackjack")
        print("3. 🎴 Póker Texas Hold'em")
        print("4. 💰 Jackpot Progresivo")
        print("5. 💬 Chat con IA")
        print("6. 📊 Ver estadísticas generales")
        print("7. 🤖 MODO AGENTE AUTÓNOMO")
        print("8. ❌ Salir")
        print("="*60)
    
    def menu_ruleta(self):
        """Menú específico de ruleta"""
        print("\n🎡 RULETA EUROPEA")
        print("="*40)
        
        mesas = self.simulador.obtener_mesas_disponibles('ruleta')
        print(f"Mesas disponibles: {', '.join(mesas)}")
        
        mesa = input("Elige una mesa (Enter para 'table_1'): ").strip() or 'table_1'
        
        while True:
            print(f"\n--- Mesa: {mesa} ---")
            print("1. Simular tirada")
            print("2. Ver historial")
            print("3. Obtener predicción")
            print("4. Volver")
            
            opcion = input("\nOpción: ").strip()
            
            if opcion == '1':
                tirada = self.simulador.simular_tirada_ruleta(mesa)
                print(f"\n🎯 Resultado: {tirada['numero']} ({tirada['color'].upper()})")
                print(f"   Docena: {tirada['docena']} | Columna: {tirada['columna']}")
                
            elif opcion == '2':
                historial = self.simulador.obtener_historial_ruleta(mesa, 20)
                if historial:
                    print(f"\n📜 Últimos 20 números:")
                    print("   " + " - ".join(map(str, historial)))
                else:
                    print("⚠️ No hay historial disponible")
                    
            elif opcion == '3':
                historial = self.simulador.obtener_historial_ruleta(mesa, 100)
                if len(historial) < 10:
                    print("⚠️ Se necesitan al menos 10 tiradas para predicción")
                    continue
                
                prediccion = self.predictor.predecir_ruleta(historial)
                print(formatear_prediccion(prediccion))
                
            elif opcion == '4':
                break
    
    def menu_blackjack(self):
        """Menú específico de blackjack"""
        print("\n🃏 BLACKJACK")
        print("="*40)
        
        mesas = self.simulador.obtener_mesas_disponibles('blackjack')
        print(f"Mesas disponibles: {', '.join(mesas)}")
        
        mesa = input("Elige una mesa (Enter para 'table_1'): ").strip() or 'table_1'
        
        while True:
            print(f"\n--- Mesa: {mesa} ---")
            print("1. Jugar mano")
            print("2. Ver conteo de cartas")
            print("3. Obtener predicción")
            print("4. Volver")
            
            opcion = input("\nOpción: ").strip()
            
            if opcion == '1':
                mano = self.simulador.simular_mano_blackjack(mesa)
                print(f"\n🎴 Tu mano: {' '.join(mano['mano_jugador'])} = {mano['valor_jugador']}")
                print(f"🎴 Dealer muestra: {mano['mano_dealer'][0]}")
                print(f"📊 Resultado: {mano['resultado'].replace('_', ' ').upper()}")
                print(f"🎰 Cartas restantes: {mano['cartas_restantes']}")
                
            elif opcion == '2':
                cartas_visibles = self.simulador.obtener_cartas_visibles_blackjack(mesa)
                if cartas_visibles:
                    print(f"\n📋 Últimas 20 cartas vistas:")
                    print("   " + " ".join(cartas_visibles))
                else:
                    print("⚠️ No hay cartas registradas aún")
                    
            elif opcion == '3':
                cartas_visibles = self.simulador.obtener_cartas_visibles_blackjack(mesa)
                if len(cartas_visibles) < 10:
                    print("⚠️ Se necesitan al menos 10 cartas vistas")
                    continue
                
                prediccion = self.predictor.predecir_blackjack(cartas_visibles)
                print(formatear_prediccion(prediccion))
                
            elif opcion == '4':
                break
    
    def menu_poker(self):
        """Menú específico de póker"""
        print("\n🎴 PÓKER TEXAS HOLD'EM")
        print("="*40)
        
        mesas = self.simulador.obtener_mesas_disponibles('poker')
        print(f"Mesas disponibles: {', '.join(mesas)}")
        
        mesa = input("Elige una mesa (Enter para 'table_1'): ").strip() or 'table_1'
        
        while True:
            print(f"\n--- Mesa: {mesa} ---")
            print("1. Repartir nueva mano")
            print("2. Obtener predicción")
            print("3. Volver")
            
            opcion = input("\nOpción: ").strip()
            
            if opcion == '1':
                mano = self.simulador.simular_mano_poker(mesa)
                print(f"\n🎴 Tu mano: {' '.join(mano['mano_jugador'])}")
                if mano['cartas_comunitarias']:
                    print(f"🎴 Mesa: {' '.join(mano['cartas_comunitarias'])}")
                print(f"📊 Fase: {mano['fase'].upper()}")
                print(f"💰 Pot: ${mano['pot_simulado']}")
                
            elif opcion == '2':
                mano = self.simulador.simular_mano_poker(mesa)
                prediccion = self.predictor.predecir_poker(
                    mano['mano_jugador'],
                    mano['cartas_comunitarias']
                )
                print(formatear_prediccion(prediccion))
                
            elif opcion == '3':
                break
    
    def menu_jackpot(self):
        """Menú específico de jackpot"""
        print("\n💰 JACKPOT PROGRESIVO")
        print("="*40)
        
        while True:
            print("\n1. Ver premio actual")
            print("2. Simular jugada")
            print("3. Obtener predicción")
            print("4. Volver")
            
            opcion = input("\nOpción: ").strip()
            
            if opcion == '1':
                estado = self.simulador.simular_jackpot()
                print(f"\n💰 Premio actual: ${estado['premio_actual']:,.2f}")
                if estado['hubo_ganador']:
                    print(f"🎉 ¡GANADOR! Premio: ${estado['premio_ganado']:,.2f}")
                    
            elif opcion == '2':
                for _ in range(10):
                    estado = self.simulador.simular_jackpot()
                    if estado['hubo_ganador']:
                        print(f"\n🎊 ¡JACKPOT! ${estado['premio_ganado']:,.2f}")
                        break
                else:
                    print(f"\n💰 Sin ganador. Premio acumulado: ${estado['premio_actual']:,.2f}")
                    
            elif opcion == '3':
                estado = self.simulador.simular_jackpot()
                prediccion = self.predictor.predecir_jackpot(estado['historial_premios'])
                print(formatear_prediccion(prediccion))
                
            elif opcion == '4':
                break
    
    def menu_chat(self):
        """Menú de chat con IA"""
        print("\n💬 CHAT CON IA")
        print("="*40)
        
        # Verificar chatbot
        ok, mensaje = self.chatbot.verificar_conexion()
        print(mensaje)
        
        if not ok:
            print("\n⚠️ No se puede iniciar el chat.")
            print("💡 Verifica tu configuración en config.py")
            input("\nPresiona Enter para volver...")
            return
        
        print("\n💬 Chat activo. Escribe 'salir' para terminar.")
        print("📝 Ejemplo: ¿Cuál es la mejor estrategia para blackjack?\n")
        
        while True:
            pregunta = input("👤 Tú: ").strip()
            
            if not pregunta:
                continue
            
            if pregunta.lower() in ['salir', 'exit', 'quit']:
                print("👋 Saliendo del chat...")
                break
            
            respuesta = self.chatbot.generar_respuesta(
                pregunta,
                historial=self.historial_chat
            )
            print(f"\n🤖 IA: {respuesta}\n")
            
            # Guardar historial
            self.historial_chat.append({'rol': 'Usuario', 'contenido': pregunta})
            self.historial_chat.append({'rol': 'Asistente', 'contenido': respuesta})
            
            if len(self.historial_chat) > 10:
                self.historial_chat = self.historial_chat[-10:]
    
    def mostrar_estadisticas(self):
        """Muestra estadísticas generales"""
        print("\n📊 ESTADÍSTICAS GENERALES")
        print("="*40)
        
        for juego in ['ruleta', 'blackjack', 'poker']:
            mesas = self.simulador.obtener_mesas_disponibles(juego)
            print(f"\n{juego.upper()}: {len(mesas)} mesas activas")
            
            for mesa in mesas[:2]:
                stats = self.simulador.obtener_estadisticas_mesa(juego, mesa)
                print(f"• {mesa}: {stats}")
    
    def menu_agente_autonomo(self):
        """Menú para el agente autónomo"""
        from core.agente_autonomo import AgenteAutonomo
        
        print("\n🤖 MODO AGENTE AUTÓNOMO")
        print("="*40)
        print("El agente ejecutará experimentos de forma autónoma")
        print("y reportará hallazgos interesantes automáticamente.")
        print()
        
        try:
            duracion = input("Duración en segundos (Enter para 60): ").strip()
            duracion = int(duracion) if duracion else 60
            
            print(f"\n🚀 Iniciando agente por {duracion} segundos...")
            print("⚠️  Presiona Ctrl+C para detenerlo antes\n")
            
            agente = AgenteAutonomo()
            agente.iniciar_bucle_autonomo(duracion_segundos=duracion)
            
            # Mostrar informe
            informe = agente.obtener_informe()
            print(f"\n📋 INFORME FINAL:")
            print(f"   Experimentos: {informe['experimentos']}")
            print(f"   Hallazgos: {informe['estadisticas']['hallazgos_relevantes']}")
            print(f"   Patrones: {len(informe['patrones'])}")
            
            input("\nPresiona Enter para continuar...")
            
        except ValueError:
            print("❌ Duración inválida")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    def ejecutar(self):
        """Ejecuta el CLI principal"""
        print("\n🎰 Iniciando Casino Predictor...")
        print("⚠️  ADVERTENCIA: Proyecto educativo únicamente")
        print("   El juego puede crear adicción. No usar dinero real.\n")
        
        # Verificar chatbot al inicio
        ok, mensaje = self.chatbot.verificar_conexion()
        print(f"🤖 Chatbot: {mensaje}\n")
        
        while True:
            try:
                self.mostrar_menu_principal()
                opcion = input("\nElige una opción (1-8): ").strip()
                
                if opcion == '1':
                    self.menu_ruleta()
                elif opcion == '2':
                    self.menu_blackjack()
                elif opcion == '3':
                    self.menu_poker()
                elif opcion == '4':
                    self.menu_jackpot()
                elif opcion == '5':
                    self.menu_chat()
                elif opcion == '6':
                    self.mostrar_estadisticas()
                elif opcion == '7':
                    self.menu_agente_autonomo()
                elif opcion == '8':
                    print("\n👋 ¡Hasta luego!")
                    break
                else:
                    print("❌ Opción inválida")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Programa interrumpido")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")


def main():
    """Función principal"""
    if os.name == "nt":
        if len(sys.argv) > 1 and sys.argv[1] == "--quick":
            print("🚀 Modo rápido - Iniciando chat directo...")
            cli = CasinoPredictorCLI()
            cli.menu_chat()
        else:
            cli = CasinoPredictorCLI()
            cli.ejecutar()
    else:
        cli = CasinoPredictorCLI()
        cli.ejecutar()


if __name__ == "__main__":
    main()