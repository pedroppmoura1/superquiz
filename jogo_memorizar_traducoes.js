const letras = ['A','B','C','D','E'];
const pontuacao_inicial = 200.0;
const deducao_de_pontos_por_acerto = -50;
const ganho_de_pontos_por_erro = 100;

var palavras_em_italiano = [];
var lista_traducoes = [];
var dados_traducoes;

var num_streak = 0;
var numero_de_palavras_aprendidas = 0;
var contar_rodadas = 0;
var nome_jogo_atual = "Multipla-Escolha"

var total_de_pontos = 0
var pontuacao_total_inicial = 0


// Toda palavra começa com 200 pontos, que é proporcional a possibilidade da palavra aparecer no sistema aleatório;
// Se o usuário acerta, a palavra perde 10 pontos, se erra, ela ganha 50.
var sistema_de_pontos = {};

// Preparação, funções que devem ser chamadas antes do jogo 
//
//   

fetch('./traducoes_ingles.json')
    .then(response => response.json())
    .then(data => {dados_traducoes=data,extrair_dados_json(data)});

function extrair_dados_json(data){
    for(const key in data){
        palavras_em_italiano.push(key);
        sistema_de_pontos[key] = pontuacao_inicial;
        for(const traducao in data[key]){
            lista_traducoes.push(data[key][traducao]);
        };
    };
    pontuacao_total_inicial = palavras_em_italiano.length*pontuacao_inicial;
    iniciar_tela();
    construir_jogo();
    atualizar_label_palavras_aprendidas();
}

//  Associar clique dos botões a função de verificar a resposta.
for (let i = 0; i < letras.length; i++){
    document.getElementById("Alternativa "+letras[i]).addEventListener("click",function(){
        verificar_resposta_multipla_escolha(i)
    }, false);
}

function iniciar_tela(){
    let elementos_novo_jogo = document.getElementsByClassName(nome_jogo_atual)
    for(i=0;i<elementos_novo_jogo.length;i++){
        elementos_novo_jogo[i].style.display = "Flex";
    }
}

// O jogo funciona em rodadas. Podemos dividir cada rodada nos seguintes passos:
//
// 1. Selecionar palavra aleatória baseada no sistema de pontuação;
// 2. Baseado na palavra selecionada, determinar outros parâmetros, e preencher tela com valores;
// 3. Esperar resposta do usuário;
// 4. Verificar resposta baseado na resposta do usuário;
// 5. Se a resposta for correta, aumenta o streak, se não, reseta o streak;
// 6. A cada 5 rodadas o jogo é trocado;
    
//Essa função encontra uma palavra aleatória levando em consideração do sistema de pesos;
function selecionar_palavra_pontuacao(){
    
    total_de_pontos = calcular_total_de_pontos();
  
    
    valor_aleatorio = Math.floor(Math.random()*total_de_pontos) + 1
    

    for(const key in sistema_de_pontos){
        if (valor_aleatorio >= sistema_de_pontos[key]){
            valor_aleatorio -= sistema_de_pontos[key]
        }
        else{
            return key
        }
    }
}

function calcular_total_de_pontos(){
    total_de_pontos = 0;
    for(const key in sistema_de_pontos){
        total_de_pontos += sistema_de_pontos[key]
    }
    return total_de_pontos;

}
// Coloca na tela as informações da questão;
function construir_jogo(){
    if(nome_jogo_atual === "Multipla-Escolha"){
        definir_palavras_multipla_escolha(dados_traducoes)
    }
    else if(nome_jogo_atual === "Jogo-2"){
        definir_palavras_jogo_2(dados_traducoes)
    }
    else{
        alert("Algo de muito errado aconteceu!!!")
    }
}
    

    
// Garante que os pontos nunca sejam negativos (o que quebraria o código)
function adicionar_ou_retirar_pontos(key,num){
    
    sistema_de_pontos[key] += num
    if (sistema_de_pontos[key] === 0){
        numero_de_palavras_aprendidas ++
        atualizar_label_palavras_aprendidas()
    }
    total_de_pontos = calcular_total_de_pontos();
    document.getElementById('barra_progresso_palavras_aprendidas').value = String(Math.max(0,100*(1-total_de_pontos/pontuacao_total_inicial)))
}



function atualizar_label_palavras_aprendidas(){
    document.getElementById('texto-progresso').innerHTML = "Palavras aprendidas = " + String(numero_de_palavras_aprendidas) + "/" + String(palavras_em_italiano.length)
}

function trocar_jogo(){
    //apaga tudo que já tava
    elementos_jogo_atual = document.getElementsByClassName(nome_jogo_atual)
    for(i=0;i<elementos_jogo_atual.length;i++){
        elementos_jogo_atual[i].style.display = "None";
    }
    if (nome_jogo_atual==="Multipla-Escolha"){
        nome_jogo_atual = "Jogo-2"
    } else if (nome_jogo_atual==="Jogo-2"){
        nome_jogo_atual = "Multipla-Escolha"
    }
    //coloca os novos
    elementos_novo_jogo = document.getElementsByClassName(nome_jogo_atual)
    for(i=0;i<elementos_novo_jogo.length;i++){
        elementos_novo_jogo[i].style.display = "Flex";
    }
}

function atualizar_streak(num_streak){
    
    if (document.getElementsByClassName("acertou-errou")[0].style.display == ''){
        document.getElementsByClassName("acertou-errou")[0].style.display = "Flex"
        }
    

        
    if (num_streak == 0){
        document.getElementById("acertou-errou").innerText = "Errou!"
        document.getElementById("acertou-errou").style.backgroundColor = "Red"
    } else {
        document.getElementById("acertou-errou").innerText = "Acertou!"
        document.getElementById("acertou-errou").style.backgroundColor = "rgb(35, 255, 35)"
    }

    document.getElementById("streak-paragraph").innerHTML = "Streak: " + String(num_streak);
}


