import React, { useState, useMemo } from 'react';
import './DetectiveMap.css';

// Координаты маркеров, точно выверенные пользователем по макету карты
const MAP_LOCATIONS = [
  { id: 1, name: 'Студия Селены Блэк', x: 14.3, y: 69.7, type: 'studio' },
  { id: 2, name: 'Дом Артура Пейна', x: 3.6, y: 71.9, type: 'warehouse' },
  { id: 3, name: 'Кофейня "Мечтатели"', x: 15.7, y: 47.4, type: 'residential' },
  { id: 4, name: 'Мансарда Аларика', x: 22.8, y: 8.1, type: 'park' },
  { id: 5, name: 'Фотостудия Веспер', x: 33.0, y: 10.0, type: 'office' },
  { id: 6, name: 'Аптека "Здоровье Ривертона"', x: 21.1, y: 20.6, type: 'waterfront' },
  { id: 7, name: 'Квартира Селены Блэк', x: 7.5, y: 50.9, type: 'cafe' },
  { id: 8, name: '"Ривертон Комершл Банк"', x: 54.2, y: 69.7, type: 'bridge' },
  { id: 9, name: 'Заправка "Галф"', x: 95.9, y: 85.2, type: 'industrial' },
  { id: 10, name: 'Ресторан "Оникс"', x: 64.8, y: 2.8, type: 'police' },
  { id: 11, name: 'Особняк Андервудов', x: 45.1, y: 84.6, type: 'mansion' },
  { id: 12, name: 'Галерея "Арт-Модерн"', x: 53.4, y: 51.1, type: 'gallery' },
  { id: 13, name: 'Квартира Маркуса', x: 64.7, y: 17.5, type: 'residential' },
  { id: 14, name: 'Кабинет доктора Майкла Элиота', x: 75.7, y: 51.2, type: 'office' },
  { id: 15, name: 'Галерея "Хранилище"', x: 3.4, y: 14.6, type: 'gallery' },
  { id: 16, name: 'Офис "Dark Trace"', x: 76.5, y: 85.1, type: 'office' },
  { id: 17, name: 'Департамент полиции Ривертона', x: 64.6, y: 50.5, type: 'police' },
];


// Функция для получения иконки здания по типу
const getBuildingIcon = (type) => {
  const icons = {
    studio: '🎬',
    warehouse: '📦',
    residential: '🏘️',
    park: '🌳',
    office: '🏢',
    waterfront: '🌊',
    cafe: '☕',
    bridge: '🌉',
    industrial: '🏭',
    police: '🚔',
    mansion: '🏰',
    gallery: '🖼️'
  };
  return icons[type] || '🏢';
};

// Таблица расстояний и времени (упрощенная матрица)
// Логика: чем дальше координаты, тем больше время
const calculateTravel = (locA, locB) => {
  const dist = Math.sqrt(Math.pow(locB.x - locA.x, 2) + Math.pow(locB.y - locA.y, 2));
  const carMinutes = Math.round(dist * 0.8) + 2; // Базовое время + коэф
  const walkMinutes = carMinutes * 4;
  return {
    distance: (dist * 0.15).toFixed(1), // км
    car: carMinutes,
    walk: walkMinutes
  };
};

