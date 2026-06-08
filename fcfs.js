function calcularFCFS(posicaoInicial, sequenciaDeTrilhas) {
    /*
        FCFS = First Come, First Served
        Em português: Primeiro a chegar, primeiro a ser atendido.

        No escalonamento de disco, isso significa:
        o braço do disco vai atender as trilhas exatamente
        na ordem em que o usuário digitou.
    */

    let caminhoPercorrido = [];
    let movimentos = [];
    let movimentoTotal = 0;

    let posicaoAtual = posicaoInicial;

    caminhoPercorrido.push(posicaoAtual);

    for (let i = 0; i < sequenciaDeTrilhas.length; i++) {
        let proximaTrilha = sequenciaDeTrilhas[i];

        let movimento = Math.abs(proximaTrilha - posicaoAtual);

        movimentoTotal = movimentoTotal + movimento;

        movimentos.push({
            origem: posicaoAtual,
            destino: proximaTrilha,
            distancia: movimento
        });

        caminhoPercorrido.push(proximaTrilha);

        posicaoAtual = proximaTrilha;
    }


    return {
        algoritmo: "FCFS",
        caminhoPercorrido: caminhoPercorrido,
        movimentos: movimentos,
        movimentoTotal: movimentoTotal
    };
}