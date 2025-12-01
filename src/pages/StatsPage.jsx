import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/useAppContext';
import AnimatedBackground from '../components/AnimatedBackground';
import '../styles/StatsPage.css';

const COLORS = ['#2e7d32', '#c62828', '#ffc107'];
const GAME_COLORS = {
  ruleta: '#d32f2f',
  blackjack: '#1976d2',
  poker: '#388e3c',
  jackpot: '#fbc02d'
};

const StatsPage = () => {
  const { predictions } = useAppContext();
  const [selectedGame, setSelectedGame] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Filtrar predicciones
  const filteredPredictions = useMemo(() => {
    if (!predictions) return [];
    
    return predictions.filter(p => {
      if (selectedGame && p.game !== selectedGame) return false;
      
      if (dateRange.start) {
        const predDate = new Date(p.timestamp);
        if (predDate < new Date(dateRange.start)) return false;
      }
      
      if (dateRange.end) {
        const predDate = new Date(p.timestamp);
        if (predDate > new Date(dateRange.end)) return false;
      }
      
      return true;
    });
  }, [predictions, selectedGame, dateRange]);

  // Cálculos de estadísticas
  const total = filteredPredictions.length;
  const correct = filteredPredictions.filter(p => p?.correct).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

  const byGame = useMemo(() => {
    const games = {};
    filteredPredictions.forEach(p => {
      if (p?.game) {
        if (!games[p.game]) {
          games[p.game] = { total: 0, correct: 0, accuracy: 0 };
        }
        games[p.game].total++;
        if (p.correct) games[p.game].correct++;
        games[p.game].accuracy = ((games[p.game].correct / games[p.game].total) * 100).toFixed(1);
      }
    });
    return games;
  }, [filteredPredictions]);

  // Datos para gráfico de línea (evolución)
  const lineChartData = useMemo(() => {
    const data = [];
    let acc = 0;
    let count = 0;

    filteredPredictions.forEach((p, idx) => {
      if (p.result) {
        if (p.correct) acc++;
        count++;
        data.push({
          idx: idx + 1,
          accuracy: (acc / count * 100).toFixed(1),
          name: `Pred ${idx + 1}`
        });
      }
    });

    return data.slice(-30); // Últimas 30
  }, [filteredPredictions]);

  // Datos para gráfico de barras (por juego)
  const barChartData = useMemo(() => {
    return Object.entries(byGame).map(([game, stats]) => ({
      name: game.charAt(0).toUpperCase() + game.slice(1),
      accuracy: parseFloat(stats.accuracy),
      total: stats.total,
      fill: GAME_COLORS[game]
    }));
  }, [byGame]);

  // Datos para gráfico de pastel
  const pieChartData = useMemo(() => {
    return [
      { name: 'Aciertos', value: correct },
      { name: 'Fallos', value: total - correct }
    ];
  }, [correct, total]);

  // Análisis avanzado
  const advancedStats = useMemo(() => {
    if (filteredPredictions.length === 0) {
      return { racha: 0, mejorHora: '-', mejorJuego: '-', comparativaAzar: {} };
    }

    // Racha actual de aciertos
    let racha = 0;
    for (let i = filteredPredictions.length - 1; i >= 0; i--) {
      if (filteredPredictions[i].correct) {
        racha++;
      } else {
        break;
      }
    }

    // Mejor hora (más aciertos)
    const hourCounts = {};
    filteredPredictions.forEach(p => {
      const hour = new Date(p.timestamp).getHours();
      if (!hourCounts[hour]) hourCounts[hour] = { total: 0, correct: 0 };
      hourCounts[hour].total++;
      if (p.correct) hourCounts[hour].correct++;
    });

    let mejorHora = '-';
    let maxAciertos = 0;
    Object.entries(hourCounts).forEach(([hour, data]) => {
      const accuracy = (data.correct / data.total) * 100;
      if (accuracy > maxAciertos && data.total >= 2) {
        maxAciertos = accuracy;
        mejorHora = `${hour}:00 (${data.correct}/${data.total})`;
      }
    });

    // Mejor juego
    let mejorJuego = '-';
    let maxAccuracy = 0;
    Object.entries(byGame).forEach(([game, stats]) => {
      const acc = parseFloat(stats.accuracy);
      if (acc > maxAccuracy) {
        maxAccuracy = acc;
        mejorJuego = `${game} (${stats.accuracy}%)`;
      }
    });

    // Comparativa vs azar
    const comparativaAzar = {};
    Object.entries(byGame).forEach(([game, stats]) => {
      let probabilidadAzar = 50; // Por defecto
      if (game === 'ruleta') {
        probabilidadAzar = 48.6; // Ruleta europea (rojo/negro)
      }
      comparativaAzar[game] = {
        actual: parseFloat(stats.accuracy),
        teorica: probabilidadAzar,
        diferencia: (parseFloat(stats.accuracy) - probabilidadAzar).toFixed(1)
      };
    });

    return { racha, mejorHora, mejorJuego, comparativaAzar };
  }, [filteredPredictions, byGame]);

  if (!predictions) {
    return (
      <div className="stats-page">
        <AnimatedBackground />
        <div className="stats-content">
          <h1 className="stats-title"> Estadísticas de Predicciones</h1>
          <p className="no-data">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <AnimatedBackground />
      <div className="stats-content">
        <h1 className="stats-title"> Estadísticas de Predicciones</h1>

        {/* Filtros */}
        <div className="stats-filters">
          <div className="filter-group">
            <label>Juego:</label>
            <select value={selectedGame || ''} onChange={(e) => setSelectedGame(e.target.value || null)}>
              <option value="">Todos</option>
              <option value="ruleta">Ruleta</option>
              <option value="blackjack">Blackjack</option>
              <option value="poker">Poker</option>
              <option value="jackpot">Jackpot</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Desde:</label>
            <input
              type="date"
              value={dateRange.start || ''}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Hasta:</label>
            <input
              type="date"
              value={dateRange.end || ''}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          <button
            className="filter-reset"
            onClick={() => {
              setSelectedGame(null);
              setDateRange({ start: null, end: null });
            }}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Tarjetas principales */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Precisión General</h2>
            <div className="stat-big-number">{accuracy}%</div>
            <p className="stat-small-text">
              {correct} aciertos de {total} predicciones
            </p>
          </div>

          <div className="stat-card">
            <h2>Total Predicciones</h2>
            <div className="stat-big-number">{total}</div>
            <p className="stat-small-text">
              ✅ {correct} | ❌ {total - correct}
            </p>
          </div>

          {/* Tarjetas por juego */}
          {Object.entries(byGame).map(([game, stats]) => (
            <div key={game} className="stat-card">
              <h2>{game.charAt(0).toUpperCase() + game.slice(1)}</h2>
              <div className="stat-big-number">{stats.accuracy}%</div>
              <p className="stat-small-text">
                {stats.correct} de {stats.total} aciertos
              </p>
            </div>
          ))}
        </div>

        {/* Gráficos Recharts */}
        {total > 0 && (
          <div className="charts-container">
            {/* Gráfico de Línea - Evolución */}
            {lineChartData.length > 1 && (
              <div className="chart-wrapper">
                <h3>Evolución de Precisión</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#b8a863" 
                      strokeWidth={2}
                      dot={{ fill: '#b8a863', r: 4 }}
                      name="Precisión (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Gráfico de Barras - Por Juego */}
            {barChartData.length > 0 && (
              <div className="chart-wrapper">
                <h3> Precisión por Juego</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#b8a863" name="Precisión (%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Gráfico de Pastel - Aciertos vs Fallos */}
            {pieChartData.some(d => d.value > 0) && (
              <div className="chart-wrapper">
                <h3> Distribución Aciertos/Fallos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Análisis Avanzado */}
        {total > 0 && (
          <div className="advanced-analysis">
            <h2> Análisis Avanzado</h2>
            <div className="analysis-grid">
              <div className="analysis-card">
                <h3>Racha Actual</h3>
                <div className="analysis-value">{advancedStats.racha} aciertos seguidos</div>
              </div>

              <div className="analysis-card">
                <h3>Mejor Hora</h3>
                <div className="analysis-value">{advancedStats.mejorHora}</div>
              </div>

              <div className="analysis-card">
                <h3>Mejor Juego</h3>
                <div className="analysis-value">{advancedStats.mejorJuego}</div>
              </div>
            </div>

            {/* Comparativa vs Azar */}
            <div className="comparativa-azar">
              <h3> Comparativa vs Probabilidad Teórica</h3>
              <div className="comparativa-table">
                {Object.entries(advancedStats.comparativaAzar).map(([game, stats]) => (
                  <div key={game} className="comparativa-row">
                    <span className="game-name">{game.charAt(0).toUpperCase() + game.slice(1)}</span>
                    <span className="accuracy">{stats.actual}%</span>
                    <span className="teorica">vs {stats.teorica}%</span>
                    <span className={`diferencia ${stats.diferencia >= 0 ? 'positive' : 'negative'}`}>
                      {stats.diferencia >= 0 ? '+' : ''}{stats.diferencia}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Histórico Detallado */}
        <div className="predictions-history">
          <h2>Historial de Predicciones</h2>
          {total === 0 ? (
            <p className="no-data">No hay predicciones registradas.</p>
          ) : (
            <div className="history-table">
              <div className="table-header">
                <div className="col-date">Fecha</div>
                <div className="col-game">Juego</div>
                <div className="col-pred">Predicción</div>
                <div className="col-prob">Probabilidad</div>
                <div className="col-result">Resultado</div>
                <div className="col-status">Estado</div>
              </div>
              {[...filteredPredictions].reverse().map((pred) => (
                <div key={pred.id} className="table-row">
                  <div className="col-date">
                    {new Date(pred.timestamp).toLocaleString('es-ES', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="col-game">{pred.game}</div>
                  <div className="col-pred">{pred.prediction}</div>
                  <div className="col-prob">{(pred.probability || 0).toFixed(1)}%</div>
                  <div className="col-result">
                    {pred.result ? (
                      typeof pred.result === 'object' 
                        ? pred.game === 'ruleta' 
                          ? pred.result.color
                          : pred.game === 'blackjack'
                          ? pred.result.resultado
                          : pred.game === 'poker'
                          ? pred.result.fase
                          : pred.game === 'jackpot'
                          ? (pred.result.hubo_ganador ? 'Ganador' : 'Sin ganador')
                          : '-'
                        : pred.result
                    ) : '-'}
                  </div>
                  <div className={`col-status ${pred.correct ? 'correct' : pred.result ? 'incorrect' : 'pending'}`}>
                    {pred.correct ? '✅ Acertó' : pred.result ? '❌ Falló' : '⏳ Pendiente'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
