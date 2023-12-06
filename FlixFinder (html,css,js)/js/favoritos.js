const apiKey = '1d02e45a83f34b78c9fb0a1df06848e0';
const apiUrl = 'https://api.themoviedb.org/3';

function displayMessage(mensagem) {
    let msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function pesquisarFilmes(query) {
    if (!query) {S
        displayMessage("Por favor, insira um termo de pesquisa.");
        return;
    }

    fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displayFilmesPesquisa(data.results);
        })
        .catch(error => {
            console.error('Erro ao pesquisar filmes:', error);
            displayMessage("Erro ao pesquisar filmes");
        });
}

function displayFilmesPesquisa(filmes) {
    let listaFilmes = document.getElementById('lista-filmes').getElementsByTagName('tbody')[0];
    listaFilmes.innerHTML = '';

    filmes.forEach(filme => {
        fetch(`${apiUrl}/movie/${filme.id}?api_key=${apiKey}&language=pt-BR`)
            .then(response => response.json())
            .then(detalhes => {
                let row = listaFilmes.insertRow();
                row.innerHTML = `
                    <td>${detalhes.title}</td>
                    <td>${detalhes.genres.map(genre => genre.name).join(', ')}</td>
                    <td>${detalhes.spoken_languages.map(lang => lang.name).join(', ')}</td>
                    <td>${detalhes.vote_average}</td>
                    <td>
                        <button onclick="abrirModal('${detalhes.id}', '${detalhes.title}', '${detalhes.genres.map(genre => genre.name).join(', ')}', '${detalhes.spoken_languages.map(lang => lang.name).join(', ')}')">Adicionar aos Favoritos</button>
                    </td>
                `;
            })
            .catch(error => {
                console.error('Erro ao obter detalhes do filme:', error);
            });
    });
}

function abrirModal(id, titulo, generos, linguas) {
    document.getElementById('filmeId').value = id;
    document.getElementById('modal-titulo-filme').textContent = titulo;
    document.getElementById('generosFilme').value = generos; 
    document.getElementById('linguasFilme').value = linguas; 
    document.getElementById('notaUsuario').value = '';
    document.getElementById('comentarioUsuario').value = '';
    document.getElementById('modal-filme').style.display = 'block';
    document.getElementById('btnSalvarFavorito').onclick = function() { salvarFavorito(generos, linguas); };
}

function salvarFavorito(generos, linguas) {
    let index = document.getElementById('filmeId').value;
    let titulo = document.getElementById('modal-titulo-filme').textContent;
    let notaUsuario = document.getElementById('notaUsuario').value;
    let comentarioUsuario = document.getElementById('comentarioUsuario').value;

    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    let filmeExistente = favoritos.findIndex(filme => filme.filmeId === index);

    if (notaUsuario === '' || notaUsuario < 0 || notaUsuario > 5) {
        displayMessage("Por favor, forneça uma nota válida entre 0 e 5.");
        return;
    }

    if (comentarioUsuario.trim() === '') {
        displayMessage("Por favor, forneça um comentário.");
        return;
    }

    if (filmeExistente !== -1) {
        favoritos[filmeExistente] = { filmeId: index, titulo, notaUsuario, comentarioUsuario, generos, linguas };
    } else {
        favoritos.push({ filmeId: index, titulo, notaUsuario, comentarioUsuario, generos, linguas });
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    exibirFavoritos();
    fecharModal();
}

function exibirFavoritos() {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    let listaFavoritos = document.getElementById('lista-favoritos').getElementsByTagName('tbody')[0];
    listaFavoritos.innerHTML = '';

    favoritos.forEach(filme => {
        let row = listaFavoritos.insertRow();
        row.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.generos}</td>
            <td>${filme.linguas}</td>
            <td>${filme.notaUsuario}</td>
            <td>${filme.comentarioUsuario}</td>
            <td>
                <button onclick="editarFavorito('${filme.filmeId}')">Editar</button>
                <button onclick="removerFavorito('${filme.filmeId}')">Remover</button>
            </td>
        `;
    });
}

function editarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos'));
    let filme = favoritos.find(filme => filme.filmeId === id);
    abrirModal(id, filme.titulo, filme.generos, filme.linguas);
    document.getElementById('notaUsuario').value = filme.notaUsuario;
    document.getElementById('comentarioUsuario').value = filme.comentarioUsuario;
    document.getElementById('btnSalvarFavorito').textContent = 'Atualizar'; // Alterar o texto do botão para "Atualizar"
    document.getElementById('btnSalvarFavorito').onclick = function() { salvarFavorito(filme.generos, filme.linguas); }; // Modificado
}

function removerFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos'));
    favoritos = favoritos.filter(filme => filme.filmeId !== id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    exibirFavoritos();
}

function fecharModal() {
    document.getElementById('modal-filme').style.display = 'none';
}

function pesquisarFavoritos(query) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    let filtrados = query ? favoritos.filter(filme => filme.titulo.toLowerCase().includes(query.toLowerCase())) : favoritos;
    exibirFavoritosFiltrados(filtrados);
}

function exibirFavoritosFiltrados(favoritos) {
    let listaFavoritos = document.getElementById('lista-favoritos').getElementsByTagName('tbody')[0];
    listaFavoritos.innerHTML = '';

    favoritos.forEach(filme => {
        let row = listaFavoritos.insertRow();
        row.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.generos}</td>
            <td>${filme.linguas}</td>
            <td>${filme.notaUsuario}</td>
            <td>${filme.comentarioUsuario}</td>
            <td>
                <button onclick="editarFavorito('${filme.filmeId}')">Editar</button>
                <button onclick="removerFavorito('${filme.filmeId}')">Remover</button>
            </td>
        `;
    });
}

function pesquisarPessoas(query) {
    if (!query) {
        displayMessage("Por favor, insira um nome de ator/atriz/diretor.");
        return;
    }

    fetch(`${apiUrl}/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                // Supondo que queremos apenas a primeira pessoa encontrada
                let pessoaId = data.results[0].id;
                buscarFilmesPorPessoa(pessoaId);
            } else {
                displayMessage("Nenhuma pessoa encontrada.");
            }
        })
        .catch(error => {
            console.error('Erro ao pesquisar pessoas:', error);
            displayMessage("Erro ao pesquisar pessoas");
        });
}



function buscarFilmesPorPessoa(pessoaId) {
    fetch(`${apiUrl}/person/${pessoaId}/movie_credits?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            displayFilmesPesquisa(data.cast); // Mostra filmes em que a pessoa atuou
        })
        .catch(error => {
            console.error('Erro ao buscar filmes da pessoa:', error);
            displayMessage("Erro ao buscar filmes da pessoa");
        });
}

document.addEventListener('DOMContentLoaded', exibirFavoritos);


