import { useState, useCallback } from 'react';
import InputsPanel from './InputsPanel';
import GraphsPanel from './GraphsPanel';
import RadarPanel from './RadarPanel';
import { calculateResults } from '../services/calculationService';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const characteristicNames = [
    "Остаток денежных средств",
    "Выручка",
    "Прибыль", 
    "Активы",
    "Численность",
    "Конкурентоспособность",
    "Объем продаж в натуральном выражении",
    "Инновационность",
    "Известность бренда",
    "Материалоемкость",
    "Количество ремонтов",
    "Износ оборудования",
    "Налоги в бюджет",
    "Социальная сфера",
    "Экологичность"
  ];

  const disturbanceNames = [
    "Курс валюты",
    "Санкции",
    "Эпидемия ковид",
    "Штрафы на CO2",
    "Опыт задействованных специалистов"
  ];

  const handleCalculate = useCallback(async (inputData) => {
    setIsCalculating(true);
    try {
      const calculatedResults = await calculateResults(inputData);
      setResults(calculatedResults);
      setActiveTab('graphs');
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Ошибка при расчетах: ' + error.message);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return (
    <div className="calculator">
      <div className="header">
        <h1>Калькулятор характеристик компании</h1>
        <p>Математическая модель для расчета 15 характеристик производственной компании</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'inputs' ? 'active' : ''}`}
          onClick={() => setActiveTab('inputs')}
        >
          Входные параметры
        </button>
        <button 
          className={`tab-button ${activeTab === 'graphs' ? 'active' : ''}`}
          onClick={() => setActiveTab('graphs')}
          disabled={!results}
        >
          Графики характеристик
        </button>
        <button 
          className={`tab-button ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
          disabled={!results}
        >
          Лепестковые диаграммы
        </button>
      </div>

      <div className="tab-content active">
        {activeTab === 'inputs' && (
          <InputsPanel 
            onCalculate={handleCalculate}
            isCalculating={isCalculating}
          />
        )}
        {activeTab === 'graphs' && results && (
          <GraphsPanel 
            results={results}
            characteristicNames={characteristicNames}
            disturbanceNames={disturbanceNames}
          />
        )}
        {activeTab === 'radar' && results && (
          <RadarPanel 
            results={results}
            characteristicNames={characteristicNames}
          />
        )}
      </div>
    </div>
  );
};

export default Calculator;
