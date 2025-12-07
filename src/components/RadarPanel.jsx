// components/RadarPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

const RadarPanel = ({ results, inputData }) => {
  const [time, setTime] = useState(0.5);
  const [minValues, setMinValues] = useState(new Array(15).fill(0));
  const [maxValues, setMaxValues] = useState(new Array(15).fill(1));

  useEffect(() => {
    if (inputData && inputData.l_params) {
      const mins = inputData.l_params.map(p => p.min || 0);
      const maxs = inputData.l_params.map(p => p.max || 1);
      setMinValues(mins);
      setMaxValues(maxs);
    }
  }, [inputData]);

  const characteristicNames = [
    "L1 - Остаток денежных средств", 
    "L2 - Выручка", 
    "L3 - Прибыль", 
    "L4 - Активы", 
    "L5 - Численность",
    "L6 - Конкурентоспособность", 
    "L7 - Объем продаж", 
    "L8 - Инновационность",
    "L9 - Известность бренда", 
    "L10 - Материалоемкость", 
    "L11 - Ремонты",
    "L12 - Износ оборудования",
    "L13 - Налоги в бюджет", 
    "L14 - Социальная сфера", 
    "L15 - Экологичность"
  ];

  if (!results || !results.t || !results.L) {
    return (
      <div className="tab-content active">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Лепестковая диаграмма характеристик</h3>
          <p>Нет данных для отображения. Выполните расчеты на вкладке "Ввод данных".</p>
        </div>
      </div>
    );
  }

  // Находим индекс времени
  const findTimeIndex = (targetTime) => {
    if (!Array.isArray(results.t) || results.t.length === 0) return 0;
    
    let closestIndex = 0;
    let minDiff = Math.abs(results.t[0] - targetTime);
    
    for (let i = 1; i < results.t.length; i++) {
      const diff = Math.abs(results.t[i] - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  const timeIndex = findTimeIndex(time);
  const currentValues = results.L.map((trajectory, i) => {
    if (!Array.isArray(trajectory) || trajectory.length <= timeIndex) {
      return minValues[i] || 0;
    }
    const value = trajectory[timeIndex];
    return isFinite(value) ? value : minValues[i] || 0;
  });

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: {
          stepSize: 0.2,
          backdropColor: 'transparent',
          showLabelBackdrop: false,
          font: {
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 11
          },
          color: '#333'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.r.toFixed(3);
            const charIndex = context.dataIndex;
            const charName = characteristicNames[charIndex]?.split(' - ')[1] || `L${charIndex + 1}`;
            const min = minValues[charIndex] || 0;
            const max = maxValues[charIndex] || 1;
            return `${label}: ${charName} = ${value} (min: ${min.toFixed(2)}, max: ${max.toFixed(2)})`;
          }
        }
      }
    }
  };

  const radarData = {
    labels: characteristicNames.map(name => {
      const shortName = name.split(' - ')[1] || name;
      return shortName.length > 20 ? shortName.substring(0, 20) + '...' : shortName;
    }),
    datasets: [
      {
        label: 'Минимальные значения',
        data: minValues,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 0.3)',
        pointBackgroundColor: 'rgba(255, 99, 132, 0.3)',
        pointBorderColor: '#fff',
        borderWidth: 1,
        pointRadius: 1,
        fill: true
      },
      {
        label: 'Максимальные значения',
        data: maxValues,
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderColor: 'rgba(54, 162, 235, 0.3)',
        pointBackgroundColor: 'rgba(54, 162, 235, 0.3)',
        pointBorderColor: '#fff',
        borderWidth: 1,
        pointRadius: 1,
        fill: true
      },
      {
        label: `Текущие значения (t = ${time.toFixed(2)})`,
        data: currentValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: false
      }
    ]
  };

  return (
    <div className="tab-content active">
      <div style={{ padding: '20px' }}>
        <div className="radar-header" style={{ marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>
            Лепестковая диаграмма характеристик компании
          </h2>
          
          <div className="radar-controls" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div className="time-control" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="time-input" style={{ fontWeight: '500', color: '#333' }}>
                Время t:
              </label>
              <input
                type="range"
                id="time-slider"
                min="0"
                max="1"
                step="0.01"
                value={time}
                onChange={(e) => setTime(parseFloat(e.target.value))}
                style={{ width: '200px' }}
              />
              <input
                type="number"
                id="time-input"
                min="0"
                max="1"
                step="0.01"
                value={time}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  if (!isNaN(newTime) && newTime >= 0 && newTime <= 1) {
                    setTime(newTime);
                  }
                }}
                style={{ 
                  width: '80px',
                  padding: '5px 10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
          
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            maxWidth: '800px', 
            margin: '0 auto 20px',
            lineHeight: '1.5',
            fontSize: '14px'
          }}>
            Зеленые области показывают допустимые диапазоны значений характеристик. 
            Красная область - минимальные значения, синяя - максимальные. 
            Темно-зеленая линия показывает текущие значения в выбранный момент времени.
          </p>
        </div>

        <div style={{ height: '600px', marginBottom: '30px' }}>
          <Radar data={radarData} options={radarOptions} />
        </div>

        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#f8f9fa', 
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>
            Статистика характеристик при t = {time.toFixed(2)}
          </h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px'
          }}>
            {currentValues.map((value, index) => {
              const min = minValues[index] || 0;
              const max = maxValues[index] || 1;
              const percentage = ((value - min) / (max - min || 1)) * 100;
              const normalizedPercentage = Math.min(100, Math.max(0, percentage));
              
              let status = '';
              let statusColor = '';
              
              if (normalizedPercentage >= 80) {
                status = 'Отличный';
                statusColor = '#28a745';
              } else if (normalizedPercentage >= 50) {
                status = 'Хороший';
                statusColor = '#17a2b8';
              } else if (normalizedPercentage >= 30) {
                status = 'Средний';
                statusColor = '#ffc107';
              } else {
                status = 'Низкий';
                statusColor = '#dc3545';
              }
              
              return (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                      {characteristicNames[index].split(' - ')[1]}
                    </span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: statusColor,
                      fontSize: '14px'
                    }}>
                      {status}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '5px'
                    }}>
                      <span>Значение: {value.toFixed(3)}</span>
                      <span>{normalizedPercentage.toFixed(1)}% от диапазона</span>
                    </div>
                    
                    <div style={{ 
                      width: '100%', 
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      height: '20px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        left: `${min * 100}%`,
                        width: `${(max - min) * 100}%`,
                        height: '100%',
                        backgroundColor: '#dee2e6',
                        borderLeft: '1px solid #adb5bd',
                        borderRight: '1px solid #adb5bd'
                      }} />
                      
                      <div style={{ 
                        width: `${normalizedPercentage}%`,
                        height: '100%',
                        backgroundColor: statusColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {normalizedPercentage >= 15 ? `${normalizedPercentage.toFixed(0)}%` : ''}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '5px'
                    }}>
                      <span>min: {min.toFixed(2)}</span>
                      <span>max: {max.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarPanel;
