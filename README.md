# Relatório: Simulador Visual de Escalonamento de Braço de Disco

## 1. Introdução
O escalonamento de disco é uma das tarefas fundamentais de um sistema operacional. Este trabalho apresenta um simulador visual interativo para ilustrar e comparar diferentes algoritmos de escalonamento do braço do disco, ajudando a visualizar como a posição física influencia no tempo de acesso de I/O.

## 2. Objetivo do simulador
O simulador tem como objetivo demonstrar, de forma clara e visual, o caminho percorrido pelo braço do disco para atender a uma sequência de requisições de acesso a trilhas. O sistema calcula a ordem de atendimento, o custo em movimentos totais e oferece simulação passo a passo, facilitando o aprendizado e a apresentação didática.

## 3. Fundamentação Teórica

### 3.1 Escalonamento de Disco
Discos rígidos recebem múltiplas requisições de I/O em diferentes posições (cilindros/trilhas). A ordem de execução dessas requisições tem grande impacto na performance do sistema, devido ao tempo mecânico necessário para mover o braço (seek time). A meta dos algoritmos de escalonamento é minimizar esse deslocamento do braço para aumentar a taxa de transferência.

### 3.2 Algoritmo FCFS (First Come First Served)
Atende as requisições na exata ordem em que chegaram à fila de processos do disco.
- **Vantagem:** Simples de implementar e não causa "starvation" (fome), pois todas as requisições são atendidas com certeza.
- **Desvantagem:** Pode causar alta variação no tempo de resposta, muitas vezes resultando em movimentos longos e excessivos do braço se as requisições alternarem entre trilhas distantes (pode cruzar o disco inteiro repetidas vezes).

### 3.3 Algoritmo SSTF (Shortest Seek Time First)
Atende sempre a requisição pendente que estiver fisicamente mais próxima da posição atual do braço.
- **Vantagem:** Reduz significativamente a quantidade total de movimentos quando comparado ao FCFS, pois otimiza localmente a distância percorrida.
- **Desvantagem:** Pode causar *starvation* de trilhas localizadas nas pontas extremas do disco caso cheguem requisições constantes e frequentes na região central onde o braço se encontra.

### 3.4 Algoritmo SCAN (Elevador)
Move o braço em uma direção contínua até o extremo físico do disco (0 ou o tamanho máximo), atendendo as requisições no caminho. Ao chegar na ponta, o braço inverte o sentido de movimento.
- **Vantagem:** Mais justo que o SSTF e garante atendimento máximo em uma "varredura", equilibrando o tempo de espera.
- **Desvantagem:** O braço se movimenta até o final absoluto do disco mesmo que não existam requisições pendentes naquelas pontas, desperdiçando tempo.

### 3.5 Algoritmo C-SCAN (Circular SCAN)
Similar ao SCAN, o braço viaja em uma direção específica atendendo requisições. Porém, ao chegar no fim do disco, ele retorna rapidamente para o início (sem atender requisições no caminho de volta) e retoma a varredura na mesma direção original.
- **Vantagem:** Proporciona um tempo de espera mais uniforme comparado ao SCAN tradicional, pois trilhas na outra ponta do disco não precisam esperar o braço varrer de volta em velocidade lenta.
- **Desvantagem:** A longa viagem de retorno (seek total do fim ao começo) entra no custo e não é otimizada.

### 3.6 Algoritmo LOOK e C-LOOK
O LOOK é uma versão otimizada do SCAN. Em vez de viajar até a borda física do disco (0 ou o fim absoluto), o braço "olha" para a frente e viaja apenas até a *última* requisição pendente naquela direção, antes de inverter o sentido de varredura.
- **Vantagem:** Economiza muitos deslocamentos ao não ir até o extremo vazio quando não há necessidade. O C-LOOK seria a versão circular que retorna à primeira requisição do outro lado em vez da ponta física 0.

