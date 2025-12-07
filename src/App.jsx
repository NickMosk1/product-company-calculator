// App.jsx
import { useState } from 'react';
import InputsPanel from './components/InputsPanel';
import GraphsPanel from './components/GraphsPanel';
import RadarPanel from './components/RadarPanel';
import DisturbancesPanel from './components/DisturbancesPanel';
import { calculateResults } from './services/mathModel';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState(null);

  const handleCalculate = async (inputData) => {
    console.log('App: handleCalculate вызван с данными:', inputData);
    
    setIsCalculating(true);
    setError(null);
    setInputData(inputData);
    
    try {
      console.log('App: Вызываю calculateResults...');
      const calculatedResults = await calculateResults(inputData);
      console.log('App: Результаты получены:', calculatedResults);
      
      setResults(calculatedResults);
      setActiveTab('graphs');
      
    } catch (error) {
      console.error('App: Ошибка при расчете:', error);
      setError(`Ошибка при выполнении расчетов: ${error.message}`);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container">
      <h1>Калькулятор характеристик продуктовой компании</h1>
      
      {error && (
        <div style={{
          padding: '10px',
          margin: '10px 20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          ⚠ {error}
        </div>
      )}
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Ввод данных
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
          Лепестковая диаграмма
        </button>
        <button 
          className={`tab-button ${activeTab === 'disturbances' ? 'active' : ''}`}
          onClick={() => setActiveTab('disturbances')}
          disabled={!results}
        >
          График возмущений
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="tab-content active">
          <InputsPanel 
            onCalculate={handleCalculate} 
            isCalculating={isCalculating} 
          />
        </div>
      )}

      {activeTab === 'graphs' && results && (
        <div className="tab-content active">
          <GraphsPanel results={results} />
        </div>
      )}

      {activeTab === 'radar' && results && (
        <div className="tab-content active">
          <RadarPanel results={results} inputData={inputData} />
        </div>
      )}
      
      {activeTab === 'disturbances' && results && (
        <div className="tab-content active">
          <DisturbancesPanel results={results} />
        </div>
      )}
    </div>
  );
};

export default App;
