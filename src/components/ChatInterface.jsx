
import React, { useRef, useEffect } from 'react';
import '../styles/ChatInterface.css';

const ChatInterface = ({ 
  messages,           // Array de mensajes desde la Page
  inputValue,         // Valor del input desde la Page
  onInputChange,      // Callback para cambios en el input
  onSendMessage,      // Callback para enviar mensaje
  isLoading,          // Estado de carga desde la Page
  recommendation      // Recomendación desde la Page
}) => {
  const messagesEndRef = useRef(null);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    onSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-text">
          <p>Haz preguntas sobre probabilidades, estrategias y análisis del juego.</p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>No hay mensajes aún. Haz una pregunta sobre el juego.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '👁️'}
              </div>
              <div className="message-content">
                <div className="message-role">
                  {msg.role === 'user' ? 'Tú' : 'GamblingMind'}
                </div>
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">👁️</div>
            <div className="message-content">
              <div className="message-role">GamblingMind</div>
              <div className="message-text loading">Pensando...</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Recomendación */}
      <div className="chat-recommendation">
        <div className="recommendation-header">Movimiento Recomendado:</div>
        <div className="recommendation-text">
          {recommendation || 'Esperando análisis...'}
        </div>
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="¿Deseas que te muestre el gráfico de tendencia de color o la predicción extendida de 5 rondas?"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          className="chat-send-btn"
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;