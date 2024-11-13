let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');
let tablero = ["", "", "", "", "", "", "", "", ""]; // Tablero vacío
let jugadorActual = "O"; // Empieza el jugador humano

// Objeto para verificar que todos los mensajes han sido descifrados
const mensajesDescifrados = {
    carta1: false,
    carta2: false,
    carta3: false
};

// Función para la jugada humana en el minijuego de tres en raya
function jugadaHumana(pos) {
    if (tablero[pos] === "" && jugadorActual === "O") {
        tablero[pos] = "O";
        actualizarTablero();
        if (verificarVictoria("O")) {
            document.getElementById("mensaje1").innerText = "¡Has ganado! El alienígena se rinde y te deja continuar.";
            mensajesDescifrados.carta1 = true;
            document.getElementById("explorar-btn").disabled = false; // Habilita el botón de explorar
            document.getElementById("explorar-btn").removeAttribute("title"); // Quita el tooltip
        } else if (tableroCompleto()) {
            document.getElementById("mensaje1").innerText = "Es un empate. Inténtalo de nuevo.";
            reiniciarTablero();
        } else {
            jugadorActual = "X";
            setTimeout(jugadaAlien, 500);
        }
    }
}

// Función para la jugada del alienígena con una IA mejorada y errores aleatorios
function jugadaAlien() {
    let movimientosDisponibles = tablero.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    let movimiento;
    // 20% de probabilidad de equivocarse para dar una oportunidad al jugador
    if (Math.random() < 0.2) {
        movimiento = movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
    } else {
        // Intenta ganar o bloquear si hay una oportunidad
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

// Función para actualizar el tablero en el HTML
function actualizarTablero() {
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach((celda, index) => {
        celda.innerText = tablero[index];
    });
}

// Función para verificar victoria
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

// Función para verificar si el tablero está lleno
function tableroCompleto() {
    return tablero.every(celda => celda !== "");
}

// Reiniciar el tablero para una nueva partida
function reiniciarTablero() {
    tablero = ["", "", "", "", "", "", "", "", ""];
    actualizarTablero();
    jugadorActual = "O";
    document.getElementById("explorar-btn").disabled = true; // Deshabilita el botón de explorar al reiniciar
    document.getElementById("explorar-btn").setAttribute("title", "El alien te impide continuar hasta que le ganes."); // Agrega el tooltip nuevamente
}

// Mejor movimiento para ganar o bloquear
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

// Función para avanzar a la siguiente pantalla
function avanzarPantalla() {
    if (pantallaActual === 1 && !mensajesDescifrados.carta1) {
        // Muestra un mensaje si intenta avanzar sin ganar el minijuego
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