// Jogo 1 (Multipla Escolha): 
//
//


function definir_palavras_multipla_escolha(dados_traducoes){

    // Reseta as cores vermelhas das alternativas;
    for (i=0;i<letras.length;i++){
        document.getElementById("Alternativa "+ letras[i]).style.backgroundColor = "rgb(243, 243, 159)";
    }
    
    //Aqui o programa seleciona a palavra que será escolhida em italiano e extrai dos dados as possíveis traduções
    palavra_selecionada = selecionar_palavra_pontuacao();  
    possiveis_traducoes = dados_traducoes[palavra_selecionada];
    //Dentre as possíveis traduções, ele escolhe uma aleatória, que será a resposta correta!
    resposta_selecionada = possiveis_traducoes[Math.floor(Math.random()*possiveis_traducoes.length)];
    //A primeira alternativa será a resposta escolhida
    alternativas = [resposta_selecionada]
   
 

    //Para preencher as outras 4 vagas, 4 palavras vao ser escolhidas da lista completa de traduções
    i = 0
    while(i < letras.length-1){
        let palavra_aleatoria = lista_traducoes[Math.floor(Math.random()*lista_traducoes.length)]
        if(alternativas.includes(palavra_aleatoria)==false){
            alternativas.push(palavra_aleatoria)
            i++
        }
        
    }

    document.getElementById('Pergunta').innerHTML = palavra_selecionada;

    //Para que a resposta não seja sempre a primeira alternativa, fazemos um shuffle na array
    shuffle(alternativas)

    for(i=0;i<letras.length;i++){
        document.getElementById('Alternativa '+letras[i]).innerHTML = alternativas[i];
    }
}
function verificar_resposta_multipla_escolha(i){
    //Resultado é um boolean que é verdadeiro se a alternativa selecionada pelo usuário está presente na 
    //lista de possíveis traduções.
    //
    //Note que, é possível que uma tradução correta seja selecionada na segunda parte, já que ele pega
    //Valores aleatórios de todas as arrays, essa forma de verificar garante que, mesmo que o usuário
    //não seleciona a resposta que foi pensada, se ela estiver correta, o resultado ainda será correto.

    //Explicação sobre sistema de pontos no começa na declaração de variáveis.

    var resultado = dados_traducoes[palavra_selecionada].includes(alternativas[i])
    if (resultado){
        adicionar_ou_retirar_pontos(palavra_selecionada,deducao_de_pontos_por_acerto)
        document.getElementsByClassName("explicacao")[0].style.display  = 'block'
        document.getElementById("Explicacao").innerHTML = palavra_selecionada + ": " + possiveis_traducoes
        
        num_streak ++
        atualizar_streak(num_streak)
        contar_rodadas ++

        if(contar_rodadas >= 5){
            trocar_jogo()
            contar_rodadas = 0
        }
        construir_jogo();
    }
    else {
        document.getElementById("Alternativa "+ letras[i]).style.backgroundColor = "red"
        num_streak = 0
        atualizar_streak(num_streak)
        adicionar_ou_retirar_pontos(palavra_selecionada,ganho_de_pontos_por_erro)
    }
}

// Jogo 2: Esse jogo consiste em acertar qual palavra é a tradução para o conjunto de palavras que aparecem na
// tela.
//


function definir_palavras_jogo_2(dados_traducoes){
    palavra_selecionada = selecionar_palavra_pontuacao();  
    possiveis_traducoes = dados_traducoes[palavra_selecionada];

    document.getElementById("possiveis traducoes et").innerText = possiveis_traducoes
    
    
    document.getElementById("dica").innerText = "Dica: "+ gerar_dica(palavra_selecionada);

    
}

function gerar_dica(palavra_selecionada){
    pontuacao = sistema_de_pontos[palavra_selecionada];
    var palavra_dica = palavra_selecionada;
    let numero_de_letras_retiradas = Math.floor(Math.min((1 - pontuacao/(pontuacao_inicial*1.5)),1)*palavra_selecionada.length);
    let i = 0;

    while (i < numero_de_letras_retiradas){
        let letra_aleatoria = Math.floor(Math.random()*palavra_selecionada.length)
        if (palavra_dica[letra_aleatoria] != '_'){
            palavra_dica = replace_character_at_index(palavra_dica,letra_aleatoria,'_')
            i++
        } 
    }
    return palavra_dica
}

function verificar_resposta_jogo_2(){

    contar_rodadas ++

    if(document.getElementById("textbox_jogo_2").value === palavra_selecionada){
        adicionar_ou_retirar_pontos(palavra_selecionada,deducao_de_pontos_por_acerto)
        document.getElementById("textbox_jogo_2").value = ''
        num_streak ++
        atualizar_streak(num_streak)
    }
    else{
        adicionar_ou_retirar_pontos(palavra_selecionada,ganho_de_pontos_por_erro)
        document.getElementById("textbox_jogo_2").value = ''
        num_streak = 0
        atualizar_streak(num_streak)
    }

    if(contar_rodadas >= 5){
        trocar_jogo()
        contar_rodadas = 0
    }
    construir_jogo()
}
// Associar textbox a verificar a resposta
document.getElementById("textbox_jogo_2").onkeydown = function(event){
    if(event.key === "Enter"){
        verificar_resposta_jogo_2()
    }
}

// Funções auxiliares::
//
//

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}
    
function replace_character_at_index(palavra,index,char){
    const primeira_parte = palavra.substring(0,index)
    const ultima_parte = palavra.substring(index+1)
    return primeira_parte + char + ultima_parte
}
