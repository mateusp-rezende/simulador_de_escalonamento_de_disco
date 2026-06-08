# Escopo e Requisitos do Simulador de Escalonamento de Disco (SKILL)

## 1. Descrição Geral
Um simulador visual interativo de escalonamento de braço de disco, onde o usuário pode configurar as variáveis do disco, testar diferentes algoritmos e visualizar a movimentação passo a passo ou de forma automática (completa).

## 2. Requisitos de Entrada
- **Tamanho do Disco:** 0 até N (ex: 199).
- **Posição Inicial do Braço:** Valor numérico dentro do tamanho do disco.
- **Sequência de Requisições:** Lista de números separados por vírgula (ex: 82, 170, 43, 140, 24, 16, 190).
- **Algoritmo:** FCFS, SSTF, SCAN, C-SCAN, LOOK.
- **Direção Inicial:** Esquerda ou Direita (necessário para algoritmos baseados em direção).

## 3. Algoritmos
1. **FCFS (First Come First Served):** Atende as requisições na ordem de chegada.
2. **SSTF (Shortest Seek Time First):** Atende a requisição mais próxima da posição atual do braço.
3. **SCAN (Elevador):** O braço vai até o final do disco em uma direção, e depois inverte a direção.
4. **C-SCAN (Circular SCAN):** O braço vai até o final do disco, volta para o início (0) sem atender no retorno, e continua.
5. **LOOK:** O braço vai apenas até a última requisição pendente na direção atual e depois inverte o sentido (não vai até a ponta inútil).

## 4. Requisitos de Saída e Visualização
- **Fila Restante:** Mostrar as requisições que ainda não foram atendidas.
- **Trilhas Consumidas:** Mostrar as requisições que já foram atendidas (em ordem).
- **Caminho Percorrido / Passo Atual:** O trajeto do movimento mais recente (ex: 50 → 82).
- **Cálculo de Movimentos Totais:** Somatório absoluto do caminho percorrido pelo braço.

## 5. Animação e Interface
- Construção em **HTML, CSS e JS puro** para execução local sem dependências.
- Animação visual em formato de "linha do tempo" horizontal onde o braço desliza para as trilhas.
- Modo de execução:
  - **Simular Completo:** Roda todos os passos com intervalos de tempo automáticos (animação contínua).
  - **Próximo Passo:** O usuário clica para avançar uma única movimentação (ideal para explicação).
  - **Reiniciar:** Restaura as posições.

## 6. Validações Imprescindíveis
- Posições de trilha menores que zero ou maiores que o disco.
- Lista de sequência mal formatada ou vazia.
- Posição inicial fora da faixa permitida.
