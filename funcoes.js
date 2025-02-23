var dados_questoes;
    var dados_questao_escolhida;
    const letras = ['A','B','C','D'];

    fetch('./questoes.json')
    .then(response => response.json())
    .then(data => { dados_questoes=data;select_question(data)});

    function select_question(questoes){

        var questao = questoes[Math.floor(Math.random()*questoes.length)];
        var alternativas = questao['alternativas']
        

        document.getElementById('Pergunta').innerHTML = questao['pergunta'];
        
        for (let i = 0; i < letras.length; i++){
            document.getElementById('Alternativa '+letras[i]).innerHTML = alternativas[i];
        }
        
        dados_questao_escolhida = questao;
    }

    
    for (let i = 0; i < letras.length; i++){
        document.getElementById("Alternativa "+letras[i]).addEventListener("click",function(){
        verificar_resposta(letras[i])
        }, false);
    }



    function verificar_resposta(resposta){
        if (dados_questao_escolhida["correta"]===resposta) 
            alert("Correto!");
        else
            alert("Errado!");

        select_question(dados_questoes)
    }