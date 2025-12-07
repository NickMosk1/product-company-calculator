// services/mathModel.js
class ProductCompanyModelJS {
    constructor() {
        // Параметры L_i: min, init, max (индексы 0-14 для L1-L15)
        this.L_min = new Array(15).fill(0);
        this.L_init = new Array(15).fill(0);
        this.L_max = new Array(15).fill(1);
        
        // Коэффициенты для f_j: {j: {a, b, c, d, idx}}
        this.f_coeffs = {};
        
        // Коэффициенты для q_k: {k: {a, b, c, d}}
        this.q_coeffs = {};
    }
    
    set_L_params(i, min_val, init_val, max_val) {
        this.L_min[i-1] = min_val;
        this.L_init[i-1] = init_val;
        this.L_max[i-1] = max_val;
    }
    
    set_f_poly(j, a, b, c, d, L_index) {
        this.f_coeffs[j] = { a, b, c, d, idx: L_index-1 };
    }
    
    set_q_poly(k, a, b, c, d) {
        this.q_coeffs[k] = { a, b, c, d };
    }
    
    compute_f(j, L) {
        if (!this.f_coeffs[j]) return 1.0;
        const { a, b, c, d, idx } = this.f_coeffs[j];
        const L_val = L[idx];
        return a * Math.pow(L_val, 3) + b * Math.pow(L_val, 2) + c * L_val + d;
    }
    
    compute_q_raw(k, t) {
        if (!this.q_coeffs[k]) return 0.0;
        const { a, b, c, d } = this.q_coeffs[k];
        return a * Math.pow(t, 3) + b * Math.pow(t, 2) + c * t + d;
    }
    
    compute_q_normalized(k, t, q_global_max) {
        const raw_value = this.compute_q_raw(k, t);
        return q_global_max > 0 
            ? Math.max(0.0, Math.min(1.0, raw_value / q_global_max))
            : 0.0;
    }
    
