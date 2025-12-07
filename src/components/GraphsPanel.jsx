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

  const disturbanceNames = [
    "q1 - Макроэкономические факторы",
    "q2 - Рыночные колебания",
    "q3 - Технологические изменения",
    "q4 - Регуляторные изменения",
    "q5 - Социальные факторы"
  ];

  // Однотонные цвета для лучшей читаемости
  const colors = [
    '#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087',
    '#f95d6a', '#ff7c43', '#ffa600', '#003f5c', '#2f4b7c',
    '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43'
  ];

  const disturbanceColors = [
    '#444e86', '#955196', '#dd5182', '#ff6e54', '#ffa600'
  ];

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
          text: 'Значение',
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

  // Разбиваем характеристики на 3 группы по 5
  const createChartData = (startIndex, endIndex, title) => {
    const datasets = [];
    for (let i = startIndex; i < endIndex; i++) {
      if (i < results.L.length) {
        datasets.push({
          label: characteristicNames[i],
          data: Array.isArray(results.L[i]) ? results.L[i] : [],
          borderColor: colors[i],
          backgroundColor: colors[i] + '20',
          borderWidth: 2,
          tension: 0.4,
          fill: false,
          pointRadius: 1,
          pointHoverRadius: 4
        });
      }
    }
    
    return {
      labels: labels,
      datasets: datasets
    };
  };

  const disturbancesData = {
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

  return (
    <div className="tab-content active">
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
          Графики характеристик компании
        </h2>

        {/* График 1: L1-L5 */}
        <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>
            Финансовые показатели (L1-L5)
          </h3>
          <div style={{ height: '400px' }}>
            <Line 
              data={createChartData(0, 5, 'Финансовые показатели')} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    display: true,
                    text: 'Финансовые показатели (L1-L5)',
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

        {/* График 2: L6-L10 */}
        <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>
            Операционные показатели (L6-L10)
          </h3>
          <div style={{ height: '400px' }}>
            <Line 
              data={createChartData(5, 10, 'Операционные показатели')} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    display: true,
                    text: 'Операционные показатели (L6-L10)',
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

        <div style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>
            Качественные показатели (L11-L15)
          </h3>
          <div style={{ height: '400px' }}>
            <Line 
              data={createChartData(10, 15, 'Качественные показатели')} 
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  title: {
                    display: true,
                    text: 'Качественные показатели (L11-L15)',
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
      </div>
    </div>
  );
};

export default GraphsPanel;
