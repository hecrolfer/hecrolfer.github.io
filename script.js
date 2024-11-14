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
            intentosFallidos++; // Contar el empate como un intento fallido
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
        intentosFallidos++; // Incrementar contador en caso de empate
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


// Variables del juego de esquivar rocas
let canvas = document.getElementById("juegoCanvas");
let ctx = canvas.getContext("2d");

let sari = new Image();
sari.src = "assets/images/sari.PNG";
let rockImage = new Image();
rockImage.src = "assets/images/rocks.png";

let sariX = canvas.width / 2 - 25; // Posición inicial de Sari
let sariY = canvas.height - 60; // Altura fija de Sari
let sariWidth = 50;
let sariHeight = 50;

let rocks = [];
let rockSpeed = 2; // Velocidad inicial de caída de las rocas
let esquivadas = 0; // Contador de rocas esquivadas
let gameInterval;
let rockInterval;

// Función para iniciar el juego de esquivar rocas
function iniciarJuego() {
    rocks = [];
    esquivadas = 0;
    document.getElementById("continuar-btn").disabled = true;
    clearInterval(gameInterval);
    clearInterval(rockInterval);
    gameInterval = setInterval(actualizarJuego, 20);
    rockInterval = setInterval(generarRoca, 1000);
}

// Generar una roca en una posición aleatoria
function generarRoca() {
    let rockX = Math.random() * (canvas.width - 30);
    rocks.push({ x: rockX, y: -30, width: 30, height: 30 });
}

// Actualizar el juego en cada frame
function actualizarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sari, sariX, sariY, sariWidth, sariHeight);

    // Dibujar y mover rocas
    for (let i = 0; i < rocks.length; i++) {
        let rock = rocks[i];
        rock.y += rockSpeed;
        ctx.drawImage(rockImage, rock.x, rock.y, rock.width, rock.height);

        // Comprobar colisión con Sari
        if (colision(rock, { x: sariX, y: sariY, width: sariWidth, height: sariHeight })) {
            mostrarPopupDerrota();
            return;
        }

        // Remover rocas que salen de la pantalla y aumentar el contador
        if (rock.y > canvas.height) {
            rocks.splice(i, 1);
            esquivadas++;
            i--;

            // Aumentar velocidad y desbloquear el botón al esquivar 50 rocas
            if (esquivadas === 50) {
                clearInterval(gameInterval);
                clearInterval(rockInterval);
                document.getElementById("continuar-btn").disabled = false;
                alert("Enhorabuena, has conseguido sortear las trampas");
                return;
            }
        }
    }
}

// Función para detectar colisiones
function colision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Mostrar el popup de derrota
function mostrarPopupDerrota() {
    clearInterval(gameInterval);
    clearInterval(rockInterval);
    document.getElementById("popup-derrota").style.display = "block";
}

// Cerrar el popup de derrota y reiniciar el juego
function cerrarPopupDerrota() {
    document.getElementById("popup-derrota").style.display = "none";
    iniciarJuego();
}

// Función para manejar el movimiento de Sari con las flechas
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && sariX > 0) {
        sariX -= 20;
    } else if (event.key === "ArrowRight" && sariX < canvas.width - sariWidth) {
        sariX += 20;
    }
});
