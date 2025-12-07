// @ts-nocheck
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

  // Опции для графиков
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 11
          },
          padding: 10
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Время t',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Значение возмущения',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        min: 0,
        max: 1,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          stepSize: 0.2
        }
      }
    }
  };

  const labels = Array.isArray(results.t) ? results.t.map(t => t.toFixed(2)) : [];

  // Данные для основного графика (все возмущения вместе)
  const mainChartData = {
    labels: labels,
    datasets: results.q.map((trajectory, i) => ({
      label: disturbanceNames[i],
      data: Array.isArray(trajectory) ? trajectory : [],
      borderColor: disturbanceColors[i],
      backgroundColor: disturbanceColors[i] + '20',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointRadius: 1,
      pointHoverRadius: 4
    }))
  };

  // Данные для индивидуальных графиков (по одному на каждое возмущение)
  const individualChartsData = results.q.map((trajectory, i) => ({
    labels: labels,
    datasets: [{
      label: disturbanceNames[i],
      data: Array.isArray(trajectory) ? trajectory : [],
      borderColor: disturbanceColors[i],
      backgroundColor: disturbanceColors[i] + '40',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 2,
      pointHoverRadius: 5
    }]
  }));

  // Статистика по возмущениям
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

  return (
    <div className="tab-content active">
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
          Графики внешних возмущений
        </h2>

        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Внешние возмущения — это факторы, которые влияют на компанию извне и не контролируются напрямую её менеджментом. 
          Эти факторы могут оказывать как положительное, так и отрицательное влияние на различные характеристики компании.
        </p>

        {/* Основной график всех возмущений */}
        <div style={{ 
          marginBottom: '40px', 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 15px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            textAlign: 'center', 
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '15px'
          }}>
            Все внешние возмущения (q1-q5)
          </h3>
          <div style={{ height: '450px' }}>
            <Line 
              data={mainChartData} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    display: true,
                    text: 'Динамика всех внешних возмущений',
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Индивидуальные графики для каждого возмущения */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            marginBottom: '25px', 
            textAlign: 'center', 
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '15px'
          }}>
            Индивидуальные графики возмущений
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '25px'
          }}>
            {results.q.map((_, index) => {
              const stats = calculateStatistics(index);
              
              return (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ 
                    marginBottom: '15px', 
                    color: disturbanceColors[index],
                    textAlign: 'center'
                  }}>
                    {disturbanceNames[index]}
                  </h4>
                  
                  <div style={{ height: '300px', marginBottom: '15px' }}>
                    <Line 
                      data={individualChartsData[index]} 
                      options={{
                        ...commonOptions,
                        plugins: {
                          ...commonOptions.plugins,
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          ...commonOptions.scales,
                          y: {
                            ...commonOptions.scales.y,
                            min: 0,
                            max: 1
                          }
                        }
                      }} 
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    fontSize: '13px'
                  }}>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#666' }}>Среднее</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: disturbanceColors[index] }}>
                        {stats.avg.toFixed(3)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#666' }}>Минимум</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc3545' }}>
                        {stats.min.toFixed(3)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#666' }}>Максимум</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                        {stats.max.toFixed(3)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold', color: '#666' }}>Отклонение</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffc107' }}>
                        {stats.std.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Таблица статистики */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 15px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ 
            marginBottom: '20px', 
            textAlign: 'center', 
            color: '#333',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '15px'
          }}>
            Статистика внешних возмущений
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Возмущение
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Среднее
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Минимум
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Максимум
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Стандартное отклонение
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    Стабильность
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.q.map((_, index) => {
                  const stats = calculateStatistics(index);
                  const stability = stats.std < 0.1 ? 'Высокая' : 
                                 stats.std < 0.2 ? 'Средняя' : 'Низкая';
                  const stabilityColor = stats.std < 0.1 ? '#28a745' : 
                                       stats.std < 0.2 ? '#ffc107' : '#dc3545';
                  
                  return (
                    <tr key={index} style={{ 
                      borderBottom: '1px solid #dee2e6',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}>
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold',
                        color: disturbanceColors[index]
                      }}>
                        {disturbanceNames[index]}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: 'bold'
                      }}>
                        {stats.avg.toFixed(4)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        {stats.min.toFixed(4)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#28a745',
                        fontWeight: 'bold'
                      }}>
                        {stats.max.toFixed(4)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6'
                      }}>
                        {stats.std.toFixed(4)}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: stabilityColor,
                        fontWeight: 'bold'
                      }}>
                        {stability}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Описание возмущений */}
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#e8f4fd', 
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #b6d4fe'
        }}>
          <h4 style={{ marginBottom: '15px', color: '#084298' }}>
            Описание внешних возмущений:
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ color: disturbanceColors[0], marginBottom: '8px' }}>
                q1 - Макроэкономические факторы
              </h5>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Инфляция, курс валют, ключевая ставка ЦБ, ВВП, уровень безработицы, 
                экономические циклы, международные санкции.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ color: disturbanceColors[1], marginBottom: '8px' }}>
                q2 - Рыночные колебания
              </h5>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Колебания спроса, изменение цен конкурентов, появление новых игроков на рынке, 
                изменение цен на сырье и материалы, сезонные колебания.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ color: disturbanceColors[2], marginBottom: '8px' }}>
                q3 - Технологические изменения
              </h5>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Появление новых технологий, устаревание оборудования, цифровизация, 
                автоматизация процессов, кибербезопасность, инновации в отрасли.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ color: disturbanceColors[3], marginBottom: '8px' }}>
                q4 - Регуляторные изменения
              </h5>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Изменения в законодательстве, новые налоги и пошлины, экологические стандарты, 
                требования к качеству продукции, трудовое законодательство.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ color: disturbanceColors[4], marginBottom: '8px' }}>
                q5 - Социальные факторы
              </h5>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                Демографические изменения, культурные тренды, уровень образования, 
                социальная ответственность, здоровый образ жизни, экологическая сознательность.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisturbancesPanel;
