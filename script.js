let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');

// Objeto para verificar que todos los mensajes han sido descifrados
const mensajesDescifrados = {
    carta1: false,
    carta2: false,
    carta3: false
};

// Minijuego 1: Emparejar Estrellas
// Patrón de Estrellas para Memorizar y Reproducir
const patronEstrellas = [1, 4, 6, 8, 9]; // Posiciones en orden del patrón de constelación
let seleccionEstrellas = [];
let patronMostrado = false;

function mostrarPatron() {
    const patron = document.getElementById('patron-estrellas');
    patron.style.display = 'block';
    setTimeout(() => {
        patron.style.display = 'none';
        patronMostrado = true;
        document.getElementById('instruccion').innerText = "Reproduce el patrón seleccionando las estrellas correctas.";
    }, 3000); // Muestra el patrón por 3 segundos
}

function seleccionarEstrella(num) {
    if (!patronMostrado) return; // Evita que seleccione antes de ver el patrón

    seleccionEstrellas.push(num);
    if (seleccionEstrellas.length === patronEstrellas.length) {
        if (JSON.stringify(seleccionEstrellas) === JSON.stringify(patronEstrellas)) {
            document.getElementById('mensaje1').innerText = "El tiempo es solo un número, nunca es tarde para aprender.";
            mensajesDescifrados.carta1 = true;
        } else {
            alert("La secuencia es incorrecta. Inténtalo de nuevo.");
        }
        seleccionEstrellas = [];
    }
}

// Llama a mostrar el patrón al cargar esta pantalla
document.addEventListener("DOMContentLoaded", () => {
    if (pantallaActual === 1) mostrarPatron();
});

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