## 4. Tecnologias Utilizadas
A solução adotada dispensa a necessidade de back-ends complexos, sendo executada inteiramente de forma local e assíncrona.
- **HTML5:** Utilizado para a marcação da estrutura e organização semântica do projeto em contêineres lógicos.
- **CSS3:** Estilização com a adoção de temas escuros (*Dark Mode*), uso intensivo de flexbox/grid layout, efeito *Glassmorphism* (fundo desfocado translúcido) e animações suaves de transição (ex: para o braço mecânico).
- **JavaScript (Vanilla puro, sem frameworks):** Responsável por escutar os eventos, gerenciar a estrutura de dados (fila e simulações), rodar os 5 algoritmos matematicamente, validar inputs rigorosamente, e manipular a DOM em tempo real para exibir o movimento passo a passo (Step-by-step).

## 5. Requisitos Funcionais e Não Funcionais
### Requisitos Funcionais Implementados
- [RF01] Permite definir o tamanho do disco (ex: 199).
- [RF02] Permite definir a posição de partida do braço (ex: 50).
- [RF03] Recebe a sequência de requisições por texto, separadas por vírgula.
- [RF04/RF05] Seletor de algoritmos (FCFS, SSTF, SCAN, C-SCAN, LOOK) e escolha de direção condicional (Direita/Esquerda).
- [RF06/RF07] Cálculo de percurso exato e da soma da distância/movimentos totais do braço.
- [RF08/RF09/RF10/RF11] Animação visual em linha do tempo, consumindo as listas de espera e marcando no grid cada requisição visitada, nos modos Completo Automático e Passo-a-Passo manual.

### Requisitos Não Funcionais Implementados
- Dispensa bancos de dados, servidores web ou interpretadores como Python. Funciona dando clique duplo no arquivo `index.html`.
- Interface limpa e visivelmente amigável para palestras e projeções, prevenindo uso de comandos complexos e mantendo botões bem demarcados.

## 6. Passos da Construção
1. Desenhou-se o Mockup da tela, focando numa lateral de inputs e uma área nobre maior para os gráficos e contadores.
2. Escreveu-se a estrutura em HTML agrupando os elementos nas tags semânticas.
3. Estilizou-se o visual geral usando as raízes do CSS com variáveis CSS (`:root`), configurando gradientes espaciais.
4. Elaborou-se a base do JS conectando as funções de leitura, validação e exibição de erro.
5. Em seguida, implementaram-se separadamente os algoritmos na função `calculateSchedule()`, gerando um "Path" (Array com a ordem final).
6. Construiu-se o renderizador que processa o Path e desloca o braço em percentual `%` correspondente no disco desenhado em tela.
7. Implementou-se a máquina de estado que controla a pausa (`setInterval`) e os cliques do botão Passo a Passo.

## 7. Funcionamento, Testes e Resultados
Foi inserida a sequência de exemplo na ferramenta (`Tamanho 199`, `Braço 50`, `Direita`, `Ordem: 82, 170, 43, 140, 24, 16, 190`).
Os resultados obtidos de movimentações do braço (sujeitos ao critério de ordenação do algoritmo):
- **FCFS:** 344 movimentos.
- **SSTF:** O algoritmo seleciona o mais próximo dinamicamente, evitando pulos longos.
- **SCAN:** O braço vai até 199 e regressa catando o resto.
- **C-SCAN:** Vai até 199, retorna ao 0 e prossegue para cima.
- **LOOK:** Vai até o 190 (último da direita) e regressa, ignorando o trecho até 199.

## 8. Conclusão
O simulador atendeu integralmente aos requisitos estipulados para a atividade. A visualização step-by-step prova o ponto de que o FCFS, embora simples, sofre com oscilações bruscas que causam atraso severo no hardware de disco rotativo magnético. Os simuladores visuais são ferramentas extremamente eficazes na didática da disciplina de Sistemas Operacionais.

## 9. referencias

https://www.youtube.com/watch?v=kjNUWkZdp5A

https://www.youtube.com/watch?v=_nXHGq5lHxo

https://www.kufunda.net/publicdocs/Sistemas%20Operacionais%20Modernos%20(Andrew%20S.%20Tanenbaum,%20Herbert%20Bos).

https://www.inf.ufrgs.br/~johann/sisop1/aula21.disk.pdf

https://eduplay.rnp.br/app/video/196752?
