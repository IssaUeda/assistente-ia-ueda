
export async function handler(event, context) {
  try {
    
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Método não permitido" };
    }

    
    const { mensagem } = JSON.parse(event.body);

    if (!mensagem) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Mensagem não enviada" })
      };
    }

    
    const API_KEY = process.env.GROQ_API_KEY;

    
    if (!API_KEY) {
      console.error("GROQ_API_KEY não encontrada nas variáveis de ambiente");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key não configurada" })
      };
    }

    
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";

    
    const resposta = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Você é uma assistente contábil chamada Uedinha que tira dúvidas gerais sobre contabilidade. Responda SOMENTE dúvidas contábeis. NUNCA precifique valores. Se não souber, peça para entrar em contato com a UedaDigital."
          },
          {
            role: "user",
            content: mensagem
          }
        ]
      })
    });

    
    const dados = await resposta.json();

    if (!dados.choices) {
      console.error("Erro da Groq:", dados);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erro ao obter resposta da IA" })
      };
    }

    const textoResposta = dados.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ resposta: textoResposta })
    };

  } catch (erro) {
    console.error("Erro na função chat:", erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno na função" })
    };
  }
}