export default function DetectiveMap() {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [hovered, setHovered] = useState(null);

  const handleLocationClick = (loc) => {
    if (!pointA || (pointA && pointB)) {
      setPointA(loc);
      setPointB(null);
    } else if (pointA.id === loc.id) {
      setPointA(null);
    } else {
      setPointB(loc);
    }
  };

  const handleMapClick = (e) => {
    // Режим отладки: вычисляем координаты клика относительно контейнера карты
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    console.log(`DEBUG_COORD: x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`);
  };

  const routeData = useMemo(() => {
    if (pointA && pointB) {
      return calculateTravel(pointA, pointB);
    }
    return null;
  }, [pointA, pointB]);

  return (
    <div className="det-map-container">
      <div className="det-map-header">
        <div className="det-map-title">GEOGRAPHIC ANALYSIS SYSTEM // RIVERTON PD</div>
        <div className="det-map-status">STATUS: SYSTEM_ACTIVE</div>
      </div>

      <div className="det-map-main">
        {/* Sidebar Analysis */}
        <div className="det-map-sidebar">
          <div className="det-analysis-section">
            <div className="det-section-label">МАРШРУТ АНАЛИЗА</div>
            
            <div className="det-route-slot">
              <span className="det-slot-tag">ОТКУДА:</span>
              <span className="det-slot-value">{pointA ? `[${pointA.id}] ${pointA.name}` : 'ВЫБЕРИТЕ ТОЧКУ'}</span>
            </div>

            <div className="det-route-slot">
              <span className="det-slot-tag">КУДА:</span>
              <span className="det-slot-value">{pointB ? `[${pointB.id}] ${pointB.name}` : 'ВЫБЕРИТЕ ТОЧКУ'}</span>
            </div>

            {routeData && (
              <div className="det-route-results">
                <div className="det-result-item">
                  <span className="det-res-label">ДИСТАНЦИЯ:</span>
                  <span className="det-res-val">{routeData.distance} КМ</span>
                </div>
                <div className="det-result-item car">
                  <span className="det-res-label">🚗 НА АВТОМОБИЛЕ:</span>
                  <span className="det-res-val">{routeData.car} МИН</span>
                </div>
                <div className="det-result-item walk">
                  <span className="det-res-label">🏃 ПЕШКОМ:</span>
                  <span className="det-res-val">{routeData.walk} МИН</span>
                </div>
                <div className="det-analysis-note">
                  * Расчет произведен на основе средней плотности трафика в 21:00.
                </div>
              </div>
            )}
          </div>

          <div className="det-location-list">
            <div className="det-section-label">СПИСОК ЛОКАЦИЙ</div>
            {MAP_LOCATIONS.map(loc => (
              <div 
                key={loc.id} 
                className={`det-loc-item ${pointA?.id === loc.id || pointB?.id === loc.id ? 'selected' : ''}`}
                onMouseEnter={() => setHovered(loc)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleLocationClick(loc)}
              >
                <span className="det-loc-num">{loc.id}</span>
                <span className="det-loc-name">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Area */}
        <div className="det-map-viewport">
          <div className="det-map-canvas" onClick={handleMapClick}>
            {/* SVG Layer for routes */}
            <svg className="det-map-svg">
              {pointA && pointB && (
                <polyline 
                  points={`${pointA.x},${pointA.y} ${pointA.x},${pointB.y} ${pointB.x},${pointB.y}`}
                  className="det-map-route-line"
                  style={{
                    fill: 'none',
                    stroke: '#ffcc00',
                    strokeWidth: 4,
                    strokeDasharray: '10, 5',
                    filter: 'drop-shadow(0 0 8px rgba(255, 204, 0, 0.8))'
                  }}
                />
              )}
            </svg>

            {/* Markers as Buildings */}
            {MAP_LOCATIONS.map(loc => (
              <div 
                key={loc.id}
                className={`det-map-marker building-marker ${pointA?.id === loc.id ? 'start' : ''} ${pointB?.id === loc.id ? 'end' : ''} ${hovered?.id === loc.id ? 'hover' : ''}`}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                onClick={() => handleLocationClick(loc)}
                onMouseEnter={() => setHovered(loc)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="det-building-icon">
                  {getBuildingIcon(loc.type)}
                </div>
                <div className="det-marker-label">[{loc.id}]</div>
                
                {(hovered?.id === loc.id || pointA?.id === loc.id || pointB?.id === loc.id) && (
                  <div className="det-marker-tooltip">{loc.name.toUpperCase()}</div>
                )}
              </div>
            ))}
          </div>
          
          {/* Map Overlay Effects */}
          <div className="det-map-grid-overlay"></div>
          <div className="det-map-scanline"></div>
        </div>
      </div>
    </div>
  );
}
