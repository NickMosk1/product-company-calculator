import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ReferenceLine
} from 'recharts';

const GraphsPanel = ({ results }) => {
  if (!results || !results.t || !results.L) {
    return (
      <div className="tab-content active">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Графики характеристик</h3>
          <p>Нет данных для отображения. Выполните расчеты на вкладке "Ввод данных".</p>
        </div>
      </div>
    );
  }

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

  // Цвета для линий
  const lineColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5'
  ];

  // Создаем массив данных для графиков
  const prepareChartData = () => {
    const data = [];
    const numPoints = results.t.length;
    
    for (let i = 0; i < numPoints; i++) {
      const point = {
        t: results.t[i],
        time: results.t[i]
      };
      
      // Добавляем все L значения
      results.L.forEach((LArray, index) => {
        if (LArray && LArray[i] !== undefined) {
          point[`L${index + 1}`] = LArray[i];
        }
      });
      
      data.push(point);
    }
    
    return data;
  };

  const chartData = prepareChartData();

  // Группы графиков
  const chartGroups = [
    {
      title: "Финансовые показатели I",
      indices: [0, 1, 2], // L1, L2, L3
      colorIndex: 0
    },
    {
      title: "Финансовые показатели II",
      indices: [3, 4, 5], // L4, L5, L6
      colorIndex: 3
    },
    {
      title: "Операционные показатели I",
      indices: [6, 7, 8], // L7, L8, L9
      colorIndex: 6
    },
    {
      title: "Операционные показатели II",
      indices: [9, 10, 11], // L10, L11, L12
      colorIndex: 9
    },
    {
      title: "Качественные показатели",
      indices: [12, 13, 14], // L13, L14, L15
      colorIndex: 12
    }
  ];

  // Кастомный Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Сортируем по значению (убывание)
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '2px solid #ccc',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '250px'
        }}>
          <p style={{ 
            marginBottom: '10px', 
            fontWeight: 'bold',
            color: '#2c3e50',
            borderBottom: '2px solid #eee',
            paddingBottom: '5px',
            fontSize: '14px'
          }}>
            Время: <strong>{label.toFixed(3)}</strong>
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px'
          }}>
            {sortedPayload.map((entry, index) => {
              const fullName = characteristicNames[parseInt(entry.dataKey.substring(1)) - 1];
              const shortName = fullName.split(' - ')[0];
              const description = fullName.split(' - ')[1];
              
              return (
                <div key={`item-${index}`} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: entry.color,
                      borderRadius: '2px'
                    }} />
                    <span style={{ 
                      fontWeight: 'bold',
                      color: entry.color,
                      minWidth: '40px',
                      fontSize: '13px'
                    }}>
                      {shortName}
                    </span>
                  </div>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    fontSize: '13px'
                  }}>
                    {entry.value.toFixed(4)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Компонент графика для группы
  const ChartGroup = ({ group, data }) => {
    const lines = useMemo(() => {
      return group.indices.map((index) => ({
        index,
        name: `L${index + 1}`,
        color: lineColors[index],
        fullName: characteristicNames[index]
      }));
    }, [group.indices]);

    // Находим средние точки для каждой линии для подписей
    const getMidPoints = () => {
      if (!data || data.length === 0) return [];
      
      const midIndex = Math.floor(data.length / 2);
      return lines.map(line => ({
        ...line,
        x: midIndex,
        y: data[midIndex] ? data[midIndex][line.name] : 0
      }));
    };

    const midPoints = getMidPoints();

    // Находим последние точки для каждой линии
    const getLastPoints = () => {
      if (!data || data.length === 0) return [];
      
      return lines.map(line => {
        const lastPoint = data[data.length - 1];
        return {
          ...line,
          value: lastPoint[line.name],
          x: data.length - 1
        };
      });
    };

    const lastPoints = getLastPoints();

    return (
      <div style={{ 
        marginBottom: '40px', 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        border: '3px solid #e9ecef'
      }}>
        <h2 style={{ 
          marginBottom: '25px', 
          textAlign: 'center', 
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '700',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          paddingBottom: '15px',
          borderBottom: '3px solid #f0f0f0'
        }}>
          {group.title}
        </h2>
        
        <div style={{ height: '500px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 30,
                right: 30,
                left: 30,
                bottom: 30,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis 
                dataKey="t"
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                tickFormatter={(value) => value.toFixed(1)}
                label={{ 
                  value: 'Время t', 
                  position: 'bottom',
                  offset: 10,
                  style: { fontSize: 14, fontWeight: 'bold' }
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: 'Значение', 
                  angle: -90, 
                  position: 'left',
                  offset: 15,
                  style: { fontSize: 14, fontWeight: 'bold' }
                }}
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top"
                height={50}
                iconSize={12}
                iconType="circle"
                formatter={(value) => {
                  const index = parseInt(value.substring(1)) - 1;
                  return `${value} - ${characteristicNames[index].split(' - ')[1]}`;
                }}
              />
              
              {/* Линии */}
              {lines.map((line) => (
                <Line
                  key={line.name}
                  type="monotone"
                  dataKey={line.name}
                  stroke={line.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Статистика по группе */}
        <div style={{
          marginTop: '30px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #e9ecef'
        }}>
          <h4 style={{ 
            textAlign: 'center',
            marginBottom: '15px',
            color: '#2c3e50',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            Статистика по показателям (отсортировано по убыванию конечных значений)
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px'
          }}>
            {lastPoints
              .sort((a, b) => b.value - a.value)
              .map((point, idx) => {
                const LArray = results.L[point.index];
                const values = LArray || [];
                const max = values.length > 0 ? Math.max(...values).toFixed(4) : '0.0000';
                const min = values.length > 0 ? Math.min(...values).toFixed(4) : '0.0000';
                const avg = values.length > 0 
                  ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(4) 
                  : '0.0000';
                
                return (
                  <div key={idx} style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${point.color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: point.color,
                        borderRadius: '4px'
                      }}></div>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: '700',
                        color: point.color,
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                      }}>
                        {point.name}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#555',
                      marginBottom: '15px',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontStyle: 'italic'
                    }}>
                      {characteristicNames[point.index].split(' - ')[1]}
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      fontSize: '13px'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#666' }}>Минимальное:</div>
                        <div style={{ fontWeight: '700', color: '#dc3545' }}>{min}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#666' }}>Максимальное:</div>
                        <div style={{ fontWeight: '700', color: '#28a745' }}>{max}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // Вспомогательная функция для получения максимального Y значения
  const getMaxYValue = (data, lines) => {
    if (!data || data.length === 0) return 1;
    
    let max = 0;
    lines.forEach(line => {
      data.forEach(point => {
        if (point[line.name] > max) {
          max = point[line.name];
        }
      });
    });
    
    return max || 1;
  };

  return (
    <div className="tab-content active">
      <div style={{ padding: '30px' }}>
        {chartGroups.map((group, index) => (
          <ChartGroup
            key={index}
            group={group}
            data={chartData}
          />
        ))}
      </div>
    </div>
  );
};

export default GraphsPanel;
