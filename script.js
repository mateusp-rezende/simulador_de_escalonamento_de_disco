// Elementos do DOM
const inputTamanhoDisco = document.getElementById('tamanho-disco');
const inputPosicaoInicial = document.getElementById('posicao-inicial');
const inputSequenciaTrilhas = document.getElementById('sequencia-trilhas');
const selectAlgoritmo = document.getElementById('algoritmo');
const selectDirecao = document.getElementById('direcao');
const grupoDirecao = document.getElementById('grupo-direcao');

const btnSimular = document.getElementById('btn-simular');
const btnPasso = document.getElementById('btn-passo');
const btnReiniciar = document.getElementById('btn-reiniciar');
const mensagemErro = document.getElementById('mensagem-erro');

const labelInicioLinear = document.getElementById('label-inicio-linear');
const labelFimLinear = document.getElementById('label-fim-linear');
const linhaDiscoLinear = document.getElementById('linha-disco-linear');
const bracoLinear = document.getElementById('braco-linear');
const labelBracoLinear = document.getElementById('label-braco-linear');
const visualizadorCaminhoLinear = document.getElementById('visualizador-caminho-linear');

const displayAlgoritmoAtual = document.getElementById('display-algoritmo-atual');
const displayTrilhaAtual = document.getElementById('display-trilha-atual');
const displayProximaTrilha = document.getElementById('display-proxima-trilha');
const displayMovimentoParcial = document.getElementById('display-movimento-parcial');
const displayMovimentosTotais = document.getElementById('display-movimentos-totais');

const displayCaminhoPercorrido = document.getElementById('display-caminho-percorrido');
const displayTrilhasPendentes = document.getElementById('display-trilhas-pendentes');
const displayTrilhasConsumidas = document.getElementById('display-trilhas-consumidas');

const trilhasCirculares = document.getElementById('trilhas-circulares');
const marcadoresTrilhas = document.getElementById('marcadores-trilhas');
const bracoCircular = document.getElementById('braco-circular');

// Estado da Simulação
let estadoSimulacao = {
    tamanhoDisco: 199,
    posicaoInicial: 50,
    sequencia: [],
    algoritmo: 'FCFS',
    direcao: 'direita',
    
    cronograma: [], 
    
    passoAtual: 0,
    estaTocando: false,
    idIntervalo: null,
    
    pontosLinear: [],
    pontosCircular: []
};

// Event Listeners
selectAlgoritmo.addEventListener('change', atualizarVisibilidadeDirecao);
btnSimular.addEventListener('click', alternarSimulacao);
btnPasso.addEventListener('click', proximoPasso);
btnReiniciar.addEventListener('click', reiniciarSimulacao);

// Inicialização
atualizarVisibilidadeDirecao();
reiniciarSimulacao();

function atualizarVisibilidadeDirecao() {
    const alg = selectAlgoritmo.value;
    if (alg === 'SCAN' || alg === 'CSCAN' || alg === 'LOOK') {
        grupoDirecao.classList.remove('oculto');
    } else {
        grupoDirecao.classList.add('oculto');
    }
}

function analisarEValidarEntrada() {
    const tamanho = parseInt(inputTamanhoDisco.value, 10);
    const inicial = parseInt(inputPosicaoInicial.value, 10);
    const seqBruta = inputSequenciaTrilhas.value;
    const alg = selectAlgoritmo.value;
    const dir = selectDirecao.value;

    if (isNaN(tamanho) || tamanho < 1) return { erro: "Tamanho do disco deve ser maior que 0." };
    if (isNaN(inicial) || inicial < 0 || inicial > tamanho) return { erro: `Posição inicial deve estar entre 0 e ${tamanho}.` };
    
    if (!seqBruta.trim()) return { erro: "Sequência de trilhas não pode estar vazia." };
    
    const arraySeq = seqBruta.split(',').map(s => parseInt(s.trim(), 10));
    for (let s of arraySeq) {
        if (isNaN(s)) return { erro: "A sequência deve conter apenas números separados por vírgula." };
        if (s < 0 || s > tamanho) return { erro: `A trilha ${s} está fora dos limites (0 - ${tamanho}).` };
    }

    return {
        sucesso: true,
        dados: { tamanho, inicial, sequencia: arraySeq, alg, dir }
    };
}

