let botao = document.querySelector(".botao-gerar")

async function gerarCodigo() {
    let textoUsuario = document.querySelector(".caixa-texto").value
    let blocoCodigo = document.querySelector(".bloco-codigo")

    blocoCodigo.textContent = "Gerando resposta..."

    // Chamada para a função serverless no Netlify
    try {
        let resposta = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: textoUsuario })
        })

        let dados = await resposta.json()
        blocoCodigo.textContent = dados.resposta
    } catch (err) {
        blocoCodigo.textContent = "Erro ao conectar à IA. Tente novamente."
        console.error(err)
    }
}

botao.addEventListener("click", gerarCodigo)