    // Новая функция для нормировки с правильной логикой
    rhs_normalized(t, L, q_global_max, L_global_max) {
        const dLdt = new Array(15).fill(0);
        
        // Вычисляем все q_k(t) как скаляры (с нормировкой)
        const q = [1, 2, 3, 4, 5].map(k => this.compute_q_normalized(k, t, q_global_max));
        
        // Все уравнения с нормировкой
        dLdt[0] = (1.0 / L_global_max) * (
            this.compute_f(1, L) * this.compute_f(2, L) * this.compute_f(3, L) * 
            this.compute_f(4, L) * this.compute_f(5, L) * this.compute_f(6, L) * 
            (q[0] + q[1]) - q[2]
        );
        
        dLdt[1] = (1.0 / L_global_max) * (
            this.compute_f(7, L) * this.compute_f(8, L) * L[12] * 
            this.compute_f(10, L) * this.compute_f(11, L) * (q[1] + q[4]) - 
            q[3]
        );
        
        dLdt[2] = (1.0 / L_global_max) * (
            this.compute_f(17, L) * this.compute_f(12, L) * this.compute_f(13, L) * 
            this.compute_f(14, L) * this.compute_f(18, L) * this.compute_f(15, L) * 
            this.compute_f(16, L) * q[1] - q[4]
        );
        
        dLdt[3] = (1.0 / L_global_max) * (
            this.compute_f(25, L) * this.compute_f(19, L) * this.compute_f(20, L) * 
            this.compute_f(21, L) * this.compute_f(22, L) * this.compute_f(26, L) * 
            this.compute_f(23, L) * this.compute_f(24, L) * this.compute_f(27, L) * 
            q[1] - this.compute_f(28, L)
        );
        
        dLdt[4] = (1.0 / L_global_max) * (
            this.compute_f(29, L) * this.compute_f(30, L) * this.compute_f(31, L) * 
            this.compute_f(32, L) * this.compute_f(33, L) * this.compute_f(34, L) * 
            this.compute_f(35, L) * (q[0] + q[1] + q[2]) - this.compute_f(36, L)
        );
        
        dLdt[5] = (1.0 / L_global_max) * (
            this.compute_f(37, L) * this.compute_f(38, L) * this.compute_f(39, L) * 
            this.compute_f(40, L) * this.compute_f(41, L) * (q[0] + q[2]) - 
            this.compute_f(42, L)
        );
        
        dLdt[6] = (1.0 / L_global_max) * (
            this.compute_f(43, L) * this.compute_f(44, L) * this.compute_f(45, L) * 
            this.compute_f(46, L) * (q[2] + q[3]) - this.compute_f(47, L)
        );
        
        dLdt[7] = (1.0 / L_global_max) * (
            this.compute_f(48, L) * this.compute_f(49, L) * this.compute_f(50, L) * 
            this.compute_f(51, L) * this.compute_f(52, L) * this.compute_f(53, L) * 
            q[2] - this.compute_f(54, L) * this.compute_f(55, L)
        );
        
        dLdt[8] = (1.0 / L_global_max) * (
            this.compute_f(56, L) * this.compute_f(57, L) * (q[0] + q[2] + q[3]) - 
            this.compute_f(58, L) * this.compute_f(59, L) * this.compute_f(60, L) * 
            this.compute_f(61, L) * this.compute_f(62, L)
        );
        
        dLdt[9] = (1.0 / L_global_max) * (
            this.compute_f(63, L) * this.compute_f(64, L) * this.compute_f(65, L) * 
            this.compute_f(66, L) * this.compute_f(67, L) * this.compute_f(68, L) * 
            (q[1] + q[4]) - this.compute_f(69, L)
        );
        
        dLdt[10] = (1.0 / L_global_max) * (
            this.compute_f(70, L) * this.compute_f(71, L) * this.compute_f(72, L) * 
            this.compute_f(73, L) * this.compute_f(74, L) * (q[0] + q[2]) - 
            this.compute_f(75, L) * this.compute_f(76, L)
        );
        
        dLdt[11] = (1.0 / L_global_max) * (
            this.compute_f(77, L) * this.compute_f(78, L) * this.compute_f(79, L) * 
            (q[0] + q[1] + q[4]) - this.compute_f(80, L)
        );
        
        dLdt[12] = (1.0 / L_global_max) * (
            this.compute_f(81, L) * this.compute_f(82, L) * this.compute_f(83, L) * 
            this.compute_f(84, L) * this.compute_f(85, L) * this.compute_f(86, L) * 
            this.compute_f(87, L) * (q[0] + q[1]) - q[3]
        );
        
        dLdt[13] = (1.0 / L_global_max) * (
            this.compute_f(88, L) * this.compute_f(89, L) * this.compute_f(90, L) * 
            this.compute_f(91, L) * (q[1] + q[2]) - q[4]
        );
        
        dLdt[14] = (1.0 / L_global_max) * (
            this.compute_f(92, L) * this.compute_f(93, L) * this.compute_f(94, L) * 
            this.compute_f(95, L) * this.compute_f(96, L) * this.compute_f(97, L) * 
            this.compute_f(98, L) * (q[0] + q[1] + q[4]) - q[2]
        );
        
        // Ограничиваем производные
        for (let i = 0; i < dLdt.length; i++) {
            dLdt[i] = Math.max(-10.0, Math.min(10.0, dLdt[i]));
        }
        
        return dLdt;
    }