function calcularCronograma() {
    const entrada = analisarEValidarEntrada();
    if (entrada.erro) {
        mostrarErro(entrada.erro);
        return false;
    }
    ocultarErro();

    const { tamanho, inicial, sequencia, alg, dir } = entrada.dados;
    
    estadoSimulacao.tamanhoDisco = tamanho;
    estadoSimulacao.posicaoInicial = inicial;
    estadoSimulacao.sequencia = [...sequencia];
    estadoSimulacao.algoritmo = alg;
    estadoSimulacao.direcao = dir;

    let caminho = [];
    
    switch (alg) {
        case 'FCFS': caminho = calcularFCFS(inicial, sequencia); break;
        case 'SSTF': caminho = calcularSSTF(inicial, sequencia); break;
        case 'SCAN': caminho = calcularSCAN(inicial, sequencia, tamanho, dir); break;
        case 'CSCAN': caminho = calcularCSCAN(inicial, sequencia, tamanho, dir); break;
        case 'LOOK': caminho = calcularLOOK(inicial, sequencia, dir); break;
    }

    estadoSimulacao.cronograma = [];
    let posAtual = inicial;
    let distTotal = 0;
    
    caminho.forEach(destino => {
        const dist = Math.abs(destino - posAtual);
        distTotal += dist;
        estadoSimulacao.cronograma.push({
            trilha: destino,
            distancia: dist,
            distanciaTotal: distTotal,
            ehRequisicaoOriginal: sequencia.includes(destino)
        });
        posAtual = destino;
    });

    return true;
}

function trilhaParaAngulo(trilha, trilhaMaxima) {
  const percentual = trilha / trilhaMaxima;
  const anguloCentro = -125; 
  const anguloBorda = -85;
  return anguloCentro + percentual * (anguloBorda - anguloCentro);
}

function calcularPosicaoMarcador(trilha, trilhaMaxima) {
    const anguloDeg = trilhaParaAngulo(trilha, trilhaMaxima);
    const anguloRad = anguloDeg * Math.PI / 180;
    
    // Coordenadas do pivô relativas ao .hd-frame
    const pivotX = 365;
    const pivotY = 465;
    // Comprimento até a cabeça de leitura
    const armLength = 258; 
    
    const hx = pivotX + Math.cos(anguloRad) * armLength;
    const hy = pivotY + Math.sin(anguloRad) * armLength;
    
    // Converter para as coordenadas do .prato (que está top:20px, left:20px)
    return { x: hx - 20, y: hy - 20 };
}

function desenharEstadoInicial() {
    // Limpar visualizações
    document.querySelectorAll('.ponto-trilha-linear').forEach(el => el.remove());
    document.querySelectorAll('.ponto-trilha-circular').forEach(el => el.remove());
    document.querySelectorAll('.anel-trilha').forEach(el => el.remove());
    visualizadorCaminhoLinear.innerHTML = '';
    
    labelInicioLinear.textContent = '0';
    labelFimLinear.textContent = estadoSimulacao.tamanhoDisco;

    estadoSimulacao.pontosLinear = [];
    estadoSimulacao.pontosCircular = [];
    
    const requisicoesDistintas = [...new Set(estadoSimulacao.sequencia)];
    const trilhasExibidas = [...requisicoesDistintas, 0, estadoSimulacao.tamanhoDisco];
    const trilhasUnicas = [...new Set(trilhasExibidas)].sort((a,b) => a-b);
    
    // Desenhar trilhas circulares finas
    trilhasUnicas.forEach(trilha => {
        const pos = calcularPosicaoMarcador(trilha, estadoSimulacao.tamanhoDisco);
        // Raio a partir do centro do prato (200, 200)
        const raio = Math.sqrt(Math.pow(pos.x - 200, 2) + Math.pow(pos.y - 200, 2));
        
        const anel = document.createElement('div');
        anel.className = 'anel-trilha';
        anel.style.width = `${raio * 2}px`;
        anel.style.height = `${raio * 2}px`;
        trilhasCirculares.appendChild(anel);
    });

    // Adicionar marcadores
    requisicoesDistintas.forEach(req => {
        // Ponto Linear
        const pontoLin = document.createElement('div');
        pontoLin.className = 'ponto-trilha-linear';
        pontoLin.setAttribute('data-target', req);
        const percentLin = (req / estadoSimulacao.tamanhoDisco) * 100;
        pontoLin.style.left = `${percentLin}%`;
        pontoLin.setAttribute('data-val', req);
        linhaDiscoLinear.appendChild(pontoLin);
        estadoSimulacao.pontosLinear.push(pontoLin);
        
        // Ponto Circular
        const pontoCirc = document.createElement('div');
        pontoCirc.className = 'ponto-trilha-circular';
        pontoCirc.setAttribute('data-target', req);
        
        const pos = calcularPosicaoMarcador(req, estadoSimulacao.tamanhoDisco);
        pontoCirc.style.left = `${pos.x}px`;
        pontoCirc.style.top = `${pos.y}px`;
        marcadoresTrilhas.appendChild(pontoCirc);
        estadoSimulacao.pontosCircular.push(pontoCirc);
    });

    atualizarPosicaoBraco(estadoSimulacao.posicaoInicial);

    displayMovimentosTotais.textContent = '0';
    displayAlgoritmoAtual.textContent = selectAlgoritmo.options[selectAlgoritmo.selectedIndex].text;
    displayTrilhaAtual.textContent = estadoSimulacao.posicaoInicial;
    displayProximaTrilha.textContent = estadoSimulacao.cronograma.length > 0 ? estadoSimulacao.cronograma[0].trilha : '-';
    displayMovimentoParcial.textContent = '0';
    
    displayCaminhoPercorrido.textContent = estadoSimulacao.posicaoInicial.toString();
    atualizarListas(estadoSimulacao.sequencia, []);
}

