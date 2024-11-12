let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

// Función para avanzar a la siguiente pantalla
function avanzarPantalla() {
    pantallas[pantallaActual].classList.remove('visible');
    pantallaActual++;
    if (pantallaActual < pantallas.length - 1) { // Hasta la pantalla final
        pantallas[pantallaActual].classList.add('visible');
    }
}

// Función para mostrar la última frase después de abrir el regalo
function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
}