    // Обновленный решатель с правильной нормировкой
    solve(t_span = [0, 1], num_points = 100) {
        try {
            const [t0, t1] = t_span;
            const dt = (t1 - t0) / (num_points - 1);
            const time_points = Array.from({length: num_points}, (_, i) => t0 + i * dt);

            console.log("Шаг 1: Находим максимальные значения q...");
            // Считаем сырые значения q
            const q_raw_values = [];
            for (let k = 1; k <= 5; k++) {
                const q_values = time_points.map(t => Math.abs(this.compute_q_raw(k, t)));
                q_raw_values.push(Math.max(...q_values));
            }
            const q_global_max = Math.max(...q_raw_values, 1.0); // минимум 1.0
            console.log(`Максимальное значение q: ${q_global_max}`);

            console.log("Шаг 2: Начальное приближение для L...");
            // Начальные значения L (все равны 1)
            let currentL = new Array(15).fill(1.0);
            
            console.log("Шаг 3: Первый проход для нахождения L_max...");
            // Первый проход: считаем L с нормированными q
            let L_max_values = new Array(15).fill(0);
            for (const t of time_points) {
                const dLdt = this.rhs_normalized(t, currentL, q_global_max, 1.0);
                currentL = currentL.map((val, i) => {
                    const newVal = val + dLdt[i] * dt;
                    L_max_values[i] = Math.max(L_max_values[i], Math.abs(newVal));
                    // Ограничиваем значения
                    return Math.max(this.L_min[i], Math.min(this.L_max[i], newVal));
                });
            }

            const L_global_max = Math.max(...L_max_values, 1.0); // минимум 1.0
            console.log(`Максимальное значение L: ${L_global_max}`);

            console.log("Шаг 4: Основной расчет с полной нормировкой...");
            // Второй проход: с полной нормировкой
            const t = [];
            const L = Array(15).fill().map(() => []);
            const q = Array(5).fill().map(() => []);
            
            // Начальные значения из настроек пользователя
            currentL = this.L_init.map((val, i) => 
                Math.max(this.L_min[i], Math.min(this.L_max[i], val))
            );
            
            for (let i = 0; i < num_points; i++) {
                const currentT = time_points[i];
                t.push(currentT);
                
                // Сохраняем текущие значения L
                currentL.forEach((val, idx) => L[idx].push(val));
                
                // Сохраняем нормированные значения q
                for (let k = 1; k <= 5; k++) {
                    q[k-1].push(this.compute_q_normalized(k, currentT, q_global_max));
                }
                
                if (i < num_points - 1) {
                    // Метод Рунге-Кутты 4-го порядка
                    const k1 = this.rhs_normalized(currentT, currentL, q_global_max, L_global_max);
                    const k2 = this.rhs_normalized(currentT + dt/2, 
                        currentL.map((val, idx) => val + k1[idx] * dt/2), 
                        q_global_max, L_global_max);
                    const k3 = this.rhs_normalized(currentT + dt/2,
                        currentL.map((val, idx) => val + k2[idx] * dt/2), 
                        q_global_max, L_global_max);
                    const k4 = this.rhs_normalized(currentT + dt,
                        currentL.map((val, idx) => val + k3[idx] * dt), 
                        q_global_max, L_global_max);
                    
                    currentL = currentL.map((val, idx) => {
                        let newVal = val + (k1[idx] + 2*k2[idx] + 2*k3[idx] + k4[idx]) * dt / 6;
                        
                        // Нормируем
                        newVal = newVal / L_global_max;
                        
                        // Ограничиваем значения
                        newVal = Math.max(0.0, Math.min(1.0, newVal));
                        newVal = Math.max(this.L_min[idx], Math.min(this.L_max[idx], newVal));
                        
                        return newVal;
                    });
                }
            }
            
            return { t, L, q, L_global_max, q_global_max };
            
        } catch (error) {
            console.error(`Error in solve: ${error}`);
            // Возвращаем заглушку в случае ошибки
            const t = Array.from({length: num_points}, (_, i) => 
                t_span[0] + (t_span[1] - t_span[0]) * i / (num_points - 1)
            );
            const L = Array(15).fill().map(() => 
                Array(num_points).fill(0.5)
            );
            const q = Array(5).fill().map(() => 
                Array(num_points).fill(0.5)
            );
            return { t, L, q, L_global_max: 1.0, q_global_max: 1.0 };
        }
    }
}

// Функция для расчета результатов
export const calculateResults = async (inputData) => {
    const model = new ProductCompanyModelJS();
    
    // Устанавливаем параметры L
    inputData.l_params.forEach((params, i) => {
        model.set_L_params(i+1, params.min, params.init, params.max);
    });
    
    // Устанавливаем коэффициенты f
    inputData.f_coeffs.forEach((coeff, i) => {
        model.set_f_poly(i+1, coeff.a, coeff.b, coeff.c, coeff.d, coeff.l_index);
    });
    
    // Устанавливаем коэффициенты q
    inputData.q_coeffs.forEach((coeff, i) => {
        model.set_q_poly(i+1, coeff.a, coeff.b, coeff.c, coeff.d);
    });
    
    return model.solve(inputData.t_span, inputData.num_points);
};

export default ProductCompanyModelJS;
