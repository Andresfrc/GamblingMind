"""
HELPERS.PY
Funciones auxiliares y utilidades comunes
"""

from datetime import datetime
from typing import Dict, Any
import json


def formatear_dinero(cantidad: float) -> str:
    """
    Formatea cantidad como dinero
    
    Args:
        cantidad: Monto a formatear
        
    Returns:
        str: Monto formateado (ej: "$1,234.56")
    """
    return f"${cantidad:,.2f}"


def validar_juego(juego: str) -> bool:
    """
    Valida que el juego sea soportado
    
    Args:
        juego: Nombre del juego
        
    Returns:
        bool: True si el juego es válido
    """
    juegos_validos = ['ruleta', 'blackjack', 'poker', 'jackpot']
    return juego.lower() in juegos_validos


def log_evento(tipo: str, datos: Dict[str, Any], verbose: bool = True):
    """
    Registra un evento en el sistema
    
    Args:
        tipo: Tipo de evento
        datos: Datos del evento
        verbose: Si debe imprimir en consola
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    evento = {
        'timestamp': timestamp,
        'tipo': tipo,
        'datos': datos
    }
    
    if verbose:
        print(f"[{timestamp}] {tipo}: {json.dumps(datos, indent=2, ensure_ascii=False)}")
    
    # Aquí podrías guardar en archivo si lo deseas
    # with open('logs/eventos.log', 'a') as f:
    #     f.write(json.dumps(evento) + '\n')


def calcular_porcentaje(parte: float, total: float) -> float:
    """
    Calcula porcentaje de forma segura
    
    Args:
        parte: Parte del total
        total: Total
        
    Returns:
        float: Porcentaje
    """
    if total == 0:
        return 0.0
    return round((parte / total) * 100, 2)


def emoji_por_probabilidad(probabilidad: float) -> str:
    """
    Retorna emoji según probabilidad
    
    Args:
        probabilidad: Valor de 0-100
        
    Returns:
        str: Emoji representativo
    """
    if probabilidad >= 70:
        return "🔴"
    elif probabilidad >= 40:
        return "🟡"
    else:
        return "🟢"


def formatear_prediccion(prediccion: Dict) -> str:
    """
    Formatea una predicción para mostrar en terminal
    
    Args:
        prediccion: Dict con datos de predicción
        
    Returns:
        str: Texto formateado
    """
    juego = prediccion.get('juego', 'desconocido')
    lineas = [f"\n📊 Predicción para {juego.upper()}:"]
    lineas.append("=" * 50)
    
    for key, value in prediccion.items():
        if key != 'juego' and not key.startswith('_'):
            if isinstance(value, dict):
                lineas.append(f"\n{key.replace('_', ' ').title()}:")
                for sub_key, sub_value in value.items():
                    lineas.append(f"  • {sub_key}: {sub_value}")
            elif isinstance(value, list):
                lineas.append(f"\n{key.replace('_', ' ').title()}:")
                for item in value[:5]:  # Limitar a 5 items
                    lineas.append(f"  • {item}")
            else:
                lineas.append(f"{key.replace('_', ' ').title()}: {value}")
    
    return "\n".join(lineas)