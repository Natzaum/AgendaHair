const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com'];

const validateCPF = (value) => {
    if (!value) return true; // CPF é opcional, então se não for fornecido, considera-se válido
    const cpf = value.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica se possui 11 dígitos e não são todos iguais

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rest = 11 - (sum % 11);
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    rest = 11 - (sum % 11);
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(10))) return false;

    return true;
};

// Função para validar CNPJ
const validateCNPJ = (value) => {
    if (!value) return true; // CNPJ é opcional, então se não for fornecido, considera-se válido
    const cnpj = value.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false; // Verifica se possui 14 dígitos e não são todos iguais

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
};


const isValidEmailDomain = (value) => {
    const emailDomain = value.split('@')[1];
    return allowedDomains.includes(emailDomain);
};


module.exports = {
    validateCPF,validateCNPJ,isValidEmailDomain
}