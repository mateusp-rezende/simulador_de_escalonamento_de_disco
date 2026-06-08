function calcularSCAN(posicaoInicial, sequencia, tamanhoDisco, direcao) {
    let caminho = [];
    let esquerda = [];
    let direita = [];

    sequencia.forEach(req => {
        if (req < posicaoInicial) esquerda.push(req);
        if (req > posicaoInicial) direita.push(req);
    });

    esquerda.sort((a, b) => b - a);
    direita.sort((a, b) => a - b);

    if (direcao === 'direita') {
        caminho = [...direita];
        if (esquerda.length > 0) {
            if (caminho.length === 0 || caminho[caminho.length - 1] !== tamanhoDisco) {
                caminho.push(tamanhoDisco);
            }
            caminho = caminho.concat(esquerda);
        }
    } else {
        caminho = [...esquerda];
        if (direita.length > 0) {
            if (caminho.length === 0 || caminho[caminho.length - 1] !== 0) {
                caminho.push(0);
            }
            caminho = caminho.concat(direita);
        }
    }
    return caminho;
}
