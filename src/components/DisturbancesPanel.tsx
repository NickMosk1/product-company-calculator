// @ts-nocheck
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

const DisturbancesPanel = ({ results }) => {
  const chartRefs = useRef([]);

  if (!results || !results.t || !results.q) {
    return (
      <div className="tab-content active">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>Графики внешних возмущений</h3>
          <p>Нет данных для отображения. Выполните расчеты на вкладке "Ввод данных".</p>
        </div>
      </div>
    );
  }

  const disturbanceNames = [
    "q1 - Макроэкономические факторы",
    "q2 - Рыночные колебания",
    "q3 - Технологические изменения",
    "q4 - Регуляторные изменения",
    "q5 - Социальные факторы"
  ];

  const disturbanceColors = [
    '#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087'
  ];

  const getMaxValue = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 1;
    const max = Math.max(...data);
    return Math.ceil(max * 1.1 * 10) / 10 || 1;
  };

  const getAdaptiveOptions = (index, isMainChart = false) => {
    let maxY = 1;
    
    if (isMainChart) {
      const allMaxValues = results.q.map(trajectory => 
        Array.isArray(trajectory) ? Math.max(...trajectory) : 0
      );
      maxY = Math.max(...allMaxValues, 0.1);
      maxY = Math.ceil(maxY * 1.1 * 10) / 10 || 1;
    } else {
      const trajectory = results.q[index];
      if (Array.isArray(trajectory)) {
        maxY = Math.max(...trajectory);
        maxY = Math.ceil(maxY * 1.1 * 10) / 10 || 1;
      }
    }

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
          display: isMainChart,
          position: 'top',
          labels: {
            usePointStyle: true,
            font: {
              size: 14,
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            padding: 15
          }
        },
        title: {
          display: true,
          text: isMainChart ? 'Динамика всех внешних возмущений' : '',
          font: {
            size: isMainChart ? 24 : 0,
            weight: 'bold',
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          },
          color: isMainChart ? '#2c3e50' : disturbanceColors[index],
          padding: {
            top: 10,
            bottom: 30
          }
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
            text: 'Значение возмущения',
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

  const mainChartData = {
    labels: labels,
    datasets: results.q.map((trajectory, i) => ({
      label: `q${i + 1}`,
      data: Array.isArray(trajectory) ? trajectory : [],
      borderColor: disturbanceColors[i],
      backgroundColor: disturbanceColors[i] + '20',
      borderWidth: 3,
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 6
    }))
  };

  const individualChartsData = results.q.map((trajectory, i) => ({
    labels: labels,
    datasets: [{
      label: `q${i + 1}`,
      data: Array.isArray(trajectory) ? trajectory : [],
      borderColor: disturbanceColors[i],
      backgroundColor: disturbanceColors[i] + '20',
      borderWidth: 4,
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 7
    }]
  }));

  const calculateStatistics = (index) => {
    const data = results.q[index] || [];
    if (data.length === 0) return { avg: 0, min: 0, max: 0, std: 0 };
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    const variance = data.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / data.length;
    const std = Math.sqrt(variance);
    
    return { avg, min, max, std };
  };

  const handleChartRef = (index) => (ref) => {
    chartRefs.current[index] = ref;
    
    if (ref?.canvas) {
      ref.canvas.style.cursor = 'default';
      ref.canvas.style.pointerEvents = 'auto';
    }
  };

  return (
    <div className="tab-content active">
      <div style={{ padding: '30px' }}>

        <div style={{ 
          marginBottom: '60px', 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '15px', 
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          border: '3px solid #e9ecef'
        }}>
          <div style={{ height: '600px' }}>
            <Line 
              ref={handleChartRef('main')}
              data={mainChartData} 
              options={getAdaptiveOptions(0, true)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            marginBottom: '40px', 
            textAlign: 'center', 
            color: '#2c3e50',
            fontSize: '32px',
            fontWeight: '700',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            borderBottom: '3px solid #f0f0f0',
            paddingBottom: '20px'
          }}>
            Индивидуальные графики возмущений
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
            gap: '40px'
          }}>
            {results.q.map((_, index) => {
              const stats = calculateStatistics(index);
              
              return (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '15px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  border: `3px solid ${disturbanceColors[index] + '30'}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      fontSize: '80px',
                      fontWeight: '900',
                      color: disturbanceColors[index] + '20',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      textAlign: 'center',
                      userSelect: 'none'
                    }}>
                      q{index + 1}
                    </div>
                  </div>

                  <div style={{ 
                    height: '500px', 
                    marginBottom: '25px',
                    position: 'relative',
                    zIndex: 20
                  }}>
                    <Line 
                      ref={handleChartRef(index)}
                      data={individualChartsData[index]} 
                      options={getAdaptiveOptions(index, false)}
                    />
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    position: 'relative',
                    zIndex: 20
                  }}>
                    <h4 style={{ 
                      marginBottom: '15px', 
                      textAlign: 'center',
                      fontSize: '20px',
                      fontWeight: '600',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      color: '#2c3e50'
                    }}>
                      Статистика для q{index + 1}
                    </h4>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px',
                      width: '100%',
                      fontSize: '16px'
                    }}>
                      <div style={{ 
                        backgroundColor: 'white', 
                        width: '100%',
                        padding: '15px', 
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '2px solid #e9ecef'
                      }}>
                        <div style={{ fontWeight: '600', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                          Минимум
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc3545' }}>
                          {stats.min.toFixed(3)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: 'white', 
                        width: '100%',
                        padding: '15px', 
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '2px solid #e9ecef'
                      }}>
                        <div style={{ fontWeight: '600', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                          Максимум
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#28a745' }}>
                          {stats.max.toFixed(3)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: 'white', 
                        width: '100%',
                        padding: '15px', 
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '2px solid #e9ecef'
                      }}>
                        <div style={{ fontWeight: '600', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                          Среднее
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#17a2b8' }}>
                          {stats.avg.toFixed(3)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginTop: '20px',
                      padding: '15px',
                      backgroundColor: disturbanceColors[index] + '10',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: disturbanceColors[index],
                      textAlign: 'center',
                      fontWeight: '600',
                      border: `1px solid ${disturbanceColors[index] + '30'}`
                    }}>
                      {disturbanceNames[index]}
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

export default DisturbancesPanel;
