let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');
let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = "O";

// Función para aceptar el reto y mostrar el juego de tres en raya
function aceptarReto() {
    pantallas[pantallaActual].classList.remove('visible');
    pantallaActual++;
    pantallas[pantallaActual].classList.add('visible');
}

// Función para mostrar el popup si se hace clic en el botón de la gallina
function mostrarPopup() {
    document.getElementById("popup-cagueta").style.display = "block";
}

// Función para cerrar el popup
function cerrarPopup() {
    document.getElementById("popup-cagueta").style.display = "none";
}

// Resto de funciones del juego de tres en raya

function jugadaHumana(pos) {
    if (tablero[pos] === "" && jugadorActual === "O") {
        tablero[pos] = "O";
        actualizarTablero();
        if (verificarVictoria("O")) {
            document.getElementById("mensaje1").innerText = "¡Has ganado! El alienígena se rinde y te deja continuar.";
            document.getElementById("explorar-btn").disabled = false;
            document.getElementById("explorar-btn").removeAttribute("title");
        } else if (tableroCompleto()) {
            document.getElementById("mensaje1").innerText = "Es un empate. Inténtalo de nuevo.";
            reiniciarTablero();
        } else {
            jugadorActual = "X";
            setTimeout(jugadaAlien, 500);
        }
    }
}

function jugadaAlien() {
    let movimientosDisponibles = tablero.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    let movimiento;
    if (Math.random() < 0.2) {
        movimiento = movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
    } else {
        movimiento = mejorMovimiento("X") || mejorMovimiento("O") || movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
    }
    tablero[movimiento] = "X";
    actualizarTablero();
    if (verificarVictoria("X")) {
        document.getElementById("mensaje1").innerText = "El alienígena ha ganado. Inténtalo de nuevo.";
        reiniciarTablero();
    } else if (tableroCompleto()) {
        document.getElementById("mensaje1").innerText = "Es un empate. Inténtalo de nuevo.";
        reiniciarTablero();
    } else {
        jugadorActual = "O";
    }
}

function actualizarTablero() {
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach((celda, index) => {
        celda.innerText = tablero[index];
        celda.classList.remove("O", "X");
        if (tablero[index] === "O") {
            celda.classList.add("O");
        } else if (tablero[index] === "X") {
            celda.classList.add("X");
        }
    });
}

function verificarVictoria(jugador) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return combinacionesGanadoras.some(combinacion =>
        combinacion.every(idx => tablero[idx] === jugador)
    );
}

function tableroCompleto() {
    return tablero.every(celda => celda !== "");
}

function reiniciarTablero() {
    tablero = ["", "", "", "", "", "", "", "", ""];
    actualizarTablero();
    jugadorActual = "O";
    document.getElementById("explorar-btn").disabled = true;
    document.getElementById("explorar-btn").setAttribute("title", "El alien te impide continuar hasta que le ganes.");
}

function mejorMovimiento(jugador) {
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            tablero[i] = jugador;
            if (verificarVictoria(jugador)) {
                tablero[i] = "";
                return i;
            }
            tablero[i] = "";
        }
    }
    return null;
}

function avanzarPantalla() {
    if (pantallaActual === 1 && !mensajesDescifrados.carta1) {
        alert("Debes ganar al alienígena en el tres en raya para continuar.");
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
