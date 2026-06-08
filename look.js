function calcularLOOK(posicaoInicial, sequencia, direcao) {
    let caminho = [];
    let esquerda = [];
    let direita = [];
    
    sequencia.forEach(req => {
        if (req < posicaoInicial) esquerda.push(req);
        if (req > posicaoInicial) direita.push(req);
    });

    esquerda.sort((a, b) => b - a); // decrescente
    direita.sort((a, b) => a - b); // crescente

    if (direcao === 'direita') {
        caminho = [...direita, ...esquerda];
    } else {
        caminho = [...esquerda, ...direita];
    }
    return caminho;
}
