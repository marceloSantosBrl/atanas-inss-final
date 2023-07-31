const switcherAtivoClasse = 'inline-block p-4 text-yellow-600 ' +
    'border-b-2 border-yellow-500 rounded-t-lg active cursor-pointer'
const switcherInativoClasse = 'inline-block p-4 border-b-2 border-transparent' +
    'rounded-t-lg hover:text-gray-600 hover:border-gray-300 cursor-pointer'

const salarioInput = document.getElementById('salarioInput');
salarioInput.addEventListener('keydown', (e) => {
    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', 'Backspace', 'Delete',
        'ArrowRight', 'ArrowLeft'].includes(e.key)) {
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

const obterPorcentagemClt = value => {
    if (value <= 1_100) return 0.075;
    if (value > 1_100 && value <= 2_203.48) return 0.09;
    if (value > 2_203.48 && value <= 3_305.22) return 0.12;
    if (value > 3_305.22 && value <= 6_433.57) return 0.14;
    throw new Error('Valor Fora de Escopo');
}

const obterPorcentagemAutonomo = value => {
    if (value >= 0 && value <= 6_433.57) return 0.2;
    throw new Error('Valor Fora de Escopo');
}

const obterProLabore = value => {
    if (value >= 0 && value <= 6_433.57) return 0.11;
    throw new Error('Valor Fora de Escopo');
}

const obterTotal = (valor, funcao) => valor * funcao(valor);

const obterTexto = valor => `Quanto você deve pagar de Inss por mês: R$  
${valor.toLocaleString("pt-BR", {maximumFractionDigits: 2, minimumFractionDigits: 2})}`

const formulario = document.getElementById("formularioSalario");

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(formulario);
    const valorSalario = data.get("salario");
    try {
        const valorClt = obterTotal(valorSalario, obterPorcentagemClt)
        const valorAutonomo = obterTotal(valorSalario, obterPorcentagemAutonomo)
        const valorProLabore = obterTotal(valorSalario, obterProLabore)
        document.getElementById("cltSaida").innerText = obterTexto(valorClt);
        document.getElementById("autonomoSaida").innerText = obterTexto(valorAutonomo);
        document.getElementById("proLaboreSaida").innerText = obterTexto(valorProLabore);
    } catch (e) {
        const mensagem = "Salário fora dos limites de cálculo"
        document.getElementById("cltSaida").innerText = mensagem;
        document.getElementById("autonomoSaida").innerText = mensagem;
        document.getElementById("proLaboreSaida").innerText = mensagem;
    }
})