function atualizarPosicaoBraco(pos) {
    // Linear
    const percentLin = (pos / estadoSimulacao.tamanhoDisco) * 100;
    bracoLinear.style.left = `${percentLin}%`;
    labelBracoLinear.textContent = pos;
    
    // Circular
    const angulo = trilhaParaAngulo(pos, estadoSimulacao.tamanhoDisco);
    bracoCircular.style.transform = `rotate(${angulo}deg)`;
}

function atualizarListas(pendentes, consumidas) {
    if (pendentes.length === 0) {
        displayTrilhasPendentes.innerHTML = '<span>Nenhuma</span>';
    } else {
        displayTrilhasPendentes.innerHTML = pendentes.map(t => `<span class="pendente">${t}</span>`).join(' ');
    }

    if (consumidas.length === 0) {
        displayTrilhasConsumidas.innerHTML = '<span>Nenhuma</span>';
    } else {
        displayTrilhasConsumidas.innerHTML = consumidas.map(t => `<span class="consumida">${t}</span>`).join(' ');
    }
}

function marcarTrilhaConsumida(valorTrilha) {
    const pontosLin = document.querySelectorAll(`.ponto-trilha-linear[data-target="${valorTrilha}"]`);
    pontosLin.forEach(p => p.classList.add('consumida'));
    
    const pontosCirc = document.querySelectorAll(`.ponto-trilha-circular[data-target="${valorTrilha}"]`);
    pontosCirc.forEach(p => p.classList.add('consumida'));
}

function desenharLinhaCaminho(posInicial, posFinal, indicePasso) {
    const startPercent = (posInicial / estadoSimulacao.tamanhoDisco) * 100;
    const endPercent = (posFinal / estadoSimulacao.tamanhoDisco) * 100;
    
    const line = document.createElement('div');
    line.className = 'linha-caminho';
    
    const left = Math.min(startPercent, endPercent);
    const width = Math.abs(startPercent - endPercent);
    const verticalOffset = 40 + (indicePasso % 5) * 15;
    
    line.style.left = `${left}%`;
    line.style.width = `${width}%`;
    line.style.top = `${verticalOffset}px`;
    
    visualizadorCaminhoLinear.appendChild(line);
}

