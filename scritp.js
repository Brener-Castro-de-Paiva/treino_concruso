// 1. Configurar o Supabase (Coloque os dados do SEU projeto)
const SUPABASE_URL = 'https://jmxtodoxnwoebsjttuld.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YDupmBrVEm6i00kIkodNqA_gfNxOKq_';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Lógica de Envio do Formulário
document.getElementById("form-simulado").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Pega os valores
    const nome = document.getElementById("nome").value.trim();
    const concurso = document.getElementById("concurso").value.trim();
    const materias = document.getElementById("materias").value.trim();
    const percentual = parseInt(document.getElementById("percentual").value);
    const mensagem = document.getElementById("mensagem");

    // Feedback visual
    mensagem.textContent = "Salvando no banco...";
    mensagem.style.color = "#1a237e";

    // 3. Envia para o Supabase
    const { error } = await _supabase
        .from('simulados')
        .insert([{ 
            nome: nome, 
            concurso: concurso, 
            materias: materias, 
            percentual: percentual 
        }]);

    if (error) {
        console.error(error);
        mensagem.textContent = "❌ Erro ao salvar. Tente novamente.";
        mensagem.style.color = "#c62828";
        return;
    }

    // 4. Se salvou, gera a análise na tela (Efeito para o vídeo)
    gerarAnalise(nome, concurso, materias, percentual);
});

// 5. Função que cria o card de análise baseado na nota
function gerarAnalise(nome, concurso, materias, percentual) {
    // Esconde o form e mostra o resultado
    document.getElementById("formulario-section").style.display = "none";
    const sectionResultado = document.getElementById("resultado-section");
    sectionResultado.style.display = "block";

    // Descobre a cor e a mensagem baseada na nota
    let classeCor, textoStatus, conselho;
    
    if (percentual >= 80) {
        classeCor = "verde"; textoStatus = "Excelente!";
        conselho = "Você está no caminho certo. Foque em revisões espaçadas para não esquecer o conteúdo.";
    } else if (percentual >= 60) {
        classeCor = "amarelo"; textoStatus = "Bom, mas pode melhorar!";
        conselho = `Você está na média. Das matérias listadas (${materias}), foque nas que você tem mais dificuldade e faça mais questões.`;
    } else {
        classeCor = "vermelho"; textoStatus = "Atenção!";
        conselho = "Nota abaixo do ideal. O ideal é revisar a teoria das matérias: " + materias + " antes de fazer novos simulados.";
    }

    // Monta o HTML do resultado
    const card = document.getElementById("card-resultado");
    card.innerHTML = `
        <h3>Olá, ${nome}!</h3>
        <p>Meta: <strong>${concurso}</strong></p>
        <div class="destaque ${classeCor}">
            ${percentual}% de Acerto - ${textoStatus}
        </div>
        <p><strong>Análise:</strong> ${conselho}</p>
    `;

    // Rola a página até o resultado para ficar bonito no vídeo
    sectionResultado.scrollIntoView({ behavior: 'smooth' });
}