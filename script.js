let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

// Objeto para verificar que todos los mensajes han sido descifrados
const mensajesDescifrados = {
    carta1: false,
    carta2: false,
    carta3: false
};

// Minijuego 1: Emparejar Estrellas
let patronEstrellas = [1, 2, 3, 4];
let seleccionEstrellas = [];
function seleccionarEstrella(num) {
    seleccionEstrellas.push(num);
    if (seleccionEstrellas.length === patronEstrellas.length) {
        if (JSON.stringify(seleccionEstrellas) === JSON.stringify(patronEstrellas)) {
            document.getElementById('mensaje1').innerText = "El tiempo es solo un número, nunca es tarde para aprender.";
            mensajesDescifrados.carta1 = true;
        }
        seleccionEstrellas = [];
    }
}

// Minijuego 2: Secuencia Musical
let secuenciaCristales = [1, 2, 3];
let intentoCristales = [];
function tocarCristal(num) {
    intentoCristales.push(num);
    if (intentoCristales.length === secuenciaCristales.length) {
        if (JSON.stringify(intentoCristales) === JSON.stringify(secuenciaCristales)) {
            document.getElementById('mensaje2').innerText = "A veces pienso que en lugar del deporte debería haber elegido la música.";
            mensajesDescifrados.carta2 = true;
        }
        intentoCristales = [];
    }
}

// Minijuego 3: Recoger Luces Correctas
let secuenciaLuces = ['¿', 'Qué', 'instrumento', 'cojo', '?'];
let intentoLuces = [];
function recogerLuz(palabra) {
    intentoLuces.push(palabra);
    if (intentoLuces.length === secuenciaLuces.length) {
        if (JSON.stringify(intentoLuces) === JSON.stringify(secuenciaLuces)) {
            document.getElementById('mensaje3').innerText = "¿Y qué instrumento cojo? ¿El piano? A mí me gusta.";
            mensajesDescifrados.carta3 = true;
        }
        intentoLuces = [];
    }
}

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

// Función para verificar si todos los mensajes han sido descifrados
function todosMensajesDescifrados() {
    return Object.values(mensajesDescifrados).every(descifrado => descifrado);
}

// Función para mostrar la última frase después de abrir el regalo
function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
}
