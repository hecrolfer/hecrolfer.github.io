let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');
let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = "O";
let intentosFallidos = 0; // Contador para los intentos fallidos del jugador

// Función para avanzar a la siguiente pantalla
function avanzarPantalla() {
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

// Función para mostrar el popup de "Soy una gallina"
function mostrarPopupCagueta() {
    document.getElementById("popup-cagueta").style.display = "block";
}

// Función para cerrar cualquier popup
function cerrarPopup() {
    document.getElementById("popup-cagueta").style.display = "none";
    document.getElementById("popup-perdida").style.display = "none";
    document.getElementById("popup-victoria").style.display = "none";
}

// Función para aceptar el reto y mostrar el juego de tres en raya
function aceptarReto() {
    pantallas[pantallaActual].classList.remove('visible');
    pantallaActual++;
    pantallas[pantallaActual].classList.add('visible');
}

// Función para iniciar el desvanecimiento y reiniciar el tablero después de un empate
function animacionDesvanecerTablero() {
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach(celda => {
        celda.classList.add("desvanecer"); // Añadimos la clase de animación
    });

    setTimeout(() => {
        reiniciarTablero();
    }, 1000); // Esperamos 1 segundo para que termine la animación antes de reiniciar
}

// Función para manejar el turno del jugador
function jugadaHumana(pos) {
    if (tablero[pos] === "" && jugadorActual === "O") {
        tablero[pos] = "O";
        actualizarTablero();
        if (verificarVictoria("O")) {
            mostrarPopupVictoria(); // Mostrar popup de victoria si el jugador gana
            intentosFallidos = 0; // Reiniciar contador si el jugador gana
        } else if (tableroCompleto()) {
            animacionDesvanecerTablero(); // Activar animación y reiniciar en caso de empate
        } else {
            jugadorActual = "X";
            setTimeout(jugadaAlien, 500);
        }
    }
}

// Función para manejar el turno del alienígena con ajuste de dificultad
function jugadaAlien() {
    let movimiento;
    if (intentosFallidos >= 3) {
        movimiento = movimientoFacil("X"); // Bajar la dificultad tras 3 intentos fallidos
    } else {
        movimiento = mejorMovimiento("X"); // Jugar con dificultad normal
    }
    
    tablero[movimiento] = "X";
    actualizarTablero();
    if (verificarVictoria("X")) {
        mostrarPopupPerdida(); // Mostrar popup de derrota en caso de derrota del jugador
        intentosFallidos++; // Incrementar contador si el jugador pierde
    } else if (tableroCompleto()) {
        animacionDesvanecerTablero(); // Activar animación y reiniciar en caso de empate
    } else {
        jugadorActual = "O";
    }
}

// Función para actualizar el tablero en el HTML
function actualizarTablero() {
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach((celda, index) => {
        celda.innerText = tablero[index];
        celda.classList.remove("O", "X", "desvanecer"); // Elimina clases previas y desvanecimiento
        if (tablero[index] === "O") {
            celda.classList.add("O"); // Añade clase 'O' para el jugador
        } else if (tablero[index] === "X") {
            celda.classList.add("X"); // Añade clase 'X' para el alienígena
        }
    });
}

// Función para reiniciar el tablero después de la animación
function reiniciarTablero() {
    tablero = ["", "", "", "", "", "", "", "", ""];
    actualizarTablero();
    jugadorActual = "O";
    document.getElementById("explorar-btn").disabled = true;
    document.getElementById("explorar-btn").setAttribute("title", "El alien te impide continuar hasta que le ganes.");
}

// Función para mostrar el popup de derrota
function mostrarPopupPerdida() {
    document.getElementById("popup-perdida").style.display = "block";
    reiniciarTablero();
}

// Función para mostrar el popup de victoria y desbloquear el botón
function mostrarPopupVictoria() {
    document.getElementById("popup-victoria").style.display = "block";
    document.getElementById("explorar-btn").disabled = false;
    document.getElementById("explorar-btn").removeAttribute("title");
}

// Función para verificar si el tablero está completo
function tableroCompleto() {
    return tablero.every(celda => celda !== "");
}

// Función para verificar si hay un ganador
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

// Función para encontrar el mejor movimiento usando lógica avanzada
function mejorMovimiento(jugador) {
    let mejorPuntuacion = -Infinity;
    let movimientoOptimo;

    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            tablero[i] = jugador;
            let puntuacion = minimax(tablero, 0, false);
            tablero[i] = "";
            if (puntuacion > mejorPuntuacion) {
                mejorPuntuacion = puntuacion;
                movimientoOptimo = i;
            }
        }
    }
    return movimientoOptimo;
}

// Función Minimax para calcular el mejor movimiento en modo difícil
function minimax(tablero, profundidad, esMaximizador) {
    if (verificarVictoria("X")) return 10 - profundidad;
    if (verificarVictoria("O")) return profundidad - 10;
    if (tableroCompleto()) return 0;

    if (esMaximizador) {
        let mejorPuntuacion = -Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === "") {
                tablero[i] = "X";
                let puntuacion = minimax(tablero, profundidad + 1, false);
                tablero[i] = "";
                mejorPuntuacion = Math.max(puntuacion, mejorPuntuacion);
            }
        }
        return mejorPuntuacion;
    } else {
        let mejorPuntuacion = Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === "") {
                tablero[i] = "O";
                let puntuacion = minimax(tablero, profundidad + 1, true);
                tablero[i] = "";
                mejorPuntuacion = Math.min(puntuacion, mejorPuntuacion);
            }
        }
        return mejorPuntuacion;
    }
}

// Función para movimiento más fácil
function movimientoFacil(jugador) {
    let movimientosDisponibles = tablero.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
}

// Función para mostrar la última frase después de abrir el regalo
function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
}
