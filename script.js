let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

function avanzarPantalla() {
    // Oculta la pantalla actual
    pantallas[pantallaActual].classList.remove('visible');
    
    // Avanza a la siguiente pantalla
    pantallaActual++;
    
    // Muestra la siguiente pantalla si existe
    if (pantallaActual < pantallas.length) {
        pantallas[pantallaActual].classList.add('visible');
    }
}

function iniciarMelodia() {
    alert("¡Que empiece tu aventura musical!");
}
