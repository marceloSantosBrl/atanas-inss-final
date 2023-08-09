const switcherAtivoClasse = 'inline-block p-4 text-yellow-600 ' +
    'border-b-2 border-yellow-500 rounded-t-lg active cursor-pointer'
const switcherInativoClasse = 'inline-block p-4 border-b-2 border-transparent' +
    'rounded-t-lg hover:text-gray-600 hover:border-gray-300 cursor-pointer'

const salarioInput = document.getElementById('salarioInput');
salarioInput.addEventListener('keydown', (e) => {
    if ([' '].includes(e.key)) {
        e.preventDefault();
    }
})


const estadoInicialSwitcher = [
    switcherInativoClasse,
    switcherInativoClasse,
    switcherInativoClasse
]


const salarioButao = document.getElementById('salarioButao');
const autonomoButao = document.getElementById('autonomoButao');
const laboreButao = document.getElementById('laboreButao');

salarioButao.addEventListener('click', () => {
    let estado = ativarSwitcher(0, estadoInicialSwitcher);
    rerenderSwitcher(estado);
    let estadoBloco = ativarBloco(0, estadoInicialBloco);
    renderizarBloco(estadoBloco);
})

autonomoButao.addEventListener('click', () => {
    let estado = ativarSwitcher(1, estadoInicialSwitcher);
    rerenderSwitcher(estado);
    let estadoBloco = ativarBloco(1, estadoInicialBloco);
    renderizarBloco(estadoBloco);
})

laboreButao.addEventListener('click', () => {
    let estado = ativarSwitcher(2, estadoInicialSwitcher);
    rerenderSwitcher(estado);
    let estadoBloco = ativarBloco(2, estadoInicialBloco);
    renderizarBloco(estadoBloco);
})

const rerenderSwitcher = (estado) => {
    salarioButao.setAttribute("class", estado[0])
    autonomoButao.setAttribute("class", estado[1])
    laboreButao.setAttribute("class", estado[2])
}

const ativarSwitcher = (value, estado) => {
    return estado.map((estado, index) => index === value ?
        switcherAtivoClasse : switcherInativoClasse);
}

const estadoInicialBloco = [
    'hidden',
    'hidden',
    'hidden'
]

const renderizarBloco = (estado) => {
    const blocoClt = document.getElementById('bloco-clt');
    blocoClt.classList.replace('grid', estado[0])
    blocoClt.classList.replace('hidden', estado[0])
    const blocoAutonomo = document.getElementById('bloco-autonomo');
    blocoAutonomo.classList.replace('grid', estado[1])
    blocoAutonomo.classList.replace('hidden', estado[1])
    const blocoProLabore = document.getElementById('bloco-pro-labore');
    blocoProLabore.classList.replace('grid', estado[2])
    blocoProLabore.classList.replace('hidden', estado[2])
}

const ativarBloco = (value, estado) => {
    return estado.map((estado, index) => index === value ?
        'grid' : 'hidden');
}

// const obterPorcentagemClt = value => {
//     if (value <= 1_100) return 0.075;
//     if (value > 1_100 && value <= 2_203.48) return 0.09;
//     if (value > 2_203.48 && value <= 3_305.22) return 0.12;
//     if (value > 3_305.22 && value <= 6_433.57) return 0.14;
//     throw new Error('Valor Fora de Escopo');
// }

const obterTotalClt = valor => {
    if (valor < 0) throw new Error('Salário Inválido');
    const arrayPisos = [1_320, 2_571.29, 3_856.94, 7_507.49]
    const aliquotas = [0.075, 0.09, 0.12, 0.14]
    let arrayValores = [0, 0, 0, 0]
    if (valor <= arrayPisos[0]) {
        arrayValores[0] = valor;
    }
    if (valor > arrayPisos[0] && valor <= arrayPisos[1]) {
        arrayValores[0] = arrayPisos[0]
        arrayValores[1] = valor - arrayValores[0]
    }
    if (valor > arrayPisos[1] && valor <= arrayPisos[2]) {
        arrayValores[0] = arrayPisos[0];
        arrayValores[1] = arrayPisos[1] - arrayPisos[0]
        arrayValores[2] = valor - arrayPisos[1]
    }
    if (valor > 3_305.22 && valor <= 6_433.57) {
        arrayValores[0] = arrayPisos[0];
        arrayValores[1] = arrayPisos[1] - arrayPisos[0]
        arrayValores[2] = arrayPisos[2] - arrayPisos[1]
        arrayValores[3] = valor - arrayPisos[2]
    }
    if (valor >= 6_433.57) {
        arrayValores[0] = arrayPisos[0];
        arrayValores[1] = arrayPisos[1] - arrayPisos[0]
        arrayValores[2] = arrayPisos[2] - arrayPisos[1]
        arrayValores[3] = arrayPisos[3] - arrayPisos[2]
    }
    let total = 0;
    for (let i = 0; i < 4; ++i) {
        total += aliquotas[i] * arrayValores[i];
    }
    return total;
}


// const obterPorcentagemAutonomo = value => {
//     if (value >= 0 && value <= 6_433.57) return 0.2;
//     throw new Error('Valor Fora de Escopo');
// }
//
// const obterProLabore = value => {
//     if (value >= 0 && value <= 6_433.57) return 0.11;
//     throw new Error('Valor Fora de Escopo');
// }
//
// const obterTotal = (valor, funcao) => valor * funcao(valor);

const ObterTotalAutonomo = valor => {
    if (valor < 0) throw new Error('Salário Inválido');
    if (valor > 7_507.49) {
        return 7_507.49 * 0.20;
    }
    return valor * 0.20;
}

const ObterTotalProLabore = valor => {
    if (valor < 0) throw new Error('Salário Inválido');
    if (valor > 7_507.49) {
        return 7_507.49 * 0.11;
    }
    return valor * 0.11;
}

const obterTexto = valor => `Quanto você deve pagar de Inss por mês:\n R$ ${valor.toLocaleString("pt-BR", {maximumFractionDigits: 2, minimumFractionDigits: 2})}`

const formulario = document.getElementById("formularioSalario");

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(formulario);
    const valorSalario = data.get("salario");
    try {
        const valorClt = obterTotalClt(valorSalario)
        const valorAutonomo = ObterTotalAutonomo(valorSalario);
        const valorProLabore = ObterTotalProLabore(valorSalario);
        document.getElementById("cltSaida").innerText = obterTexto(valorClt);
        document.getElementById("autonomoSaida").innerText = obterTexto(valorAutonomo);
        document.getElementById("proLaboreSaida").innerText = obterTexto(valorProLabore);
    } catch (e) {
        const mensagem = "Salário Inválido"
        document.getElementById("cltSaida").innerText = mensagem;
        document.getElementById("autonomoSaida").innerText = mensagem;
        document.getElementById("proLaboreSaida").innerText = mensagem;
    }
})