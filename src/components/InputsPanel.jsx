import { useState, useEffect, useCallback } from 'react';
import './InputsPanel.css';

const InputsPanel = ({ onCalculate, isCalculating }) => {
  const [fCoeffs, setFCoeffs] = useState({});
  const [qCoeffs, setQCoeffs] = useState({});
  const [lParams, setLParams] = useState({});
  const [isValid, setIsValid] = useState(false);

  const generateFArguments = useCallback(() => {
    const args = {};
    
    args[1] = 5;   args[2] = 6;   args[3] = 7;   args[4] = 10;  args[5] = 13;  args[6] = 14;
    args[7] = 3;   args[8] = 12;  args[10] = 14; args[11] = 15;
    args[17] = 14; args[12] = 5;  args[13] = 6;  args[14] = 7;  args[18] = 15; args[15] = 10; args[16] = 13;
    args[25] = 11; args[19] = 1;  args[20] = 5;  args[21] = 6;  args[22] = 7;  args[26] = 14; args[23] = 8;  args[24] = 10; args[27] = 15; args[28] = 9;
    args[29] = 1;  args[30] = 6;  args[31] = 7;  args[32] = 8;  args[33] = 10; args[34] = 11; args[35] = 13; args[36] = 9;
    args[37] = 1;  args[38] = 3;  args[39] = 4;  args[40] = 7;  args[41] = 8;  args[42] = 9;
    args[43] = 4;  args[44] = 6;  args[45] = 13; args[46] = 14; args[47] = 9;
    args[48] = 4;  args[49] = 6;  args[50] = 7;  args[51] = 11; args[52] = 13; args[53] = 15; args[54] = 5;  args[55] = 9;
    args[56] = 3;  args[57] = 6;  args[58] = 4;  args[59] = 5;  args[60] = 7;  args[61] = 8;  args[62] = 10;
    args[63] = 1;  args[64] = 6;  args[65] = 11; args[66] = 12; args[67] = 13; args[68] = 14; args[69] = 9;
    args[70] = 4;  args[71] = 6;  args[72] = 8;  args[73] = 10; args[74] = 13; args[75] = 5;  args[76] = 7;
    args[77] = 2;  args[78] = 3;  args[79] = 4;  args[80] = 9;
    args[81] = 1;  args[82] = 3;  args[83] = 4;  args[84] = 5;  args[85] = 6;  args[86] = 10; args[87] = 14;
    args[88] = 1;  args[89] = 7;  args[90] = 10; args[91] = 13;
    args[92] = 2;  args[93] = 3;  args[94] = 4;  args[95] = 6;  args[96] = 8;  args[97] = 9;  args[98] = 11;
    
    for (let j = 1; j <= 98; j++) {
      if (!args[j]) args[j] = 1;
    }
    
    return args;
  }, []);

  const [fArguments] = useState(generateFArguments());

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    const initialFCoeffs = {};
    for (let j = 1; j <= 98; j++) {
      initialFCoeffs[`f${j}_a`] = '';
      initialFCoeffs[`f${j}_b`] = '';
      initialFCoeffs[`f${j}_c`] = '';
      initialFCoeffs[`f${j}_d`] = '';
    }
    setFCoeffs(initialFCoeffs);

    const initialQCoeffs = {};
    for (let k = 1; k <= 5; k++) {
      initialQCoeffs[`q${k}_a`] = '';
      initialQCoeffs[`q${k}_b`] = '';
      initialQCoeffs[`q${k}_c`] = '';
      initialQCoeffs[`q${k}_d`] = '';
    }
    setQCoeffs(initialQCoeffs);

    const initialLParams = {};
    for (let i = 1; i <= 15; i++) {
      initialLParams[`l${i}_min`] = '';
      initialLParams[`l${i}_init`] = '';
      initialLParams[`l${i}_max`] = '';
    }
    setLParams(initialLParams);
  };

  useEffect(() => {
    validateAll();
  }, [fCoeffs, qCoeffs, lParams]);

  const validateAll = () => {
    let valid = true;

    for (let j = 1; j <= 98 && valid; j++) {
      if (!isValidCoefficient(`f${j}_a`) || !isValidCoefficient(`f${j}_b`) ||
          !isValidCoefficient(`f${j}_c`) || !isValidCoefficient(`f${j}_d`)) {
        valid = false;
      }
    }

    for (let k = 1; k <= 5 && valid; k++) {
      if (!isValidCoefficient(`q${k}_a`) || !isValidCoefficient(`q${k}_b`) ||
          !isValidCoefficient(`q${k}_c`) || !isValidCoefficient(`q${k}_d`)) {
        valid = false;
      }
    }

    for (let i = 1; i <= 15 && valid; i++) {
      const min = parseFloat(lParams[`l${i}_min`]);
      const init = parseFloat(lParams[`l${i}_init`]);
      const max = parseFloat(lParams[`l${i}_max`]);
      
      if (isNaN(min) || isNaN(init) || isNaN(max) || 
          min < 0 || min > 1 || init < 0 || init > 1 || max < 0 || max > 1 ||
          min > init || init > max) {
        valid = false;
      }
    }

    setIsValid(valid);
  };

  const isValidCoefficient = (id) => {
    const value = parseFloat(fCoeffs[id] || qCoeffs[id]);
    return !isNaN(value) && isFinite(value);
  };

  const handleInputChange = (type, id, value) => {
    if (type === 'f') {
      setFCoeffs(prev => ({ ...prev, [id]: value }));
    } else if (type === 'q') {
      setQCoeffs(prev => ({ ...prev, [id]: value }));
    } else if (type === 'l') {
      setLParams(prev => ({ ...prev, [id]: value }));
    }
  };

  const fillRandomValues = () => {
    const newFCoeffs = {};
    for (let j = 1; j <= 98; j++) {
      newFCoeffs[`f${j}_a`] = (Math.random() * 2 - 1).toFixed(2);
      newFCoeffs[`f${j}_b`] = (Math.random() * 2 - 1).toFixed(2);
      newFCoeffs[`f${j}_c`] = (Math.random() * 2 - 1).toFixed(2);
      newFCoeffs[`f${j}_d`] = (Math.random() * 2 - 1).toFixed(2);
    }
    setFCoeffs(newFCoeffs);

    const newQCoeffs = {};
    for (let k = 1; k <= 5; k++) {
      newQCoeffs[`q${k}_a`] = (Math.random() * 0.1).toFixed(3);
      newQCoeffs[`q${k}_b`] = (Math.random() * 0.1).toFixed(3);
      newQCoeffs[`q${k}_c`] = (Math.random() * 0.2).toFixed(3);
      newQCoeffs[`q${k}_d`] = (Math.random() * 0.5).toFixed(3);
    }
    setQCoeffs(newQCoeffs);

    const newLParams = {};
    for (let i = 1; i <= 15; i++) {
      const min = Math.random() * 0.3;
      const init = min + Math.random() * (0.7 - min);
      const max = init + Math.random() * (1 - init);
      
      newLParams[`l${i}_min`] = min.toFixed(2);
      newLParams[`l${i}_init`] = init.toFixed(2);
      newLParams[`l${i}_max`] = max.toFixed(2);
    }
    setLParams(newLParams);
  };

  const handleCalculate = () => {
    if (!isValid) return;

    const inputData = {
      l_params: collectLParams(),
      f_coeffs: collectFCoeffs(),
      q_coeffs: collectQCoeffs(),
      t_span: [0, 1],
      num_points: 100
    };

    onCalculate(inputData);
  };

  const collectLParams = () => {
    const params = [];
    for (let i = 1; i <= 15; i++) {
      params.push({
        min: parseFloat(lParams[`l${i}_min`]),
        init: parseFloat(lParams[`l${i}_init`]),
        max: parseFloat(lParams[`l${i}_max`])
      });
    }
    return params;
  };

  const collectFCoeffs = () => {
    const coeffs = [];
    for (let j = 1; j <= 98; j++) {
      coeffs.push({
        a: parseFloat(fCoeffs[`f${j}_a`]),
        b: parseFloat(fCoeffs[`f${j}_b`]),
        c: parseFloat(fCoeffs[`f${j}_c`]),
        d: parseFloat(fCoeffs[`f${j}_d`]),
        l_index: fArguments[j]
      });
    }
    return coeffs;
  };

  const collectQCoeffs = () => {
    const coeffs = [];
    for (let k = 1; k <= 5; k++) {
      coeffs.push({
        a: parseFloat(qCoeffs[`q${k}_a`]),
        b: parseFloat(qCoeffs[`q${k}_b`]),
        c: parseFloat(qCoeffs[`q${k}_c`]),
        d: parseFloat(qCoeffs[`q${k}_d`])
      });
    }
    return coeffs;
  };

  const fillGoodValues = () => {
    console.log('Заполнение нормальными значениями...');
    
    // Хорошие коэффициенты для f (близкие к 0.1-0.3)
    const newFCoeffs = {};
    for (let j = 1; j <= 98; j++) {
      newFCoeffs[`f${j}_a`] = (Math.random() * 0.1 - 0.05).toFixed(3);
      newFCoeffs[`f${j}_b`] = (Math.random() * 0.2 - 0.1).toFixed(3);
      newFCoeffs[`f${j}_c`] = (Math.random() * 0.3 - 0.15).toFixed(3);
      newFCoeffs[`f${j}_d`] = (Math.random() * 0.1 + 0.1).toFixed(3); // положительный сдвиг
    }
    setFCoeffs(newFCoeffs);

    // Маленькие значения для q (возмущения)
    const newQCoeffs = {};
    for (let k = 1; k <= 5; k++) {
      newQCoeffs[`q${k}_a`] = (Math.random() * 0.05 - 0.025).toFixed(4);
      newQCoeffs[`q${k}_b`] = (Math.random() * 0.05 - 0.025).toFixed(4);
      newQCoeffs[`q${k}_c`] = (Math.random() * 0.1 - 0.05).toFixed(4);
      newQCoeffs[`q${k}_d`] = (Math.random() * 0.05 + 0.05).toFixed(4); // положительный сдвиг
    }
    setQCoeffs(newQCoeffs);

    // Реалистичные значения для L
    const newLParams = {};
    for (let i = 1; i <= 15; i++) {
      const min = (Math.random() * 0.2).toFixed(2); // 0-0.2
      const init = (Math.random() * 0.3 + 0.3).toFixed(2); // 0.3-0.6
      const max = (Math.random() * 0.3 + 0.7).toFixed(2); // 0.7-1.0
      
      newLParams[`l${i}_min`] = min;
      newLParams[`l${i}_init`] = init;
      newLParams[`l${i}_max`] = max;
    }
    setLParams(newLParams);
    
    setDebugInfo('Заполнено нормальными значениями');
  };

  const characteristicNames = [
    "L1 - Остаток денежных средств", "L2 - Выручка", "L3 - Прибыль", "L4 - Активы", "L5 - Численность",
    "L6 - Конкурентоспособность", "L7 - Объем продаж в натуральном выражении", "L8 - Инновационность",
    "L9 - Известность бренда", "L10 - Материалоемкость", "L11 - Количество ремонтов", "L12 - Износ оборудования",
    "L13 - Налоги в бюджет", "L14 - Социальная сфера", "L15 - Экологичность"
  ];

  return (
    <div className="tab-content active">
      <div className="widgets-container">
        <div className="widget">
          <h3>Полиномы f<sub>j</sub>(L<sub>i</sub>)</h3>
          <div className="scrollable-list" id="f-polynomials-list">
            {Array.from({ length: 98 }, (_, j) => {
              const funcNum = j + 1;
              const argIndex = fArguments[funcNum];
              return (
                <div key={j} className="polynomial-item">
                  f<sub>{funcNum}</sub>(L<sub>{argIndex}</sub>) = 
                  <input
                    type="number"
                    step="0.01"
                    className="coefficient-input"
                    value={fCoeffs[`f${funcNum}_a`] || ''}
                    onChange={(e) => handleInputChange('f', `f${funcNum}_a`, e.target.value)}
                    placeholder="a"
                  />
                  × (L<sub>{argIndex}</sub>)³ + 
                  <input
                    type="number"
                    step="0.01"
                    className="coefficient-input"
                    value={fCoeffs[`f${funcNum}_b`] || ''}
                    onChange={(e) => handleInputChange('f', `f${funcNum}_b`, e.target.value)}
                    placeholder="b"
                  />
                  × (L<sub>{argIndex}</sub>)² + 
                  <input
                    type="number"
                    step="0.01"
                    className="coefficient-input"
                    value={fCoeffs[`f${funcNum}_c`] || ''}
                    onChange={(e) => handleInputChange('f', `f${funcNum}_c`, e.target.value)}
                    placeholder="c"
                  />
                  × L<sub>{argIndex}</sub> + 
                  <input
                    type="number"
                    step="0.01"
                    className="coefficient-input"
                    value={fCoeffs[`f${funcNum}_d`] || ''}
                    onChange={(e) => handleInputChange('f', `f${funcNum}_d`, e.target.value)}
                    placeholder="d"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="widget">
          <h3>Возмущения q<sub>k</sub>(t)</h3>
          <div className="scrollable-list" id="q-polynomials-list">
            {Array.from({ length: 5 }, (_, k) => {
              const disturbNum = k + 1;
              return (
                <div key={k} className="polynomial-item">
                  q<sub>{disturbNum}</sub>(t) = 
                  <input
                    type="number"
                    step="0.001"
                    className="coefficient-input"
                    value={qCoeffs[`q${disturbNum}_a`] || ''}
                    onChange={(e) => handleInputChange('q', `q${disturbNum}_a`, e.target.value)}
                    placeholder="a"
                  />
                  × t³ + 
                  <input
                    type="number"
                    step="0.001"
                    className="coefficient-input"
                    value={qCoeffs[`q${disturbNum}_b`] || ''}
                    onChange={(e) => handleInputChange('q', `q${disturbNum}_b`, e.target.value)}
                    placeholder="b"
                  />
                  × t² + 
                  <input
                    type="number"
                    step="0.001"
                    className="coefficient-input"
                    value={qCoeffs[`q${disturbNum}_c`] || ''}
                    onChange={(e) => handleInputChange('q', `q${disturbNum}_c`, e.target.value)}
                    placeholder="c"
                  />
                  × t + 
                  <input
                    type="number"
                    step="0.001"
                    className="coefficient-input"
                    value={qCoeffs[`q${disturbNum}_d`] || ''}
                    onChange={(e) => handleInputChange('q', `q${disturbNum}_d`, e.target.value)}
                    placeholder="d"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="widget">
          <h3>Параметры характеристик L<sub>i</sub></h3>
          <div className="l-params-container">
            <div className="characteristics-names">
              <h4>Характеристики</h4>
              {characteristicNames.map((name, index) => (
                <div key={index} className="characteristic-name-item">
                  {name}
                </div>
              ))}
            </div>
            
            <div className="params-column">
              <h4>Мин</h4>
              {Array.from({ length: 15 }, (_, i) => (
                <div key={`min${i}`} className="l-param-item">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={lParams[`l${i+1}_min`] || ''}
                    onChange={(e) => handleInputChange('l', `l${i+1}_min`, e.target.value)}
                    placeholder="0.0-1.0"
                  />
                </div>
              ))}
            </div>
            
            <div className="params-column">
              <h4>Нач</h4>
              {Array.from({ length: 15 }, (_, i) => (
                <div key={`init${i}`} className="l-param-item">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={lParams[`l${i+1}_init`] || ''}
                    onChange={(e) => handleInputChange('l', `l${i+1}_init`, e.target.value)}
                    placeholder="0.0-1.0"
                  />
                </div>
              ))}
            </div>
            
            <div className="params-column">
              <h4>Макс</h4>
              {Array.from({ length: 15 }, (_, i) => (
                <div key={`max${i}`} className="l-param-item">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={lParams[`l${i+1}_max`] || ''}
                    onChange={(e) => handleInputChange('l', `l${i+1}_max`, e.target.value)}
                    placeholder="0.0-1.0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="widget control-widget">
          <div className="control-content">
            <h3>Управление расчетами</h3>
            <div className="control-buttons">
              <button 
                id="calculate-btn" 
                className="btn primary" 
                onClick={handleCalculate}
                disabled={!isValid || isCalculating}
              >
                {isCalculating ? 'Расчет...' : 'Провести расчеты'}
              </button>
              <button 
                id="random-btn" 
                className="btn secondary"
                onClick={fillRandomValues}
              >
                Случайные значения
              </button>
              <button 
                className="btn btn-secondary"
                onClick={fillGoodValues}
              >
                Нормальные значения
              </button>
              <div className={`validation-status ${isValid ? 'valid' : ''}`} id="validation-status">
                <span className="status-icon">{isValid ? '✓' : '⚠'}</span>
                <span className="status-text">
                  {isValid ? 'Все поля заполнены корректно' : 'Заполните все поля корректными значениями'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputsPanel;
