// Função para calcular a pontuação de compatibilidade com base na nota do usuário e nota do TMDB
function calcularPontuacaoCompatibilidade(notaUsuario, notaTMDB) {
    const pesoNotaUsuario = 0.7;
    const pesoNotaTMDB = 0.3;

    return (notaUsuario * pesoNotaUsuario) + (notaTMDB * pesoNotaTMDB);
}

// Função para obter filmes do TMDB com base em vários gêneros
async function getFilmesTMDBPorGeneros(generos) {
    const apiKey = '1d02e45a83f34b78c9fb0a1df06848e0'; // Substitua pela chave de API real do TMDB
    const generosQuery = generos.join(',');

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${generosQuery}&sort_by=popularity.desc&page=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.results.length > 0) {
            return data.results;
        } else {
            throw new Error('Nenhum filme encontrado para os gêneros.');
        }
    } catch (error) {
        throw new Error(`Erro ao obter filmes do TMDB: ${error.message}`);
    }
}

// Função principal para processar os filmes favoritos e obter recomendações
async function recomendarFilmes() {
    const filmesFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const generoAvaliacoesMap = new Map(); // Mapeia gêneros para avaliações médias
    const generoFrequenciaMap = new Map(); // Mapeia gêneros para a quantidade de vezes que aparecem nos favoritos

    // Calcula a média das avaliações por gênero e a frequência de cada gênero nos favoritos
    filmesFavoritos.forEach(filme => {
        const generos = filme.generos.split(', ');
        generos.forEach(genero => {
            if (!generoAvaliacoesMap.has(genero)) {
                generoAvaliacoesMap.set(genero, { total: 0, count: 0 });
                generoFrequenciaMap.set(genero, 0);
            }

            generoAvaliacoesMap.get(genero).total += parseFloat(filme.notaUsuario);
            generoAvaliacoesMap.get(genero).count += 1;
            generoFrequenciaMap.set(genero, generoFrequenciaMap.get(genero) + 1);
        });
    });

    // Calcula a média das avaliações por gênero
    generoAvaliacoesMap.forEach((avaliacoes, genero) => {
        generoAvaliacoesMap.set(genero, avaliacoes.total / avaliacoes.count);
    });

    // Encontra o gênero mais frequente nos favoritos do usuário
    let generoMaisFrequente = null;
    let maxFrequencia = 0;

    generoFrequenciaMap.forEach((frequencia, genero) => {
        if (frequencia > maxFrequencia) {
            generoMaisFrequente = genero;
            maxFrequencia = frequencia;
        }
    });

    // Busca filmes no TMDB com base no gênero mais frequente
    if (generoMaisFrequente) {
        try {
            const filmesDoGenero = await getFilmesTMDBPorGeneros([generoMaisFrequente]);

            // Filtra filmes que estão nos favoritos
            const filmesNaoFavoritos = filmesDoGenero.filter(
                filme => !filmesFavoritos.some(f => f.titulo === filme.title)
            );

            // Embaralha a lista de filmes para tornar a seleção aleatória
            shuffleArray(filmesNaoFavoritos);

            // Exibe os três primeiros filmes não favoritos na tela
            const container = document.getElementById('recomendacoes');
            container.innerHTML = '';

            filmesNaoFavoritos.slice(0, 3).forEach(filme => {
                const cartaz = document.createElement('img');
                cartaz.src = filme.poster_path
                    ? `https://image.tmdb.org/t/p/w200${filme.poster_path}`
                    : 'imgs/cartaz.png'; // Substitua pelo caminho real para um cartaz padrão
                cartaz.alt = filme.title;

                container.appendChild(cartaz);
            });
        } catch (error) {
            console.error(error.message);
        }
    }
}

// Função para embaralhar um array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Chame a função principal após o carregamento do DOM
document.addEventListener('DOMContentLoaded', recomendarFilmes);

