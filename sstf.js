function calcularSSTF(posicaoInicial, sequencia) {
    let caminho = [];
    let requisicoes = [...sequencia];
    let posicaoAtual = posicaoInicial;

    while (requisicoes.length > 0) {
        let indiceMaisProximo = 0;
        let menorDiferenca = Math.abs(requisicoes[0] - posicaoAtual);

        for (let i = 1; i < requisicoes.length; i++) {
            const diferenca = Math.abs(requisicoes[i] - posicaoAtual);
            if (diferenca < menorDiferenca) {
                menorDiferenca = diferenca;
                indiceMaisProximo = i;
            }
        }

        posicaoAtual = requisicoes[indiceMaisProximo];
        caminho.push(posicaoAtual);
        requisicoes.splice(indiceMaisProximo, 1);
    }
    return caminho;
}
