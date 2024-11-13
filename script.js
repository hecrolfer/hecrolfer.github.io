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

// Función para la jugada humana
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
