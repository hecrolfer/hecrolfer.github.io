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
    if (pantallaActual === pantallas.length - 3 && !todosMensajesDescifrados()) {
        alert("Debes descifrar todos los mensajes antes de continuar.");
        return;
    }

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

// Función para simular el efecto de tipeo al descifrar el mensaje
function descifrarTexto(cartaId, fraseDescifrada) {
    let carta = document.getElementById(cartaId);
    let i = 0;

    // Reseteamos el texto para el efecto de tipeo
    carta.innerText = '';
    mensajesDescifrados[cartaId] = true; // Marca como descifrado

    // Función para mostrar las letras una por una
    function tipo() {
        if (i < fraseDescifrada.length) {
            carta.innerText += fraseDescifrada.charAt(i);
            i++;
            setTimeout(tipo, 50); // Ajusta el tiempo para cambiar la velocidad del efecto
        }
    }
    tipo(); // Inicia el efecto de tipeo
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
