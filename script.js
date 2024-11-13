let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

// Objeto para verificar que todos los mensajes han sido descifrados
const mensajesDescifrados = {
    carta1: false,
    carta2: false,
    carta3: false
};

// Función para avanzar a la siguiente pantalla
function avanzarPantalla() {
    // Si es la última pantalla antes de la revelación final, verifica que todos los mensajes estén descifrados
    if (pantallaActual === pantallas.length - 3 && !todosMensajesDescifrados()) {
        alert("Debes descifrar todos los mensajes antes de continuar.");
        return;
    }

    // Avanza a la siguiente pantalla si se cumplen las condiciones
    pantallas[pantallaActual].classList.remove('visible');
    pantallaActual++;
    if (pantallaActual < pantallas.length) {
        pantallas[pantallaActual].classList.add('visible');
    }
}

// Función para retroceder a la pantalla anterior
function retrocederPantalla() {
    if (pantallaActual > 0) {
        pantallas[pantallaActual].classList.remove('visible');
        pantallaActual--;
        pantallas[pantallaActual].classList.add('visible');
    }
}

// Función para descifrar el texto de un holograma
function descifrarTexto(cartaId, fraseDescifrada) {
    let carta = document.getElementById(cartaId);
    carta.innerText = fraseDescifrada;

    // Marca el mensaje como descifrado en el objeto de control
    mensajesDescifrados[cartaId] = true;
}

// Función para verificar si todos los mensajes han sido descifrados
function todosMensajesDescifrados() {
    return Object.values(mensajesDescifrados).every(descifrado => descifrado);
}

// Función para mostrar la última frase después de abrir el regalo
function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
}
