document.addEventListener('DOMContentLoaded', function () {
    const userStatusDiv = document.getElementById('welcomeMessage');
    const menuList = document.getElementById('menu');
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const apiKey = '1d02e45a83f34b78c9fb0a1df06848e0';
    const apiUrl = 'https://api.themoviedb.org/3';

    async function exibirDetalhesAoClicar(filmeId) {
        try {
            if (!filmeId || filmeId === 'null') {
                console.error('ID do filme inválido:', filmeId);
                return;
            }

            const response = await fetch(`${apiUrl}/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`);

            if (!response.ok) {
                console.error('Erro na resposta da API:', response.status, response.statusText);
                return;
            }

            const filmeDetalhes = await response.json();

            const modalContent = `
                <div class="modal-content">
                    <span class="close" onclick="fecharModal()">&times;</span>
                    <h2>${filmeDetalhes.title}</h2>
                    <img src="https://image.tmdb.org/t/p/w500${filmeDetalhes.poster_path}" alt="${filmeDetalhes.title}">
                    <p><strong>Sinopse:</strong> ${filmeDetalhes.overview}</p>
                    <p><strong>Data de Lançamento:</strong> ${filmeDetalhes.release_date}</p>
                    <p><strong>Nota:</strong> ${filmeDetalhes.vote_average}</p>
                    <p><strong><a href="https://www.themoviedb.org/movie/${filmeId}" target="_blank">Ver no TMDB</a></strong></p>
                </div>
            `;

            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = modalContent;
            document.body.appendChild(modal);

        } catch (error) {
            console.error('Erro ao obter detalhes do filme:', error);
            alert('Erro ao obter detalhes do filme. Tente novamente mais tarde.');
        }
    }

    async function pesquisarFilmes(query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`);
            const resultados = await response.json();
  
            const cartazesContainer = document.getElementById('cartazesContainer');
            cartazesContainer.innerHTML = '';
  
            resultados.results.forEach((filme) => {
                if (typeof filme.id === 'number' && filme.id > 0) {
                    const cartazElement = document.createElement('img');
                    cartazElement.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                    cartazElement.alt = filme.title;
  
                    // Certifique-se de que o atributo data-id seja uma string válida
                    cartazElement.setAttribute('data-id', `${filme.id}`);
  
                    // Adicione o evento de clique para exibir os detalhes do filme
                    cartazElement.addEventListener('click', exibirDetalhesAoClicar);
  
                    cartazesContainer.appendChild(cartazElement);
                }
            });
        } catch (error) {
            console.error('Erro ao pesquisar filmes:', error);
            alert('Erro ao pesquisar filmes. Tente novamente mais tarde.');
        }
    }
  

    const botaoPesquisar = document.getElementById('botaoPesquisar');
    if (botaoPesquisar) {
        botaoPesquisar.addEventListener('click', function () {
            const termoPesquisa = document.getElementById('termoPesquisa').value;
            pesquisarFilmes(termoPesquisa);
        });
    }

    if (usuarioLogado) {
        userStatusDiv.innerHTML = `Olá, ${usuarioLogado.username}!`;
        userStatusDiv.style.display = 'block';

        const logoutButton = document.createElement('li');
        logoutButton.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
        menuList.appendChild(logoutButton);

        if (!document.querySelector('#menu a[href="favoritos.html"]')) {
            const favoritosLink = document.createElement('li');
            favoritosLink.innerHTML = '<a href="favoritos.html">Favoritos</a>';
            menuList.appendChild(favoritosLink);
        }
    } else {
        const loginButton = document.createElement('li');
        loginButton.innerHTML = '<a href="login.html">Login</a>';
        menuList.appendChild(loginButton);
    }

    const favoritosLink = document.querySelector('#menu a[href="favoritos.html"]');
    if (favoritosLink) {
        favoritosLink.addEventListener('click', function (event) {
            const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

            if (!usuarioLogado) {
                event.preventDefault();
                alert('Você precisa fazer login para acessar esta ferramenta. Se não tiver uma conta, cadastre-se.');
                window.location.href = 'login.html';
            }
        });
    }

    const recomendacoesContainer = document.getElementById('recomendacoes');
    recomendacoesContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            const filmeId = event.target.getAttribute('data-id');
            exibirDetalhesAoClicar(filmeId);
        }
    });
});

function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.reload();
}

function fecharModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}
