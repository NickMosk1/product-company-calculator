import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphsPanel = ({ results }) => {
  const chartRefs = useRef([]);

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

  // Контрастные цвета для троек
  const colorTriplets = [
    // Первая тройка (L1-L3)
    [
      '#00aeff', // светло-синий (контрастный)
      '#ff7c43', // оранжевый (контрастный)
      '#2f4b7c', // синий (промежуточный)
    ],
    // Вторая тройка (L4-L6)
    [
      '#a05195', // фиолетовый
      '#ffa600', // желтый (контрастный)
      '#d45087', // розовый
    ],
    // Третья тройка (L7-L9)
    [
      '#665191', // пурпурный
      '#f95d6a', // красный
      '#ff7c00', // оранжевый
    ],
    // Четвертая тройка (L10-L12)
    [
      '#00a86b', // зеленый
      '#8a2be2', // сине-фиолетовый
      '#ff4500', // красно-оранжевый
    ],
    // Пятая тройка (L13-L15)
    [
      '#008080', // бирюзовый
      '#ff1493', // глубокий розовый
      '#ffd700', // золотой
    ]
  ];

  // Функция для нахождения максимального значения в данных
  const getMaxValue = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return 1;
    let max = 0;
    dataArray.forEach(data => {
      if (Array.isArray(data)) {
        const localMax = Math.max(...data);
        if (localMax > max) max = localMax;
      }
    });
    return Math.ceil(max * 1.1 * 10) / 10 || 1;
  };

  // Функция для получения опций с адаптивной шкалой Y
  const getAdaptiveOptions = (chartData, chartType = 'L') => {
    const maxY = getMaxValue(chartData.datasets.map(ds => ds.data));
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElements) => {
        const canvas = event.native?.target;
        if (canvas) {
          if (chartElements && chartElements.length > 0) {
            canvas.style.cursor = 'none';
          } else {
            canvas.style.cursor = 'default';
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          titleFont: {
            size: 16,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: '500'
          },
          bodyFont: {
            size: 15,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: '400'
          },
          padding: 16,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            // Кастомная функция для сортировки элементов тултипа
            beforeBody: function(context) {
              // Сортируем элементы по значению в убывающем порядке (от большего к меньшему)
              context.sort((a, b) => {
                const aValue = a.parsed.y;
                const bValue = b.parsed.y;
                return bValue - aValue; // сортировка по убыванию
              });
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Время t',
            font: {
              size: 18,
              weight: 'bold',
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.1)',
            lineWidth: 1
          },
          ticks: {
            font: {
              size: 14,
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Значение',
            font: {
              size: 18,
              weight: 'bold',
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }
          },
          min: 0,
          max: maxY,
          grid: {
            color: 'rgba(0,0,0,0.1)',
            lineWidth: 1
          },
          ticks: {
            font: {
              size: 14,
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            callback: function(value) {
              return value.toFixed(2);
            },
            stepSize: maxY > 1 ? maxY / 5 : 0.2
          }
        }
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
          hitRadius: 10
        },
        line: {
          tension: 0.3
        }
      }
    };
  };

  const labels = Array.isArray(results.t) ? results.t.map(t => t.toFixed(2)) : [];

  // Функция для сортировки данных по последнему значению (конечному значению)
  const sortDatasetsByFinalValue = (datasetsWithIndices) => {
    return datasetsWithIndices.sort((a, b) => {
      const aData = a.data;
      const bData = b.data;
      if (!aData || !bData || aData.length === 0 || bData.length === 0) return 0;
      const aLastValue = aData[aData.length - 1];
      const bLastValue = bData[bData.length - 1];
      return bLastValue - aLastValue; // сортировка по убыванию (чтобы сверху вниз в тултипе)
    });
  };

  // Создаем данные для группы из 3 характеристик
  const createChartData = (tripletIndex, indices) => {
    const colors = colorTriplets[tripletIndex];
    const datasetsWithIndices = [];
    
    indices.forEach((globalIndex, localIndex) => {
      if (globalIndex < results.L.length) {
        datasetsWithIndices.push({
          label: `L${globalIndex + 1}`,
          data: Array.isArray(results.L[globalIndex]) ? results.L[globalIndex] : [],
          borderColor: colors[localIndex],
          backgroundColor: colors[localIndex] + '20',
          borderWidth: 3,
          tension: 0.3,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
          originalIndex: globalIndex,
          colorIndex: localIndex
        });
      }
    });
    
    // Сортируем по последнему значению (по убыванию)
    const sortedDatasets = sortDatasetsByFinalValue(datasetsWithIndices);
    
    return {
      labels: labels,
      datasets: sortedDatasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.borderColor,
        backgroundColor: ds.backgroundColor,
        borderWidth: ds.borderWidth,
        tension: ds.tension,
        fill: ds.fill,
        pointRadius: ds.pointRadius,
        pointHoverRadius: ds.pointHoverRadius
      })),
      originalIndices: sortedDatasets.map(ds => ds.originalIndex),
      originalColors: sortedDatasets.map(ds => ds.borderColor)
    };
  };

  // 5 групп по 3 характеристики
  const chartGroups = [
    {
      title: "Финансовые показатели I",
      indices: [0, 1, 2], // L1, L2, L3
      data: null,
      tripletIndex: 0
    },
    {
      title: "Финансовые показатели II",
      indices: [3, 4, 5], // L4, L5, L6
      data: null,
      tripletIndex: 1
    },
    {
      title: "Операционные показатели I",
      indices: [6, 7, 8], // L7, L8, L9
      data: null,
      tripletIndex: 2
    },
    {
      title: "Операционные показатели II",
      indices: [9, 10, 11], // L10, L11, L12
      data: null,
      tripletIndex: 3
    },
    {
      title: "Качественные показатели",
      indices: [12, 13, 14], // L13, L14, L15
      data: null,
      tripletIndex: 4
    }
  ];

  // Создаем данные для каждой группы
  chartGroups.forEach((group, index) => {
    group.data = createChartData(group.tripletIndex, group.indices);
  });

  // Функция для обработки ссылок на графики
  const handleChartRef = (index) => (ref) => {
    chartRefs.current[index] = ref;
    
    if (ref?.canvas) {
      ref.canvas.style.cursor = 'default';
      ref.canvas.style.pointerEvents = 'auto';
    }
  };

  // Компонент для отображения графика
  const ChartWithLabels = ({ chartData, title, originalIndices, originalColors }) => {
    const chartHeight = 400;
    
    // Получаем отсортированные метки в порядке убывания конечных значений
    const getSortedLabels = () => {
      const labelsWithValues = [];
      chartData.datasets.forEach((dataset, index) => {
        const data = dataset.data;
        if (data && data.length > 0) {
          const lastValue = data[data.length - 1];
          const originalGlobalIndex = originalIndices[index];
          labelsWithValues.push({
            label: `L${originalGlobalIndex + 1}`,
            value: lastValue,
            color: originalColors[index],
            originalIndex: originalGlobalIndex,
            datasetIndex: index
          });
        }
      });
      
      // Сортируем по убыванию (чтобы сверху вниз в тултипе)
      return labelsWithValues.sort((a, b) => b.value - a.value);
    };

    const sortedLabels = getSortedLabels();

    return (
      <div style={{ 
        marginBottom: '40px', 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        border: '3px solid #e9ecef',
        position: 'relative'
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
          {title}
        </h2>
        
        <div style={{ 
          height: `${chartHeight}px`,
          position: 'relative',
          width: '100%'
        }}>
          {/* График */}
          <div style={{ 
            height: '100%',
            position: 'relative',
            zIndex: 20
          }}>
            <Line 
              ref={handleChartRef(originalIndices[0])}
              data={chartData} 
              options={getAdaptiveOptions(chartData, 'L')}
            />
          </div>
        </div>
        
        {/* Детальная легенда с полными названиями */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #e9ecef'
        }}>
          <h4 style={{ 
            textAlign: 'center',
            marginBottom: '10px',
            color: '#2c3e50',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            Подробная информация (отсортировано по убыванию конечных значений)
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px'
          }}>
            {sortedLabels.map((label, idx) => {
              const globalIndex = label.originalIndex;
              const data = results.L[globalIndex];
              const max = data && data.length > 0 ? Math.max(...data).toFixed(3) : '0.000';
              const min = data && data.length > 0 ? Math.min(...data).toFixed(3) : '0.000';
              const avg = data && data.length > 0 
                ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(3) 
                : '0.000';
              const lastValue = data && data.length > 0 ? data[data.length - 1].toFixed(3) : '0.000';
              
              return (
                <div key={idx} style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: `2px solid ${label.color}30`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: label.color,
                      borderRadius: '4px'
                    }}></div>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: '700',
                      color: label.color,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}>
                      {label.label}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#666',
                      marginLeft: 'auto',
                      backgroundColor: '#e9ecef',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      Порядок: {idx + 1}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: '16px', 
                    color: '#555',
                    marginBottom: '15px',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                  }}>
                    {characteristicNames[globalIndex].split(' - ')[1]}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#666' }}>Мин</div>
                      <div style={{ fontWeight: '700', color: '#dc3545' }}>{min}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#666' }}>Ср</div>
                      <div style={{ fontWeight: '700', color: '#17a2b8' }}>{avg}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#666' }}>Макс</div>
                      <div style={{ fontWeight: '700', color: '#28a745' }}>{max}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#666' }}>Конец</div>
                      <div style={{ fontWeight: '700', color: label.color }}>{lastValue}</div>
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

  return (
    <div className="tab-content active">
      <div style={{ padding: '30px' }}>
        {/* 5 графиков по 3 характеристики */}
        {chartGroups.map((group, index) => (
          <ChartWithLabels
            key={index}
            chartData={group.data}
            title={group.title}
            originalIndices={group.data.originalIndices}
            originalColors={group.data.originalColors}
          />
        ))}
      </div>
    </div>
  );
};

export default GraphsPanel;
