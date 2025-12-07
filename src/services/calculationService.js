import ProductCompanyModelJS from './mathModel';

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