let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

function avanzarPantalla() {
    pantallas[pantallaActual].classList.remove('visible');
    pantallaActual++;
    if (pantallaActual < pantallas.length - 1) {
        pantallas[pantallaActual].classList.add('visible');
    }
}

function descifrarTexto(cartaId, fraseDescifrada) {
    let carta = document.getElementById(cartaId);
    carta.innerText = fraseDescifrada;
}

function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
}