function proximoPasso() {
    if (estadoSimulacao.passoAtual === 0) {
        if (!calcularCronograma()) return;
        desenharEstadoInicial();
        alternarInputs(false);
    }

    if (estadoSimulacao.passoAtual < estadoSimulacao.cronograma.length) {
        const passo = estadoSimulacao.cronograma[estadoSimulacao.passoAtual];
        const posAnterior = estadoSimulacao.passoAtual === 0 ? 
            estadoSimulacao.posicaoInicial : 
            estadoSimulacao.cronograma[estadoSimulacao.passoAtual - 1].trilha;

        atualizarPosicaoBraco(passo.trilha);
        desenharLinhaCaminho(posAnterior, passo.trilha, estadoSimulacao.passoAtual);
        
        if (passo.ehRequisicaoOriginal) {
            marcarTrilhaConsumida(passo.trilha);
        }

        displayTrilhaAtual.textContent = passo.trilha;
        displayProximaTrilha.textContent = (estadoSimulacao.passoAtual + 1 < estadoSimulacao.cronograma.length) ? estadoSimulacao.cronograma[estadoSimulacao.passoAtual + 1].trilha : 'Fim';
        displayMovimentoParcial.textContent = passo.distancia;
        displayMovimentosTotais.textContent = passo.distanciaTotal;

        displayCaminhoPercorrido.textContent += ` → ${passo.trilha}`;

        const consumidasAteAgora = estadoSimulacao.cronograma
            .slice(0, estadoSimulacao.passoAtual + 1)
            .filter(s => s.ehRequisicaoOriginal)
            .map(s => s.trilha);
            
        const pendentes = [...estadoSimulacao.sequencia];
        consumidasAteAgora.forEach(c => {
            const idx = pendentes.indexOf(c);
            if (idx !== -1) pendentes.splice(idx, 1);
        });

        atualizarListas(pendentes, consumidasAteAgora);
        estadoSimulacao.passoAtual++;
        
        if (estadoSimulacao.passoAtual >= estadoSimulacao.cronograma.length) {
            finalizarSimulacao();
        }
    }
}

function alternarSimulacao() {
    if (estadoSimulacao.estaTocando) {
        pausarSimulacao();
    } else {
        tocarSimulacao();
    }
}

function tocarSimulacao() {
    if (estadoSimulacao.passoAtual >= estadoSimulacao.cronograma.length) {
        reiniciarSimulacao();
    }
    
    estadoSimulacao.estaTocando = true;
    btnSimular.textContent = 'Pausar Simulação';
    btnSimular.classList.remove('btn-primario');
    btnSimular.classList.add('btn-perigo');
    
    proximoPasso();
    estadoSimulacao.idIntervalo = setInterval(() => {
        if (estadoSimulacao.passoAtual < estadoSimulacao.cronograma.length) {
            proximoPasso();
        } else {
            pausarSimulacao();
        }
    }, 1500);
}

function pausarSimulacao() {
    estadoSimulacao.estaTocando = false;
    clearInterval(estadoSimulacao.idIntervalo);
    
    btnSimular.textContent = 'Continuar Simulação';
    btnSimular.classList.remove('btn-perigo');
    btnSimular.classList.add('btn-primario');
}

function finalizarSimulacao() {
    if (estadoSimulacao.estaTocando) {
        pausarSimulacao();
    }
    btnSimular.textContent = 'Simular Novamente';
    btnSimular.disabled = true;
    btnPasso.disabled = true;
}

function reiniciarSimulacao() {
    pausarSimulacao();
    estadoSimulacao.passoAtual = 0;
    estadoSimulacao.cronograma = [];
    
    btnSimular.textContent = 'Simular Completo';
    btnSimular.disabled = false;
    btnPasso.disabled = false;
    
    alternarInputs(true);
    
    const entrada = analisarEValidarEntrada();
    if(entrada.sucesso) {
        estadoSimulacao.tamanhoDisco = entrada.dados.tamanho;
        estadoSimulacao.posicaoInicial = entrada.dados.inicial;
        estadoSimulacao.sequencia = entrada.dados.sequencia;
        estadoSimulacao.algoritmo = entrada.dados.alg;
        desenharEstadoInicial();
    }
}

function alternarInputs(habilitado) {
    inputTamanhoDisco.disabled = !habilitado;
    inputPosicaoInicial.disabled = !habilitado;
    inputSequenciaTrilhas.disabled = !habilitado;
    selectAlgoritmo.disabled = !habilitado;
    selectDirecao.disabled = !habilitado;
}

function mostrarErro(msg) {
    mensagemErro.textContent = msg;
    mensagemErro.classList.remove('oculto');
}

function ocultarErro() {
    mensagemErro.classList.add('oculto');
}
