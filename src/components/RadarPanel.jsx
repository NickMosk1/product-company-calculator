import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarPanel = ({ results, inputData }) => {
  const [minValues, setMinValues] = useState(new Array(15).fill(0));
  const [maxValues, setMaxValues] = useState(new Array(15).fill(1));
  const chartRefs = useRef([]);

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

  const timeValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  if (!results || !results.t || !results.L) {
    return (
      <div className="tab-content active">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#2c3e50' }}>
            Лепестковые диаграммы характеристик
          </h2>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Нет данных для отображения. Выполните расчеты на вкладке "Ввод данных".
          </p>
        </div>
      </div>
    );
  }

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

  const getValuesForTime = (timeValue) => {
    const timeIndex = findTimeIndex(timeValue);
    return results.L.map((trajectory, i) => {
      if (!Array.isArray(trajectory) || trajectory.length <= timeIndex) {
        return minValues[i] || 0;
      }
      const value = trajectory[timeIndex];
      return isFinite(value) ? value : minValues[i] || 0;
    });
  };

  const getRadarDataForTime = (timeValue) => {
    const currentValues = getValuesForTime(timeValue);
    
    return {
      labels: characteristicNames.map(name => {
        const shortName = name.split(' - ')[1] || name;
        return shortName;
      }),
      datasets: [
        {
          label: 'Минимальные значения',
          data: minValues,
          backgroundColor: 'rgba(255, 99, 132, 0.15)',
          borderColor: 'rgba(255, 99, 132, 0.4)',
          pointBackgroundColor: 'rgba(255, 99, 132, 0.4)',
          pointBorderColor: '#fff',
          borderWidth: 1.5,
          pointRadius: 1.5,
          pointHoverRadius: 2,
          fill: true
        },
        {
          label: 'Максимальные значения',
          data: maxValues,
          backgroundColor: 'rgba(54, 162, 235, 0.15)',
          borderColor: 'rgba(54, 162, 235, 0.4)',
          pointBackgroundColor: 'rgba(54, 162, 235, 0.4)',
          pointBorderColor: '#fff',
          borderWidth: 1.5,
          pointRadius: 1.5,
          pointHoverRadius: 2,
          fill: true
        },
        {
          label: `t = ${timeValue.toFixed(1)}`,
          data: currentValues,
          backgroundColor: 'rgba(75, 192, 192, 0.25)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 5,
          fill: false
        }
      ]
    };
  };

  const radarOptions = {
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
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.2)',
          lineWidth: 1.5
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.15)',
          lineWidth: 1.5
        },
        suggestedMin: 0,
        suggestedMax: 1,
        ticks: {
          display: true,
          stepSize: 0.2,
          font: {
            size: 16,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: '500'
          },
          color: '#444',
          backdropColor: 'transparent',
          z: 10,
          padding: 8
        },
        pointLabels: {
          font: {
            size: 18,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: '600'
          },
          color: '#2c3e50',
          padding: 20,
          backdropColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 6
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 18,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: '500'
          },
          padding: 20,
          boxWidth: 16,
          boxHeight: 16
        },
        onHover: () => {
          return;
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
        callbacks: {
          label: (context) => {
            const value = context.parsed.r.toFixed(3);
            const charIndex = context.dataIndex;
            const charName = characteristicNames[charIndex]?.split(' - ')[1] || `L${charIndex + 1}`;
            const min = minValues[charIndex] || 0;
            const max = maxValues[charIndex] || 1;
            return `${value} (мин: ${min.toFixed(2)}, макс: ${max.toFixed(2)})`;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        hoverBorderColor: '#fff',
        hoverBorderWidth: 3
      }
    },
    interaction: {
      intersect: true,
      mode: 'nearest'
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
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
      <div style={{ 
        padding: '20px 40px 40px 40px',
        maxWidth: '100%',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          {timeValues.map((timeValue, index) => (
            <div key={timeValue} style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              border: '3px solid #e9ecef',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              width: '100%',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
            }}
            >
              <h2 style={{
                textAlign: 'center',
                marginBottom: '25px',
                color: '#2c3e50',
                fontSize: '32px',
                fontWeight: '700',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                paddingBottom: '15px',
                borderBottom: '3px solid #f0f0f0'
              }}>
                Время t = {timeValue.toFixed(1)}
              </h2>
              <div style={{ 
                height: '550px',
                width: '100%',
                position: 'relative'
              }}>
                <Radar 
                  ref={handleChartRef(index)}
                  data={getRadarDataForTime(timeValue)} 
                  options={radarOptions} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarPanel;
