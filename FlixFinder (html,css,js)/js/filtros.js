document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[name="plataforma"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltros);
    });

    aplicarFiltros();
});

function aplicarFiltros() {
    const checkboxes = document.querySelectorAll('input[name="plataforma"]:checked');
    const plataformasSelecionadas = Array.from(checkboxes).map(checkbox => checkbox.value);

    recomendarFilmes(plataformasSelecionadas);
}
