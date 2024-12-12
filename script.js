let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');
let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = "O";
let intentosFallidos = 0; // Contador para los intentos fallidos del jugador
let puertaSeleccionada = null; 
let jugadorMuriendo = false;
let contadorMuerte = 0;

// Variable para almacenar el estado de las puertas
const puertasEstado = {
    enfermeria: false,
    natacion: false,
    musica: false
};

// Función para avanzar a la siguiente pantalla
function avanzarPantalla() {
    // Oculta todas las pantallas antes de mostrar la nueva
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    
    // Verifica que la pantalla actual esté dentro de los límites
    if (pantallaActual < pantallas.length - 1) {
        pantallaActual++;
        pantallas[pantallaActual].classList.add('visible'); // Muestra solo la pantalla actual
    }
}

// Función para retroceder a la pantalla anterior
function retrocederPantalla() {
    // Oculta todas las pantallas antes de mostrar la nueva
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));

    if (pantallaActual > 0) {
        pantallaActual--;
        pantallas[pantallaActual].classList.add('visible'); // Muestra solo la pantalla actual
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
    document.getElementById("popup-derrota-saltos").style.display = "none";
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

// Función para manejar el turno del alienígena con movimientos aleatorios
function jugadaAlien() {
    let movimiento;

    // Probabilidad de cometer un error (30-40%)
    if (Math.random() < 0.35) {
        // Realiza un movimiento aleatorio
        movimiento = movimientoFacil("X");
    } else {
        // Usa la estrategia básica de intentar ganar o bloquear
        movimiento = movimientoEstrategico("X");
    }

    tablero[movimiento] = "X";
    actualizarTablero();

    if (verificarVictoria("X")) {
        mostrarPopupPerdida(); // Mostrar popup de derrota en caso de derrota del jugador
    } else if (tableroCompleto()) {
        animacionDesvanecerTablero(); // Activar animación y reiniciar en caso de empate
    } else {
        jugadorActual = "O";
    }
}


// Nueva función para encontrar un movimiento estratégico básico
// Función para encontrar un movimiento estratégico básico
function movimientoEstrategico(jugador) {
    // 1. Primero, intenta ganar si hay una oportunidad
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            tablero[i] = jugador;
            if (verificarVictoria(jugador)) {
                tablero[i] = ""; // Deshacer movimiento temporal
                return i;
            }
            tablero[i] = ""; // Deshacer movimiento temporal
        }
    }

    // 2. Luego, intenta bloquear al jugador si tiene una oportunidad de ganar
    let oponente = jugador === "X" ? "O" : "X";
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === "") {
            tablero[i] = oponente;
            if (verificarVictoria(oponente)) {
                tablero[i] = ""; // Deshacer movimiento temporal
                return i;
            }
            tablero[i] = ""; // Deshacer movimiento temporal
        }
    }

    // 3. Si no hay amenaza o oportunidad directa, elige un movimiento aleatorio
    return movimientoFacil(jugador);
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

// Movimiento completamente aleatorio para el alienígena
// Movimiento aleatorio
function movimientoFacil(jugador) {
    let movimientosDisponibles = tablero
        .map((val, idx) => (val === "" ? idx : null))
        .filter((val) => val !== null);
    return movimientosDisponibles[
        Math.floor(Math.random() * movimientosDisponibles.length)
    ];
}

function cerrarPopupPerdida() {
    const popup = document.getElementById("popup-perdida");
    if (popup) {
        popup.style.display = "none"; // Ocultar el popup
    }
    reiniciarTablero(); // Reiniciar el tablero después de cerrar el popup
}



let canvas = document.getElementById("juegoCanvas");
let ctx = canvas.getContext("2d");

let sari = new Image();
sari.src = "assets/images/sari.PNG";
sari.onload = () => console.log("Imagen de Sari cargada correctamente.");
sari.onerror = () => console.error("Error al cargar la imagen de Sari.");

let rockImage = new Image();
rockImage.src = "assets/images/rocks.png";
rockImage.onload = () => console.log("Imagen de rocas cargada correctamente.");
rockImage.onerror = () => console.error("Error al cargar la imagen de las rocas.");

let sariX = canvas.width / 2 - 25; // Posición inicial de Sari
let sariY = canvas.height - 60; // Altura fija de Sari
let sariXInicial = sariX;
let sariYInicial = sariY;
let sariWidth = 50;
let sariHeight = 50;

let rocks = [];
let rockSpeed = 4; // Velocidad inicial de caída de las rocas
let esquivadas = 0; // Contador de rocas esquivadas
let gameInterval;
let rockInterval;
let rockGenerationInterval = 500; // Genera una roca cada 500 ms en lugar de 1000 ms

let movimientoIzquierda = false;
let movimientoDerecha = false;
let velocidadMovimiento = 5; // Ajusta la velocidad del personaje

const velocidadInicialRocas = 4; // Velocidad inicial de caída de las rocas
const intervaloInicialGeneracionRocas = 500; // Intervalo inicial de generación de rocas en milisegundos

// Función para iniciar el juego de esquivar rocas
function iniciarJuego() {
    rocks = [];
    esquivadas = 0;
    sariX = canvas.width / 2 - 25; // Reiniciar la posición de Sari al centro
    rockSpeed = velocidadInicialRocas; // Reiniciar la velocidad de las rocas
    rockGenerationInterval = intervaloInicialGeneracionRocas; // Reiniciar el intervalo de generación de rocas
    document.getElementById("continuar-btn").disabled = true;
    clearInterval(gameInterval);
    clearInterval(rockInterval);
    gameInterval = setInterval(actualizarJuego, 20);
    rockInterval = setInterval(generarRoca, rockGenerationInterval); // Usar el intervalo reiniciado
}

// Generar una roca en una posición aleatoria
function generarRoca() {
    let rockX = Math.random() * (canvas.width - 30);
    rocks.push({ x: rockX, y: -30, width: 30, height: 30 });
}

// Actualizar el juego en cada frame
function actualizarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Si el jugador está muriendo, ejecutar animación de muerte
    if (jugadorMuriendo) {
        contadorMuerte++;

        const progress = contadorMuerte / 50; // Progreso de la animación (0 a 1)
    
        // Calcular el ángulo de rotación y el factor de escalado
        const rotationAngle = contadorMuerte * (Math.PI / 10); // Ajusta para controlar la velocidad de rotación
        const scalingFactor = 1 + progress * 2; // Escala de 1 a 3
    
        // Calcular la posición actual moviéndose hacia el centro
        const targetX = canvas.width / 2 - sariWidth / 2;
        const targetY = canvas.height / 2 - sariHeight / 2;
    
        const currentX = sariXInicial + (targetX - sariXInicial) * progress;
        const currentY = sariYInicial + (targetY - sariYInicial) * progress;
    
        // Aplicar transformaciones
        ctx.save();
    
        // Mover al centro de Sari en la posición actual
        ctx.translate(currentX + sariWidth / 2, currentY + sariHeight / 2);
    
        // Aplicar rotación y escalado
        ctx.rotate(rotationAngle);
        ctx.scale(scalingFactor, scalingFactor);
    
        // Dibujar a Sari centrada en (0, 0)
        ctx.drawImage(sari, -sariWidth / 2, -sariHeight / 2, sariWidth, sariHeight);
    
        ctx.restore();
    
        // Deshabilitar movimiento
        movimientoIzquierda = false;
        movimientoDerecha = false;
    
        // Después de que la animación termine, mostrar el popup de derrota
        if (contadorMuerte >= 50) { // Duración de la animación (ajusta este valor según prefieras)
            mostrarPopupDerrota();
            return;
        }
    } else {
        // Movimiento del jugador
        if (movimientoIzquierda && sariX > 0) {
            sariX -= velocidadMovimiento;
        }
        if (movimientoDerecha && sariX < canvas.width - sariWidth) {
            sariX += velocidadMovimiento;
        }

        // Dibujar al jugador
        ctx.drawImage(sari, sariX, sariY, sariWidth, sariHeight);

        // Dibujar y mover rocas
        for (let i = 0; i < rocks.length; i++) {
            let rock = rocks[i];
            rock.y += rockSpeed;
            ctx.drawImage(rockImage, rock.x, rock.y, rock.width, rock.height);

            // Comprobar colisión con Sari
            if (colision(rock, { x: sariX, y: sariY, width: sariWidth, height: sariHeight })) {
                jugadorMuriendo = true; // Iniciar animación de muerte
                contadorMuerte = 0; // Reiniciar contador de animación
                sariXInicial = sariX; // Guardar posición inicial
                sariYInicial = sariY;
                clearInterval(rockInterval); // Detener generación de nuevas rocas
                break; // Salir del bucle de rocas
            }

            // Remover rocas que salen de la pantalla y actualizar contador de esquivadas
            if (rock.y > canvas.height) {
                rocks.splice(i, 1);
                esquivadas++;
                i--;

                // Aumentar dificultad progresivamente cada 10 rocas esquivadas
                if (esquivadas % 10 === 0) {
                    rockSpeed += 0.5; // Incrementa la velocidad de caída de las rocas
                    clearInterval(rockInterval); // Limpia el intervalo anterior
                    rockGenerationInterval -= 50; // Aumenta la frecuencia de generación de rocas
                    rockInterval = setInterval(generarRoca, Math.max(rockGenerationInterval, 200)); // Reinicia el intervalo con la nueva frecuencia (límite mínimo de 200 ms)
                }

                // Mostrar el popup de felicitación al esquivar 50 rocas
                if (esquivadas === 50) {
                    clearInterval(gameInterval);
                    clearInterval(rockInterval);
                    mostrarPopupEnhorabuena(); // Llama al popup de felicitación
                    return;
                }
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

function mostrarPopupDerrota() {
    clearInterval(gameInterval);
    clearInterval(rockInterval);
    document.getElementById("popup-derrota").style.display = "block";
}

// Cerrar el popup de derrota y reiniciar el juego
function cerrarPopupDerrota() {
    document.getElementById("popup-derrota").style.display = "none";
    jugadorMuriendo = false; // Restablecer estado de muerte
    contadorMuerte = 0; // Reiniciar contador de animación
    sariX = canvas.width / 2 - 25; // Reiniciar la posición de Sari al centro
    sariY = canvas.height - 60;
    sariXInicial = sariX; // Actualizar posición inicial
    sariYInicial = sariY;
    iniciarJuego(); // Reiniciar el juego
}

// Función para manejar el movimiento de Sari con las flechas
document.addEventListener("keydown", function (event) {
    if (jugadorMuriendo) return; // No permitir movimiento si está muriendo
    if (event.key === "ArrowLeft") {
        movimientoIzquierda = true;
    } else if (event.key === "ArrowRight") {
        movimientoDerecha = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (jugadorMuriendo) return; // No permitir movimiento si está muriendo

    if (event.key === "ArrowLeft") {
        movimientoIzquierda = false;
    } else if (event.key === "ArrowRight") {
        movimientoDerecha = false;
    }
});

// Iniciar el juego al cargar la pantalla de trampas
function entrarPantallaTrampas() {
    pantallas.forEach(pantalla => pantalla.classList.remove('visible')); // Asegúrate de que solo una pantalla esté visible
    document.getElementById("pantalla-trampas").classList.add("visible");
    iniciarCuentaRegresiva(); // Iniciar la cuenta regresiva
}
function iniciarCuentaRegresiva() {
    let contadorElemento = document.getElementById('contador');
    let tiempoRestante = 5; // Comenzar en 3
    contadorElemento.style.display = 'block'; // Asegurarse de que el contador esté visible

    function actualizarContador() {
        if (tiempoRestante > 0) {
            contadorElemento.innerText = tiempoRestante;
            contadorElemento.style.animation = 'none'; // Reinicia la animación
            void contadorElemento.offsetWidth; // Reflow para reiniciar la animación
            contadorElemento.style.animation = 'fadeInOut 1s ease-in-out';

            tiempoRestante--;
            setTimeout(actualizarContador, 1000); // Llamar de nuevo después de 1 segundo
        } else {
            contadorElemento.style.display = 'none'; // Ocultar el contador
            iniciarJuego(); // Iniciar el juego
        }
    }

    actualizarContador(); // Iniciar la cuenta regresiva
}

function mostrarPopupEnhorabuena() {
    document.getElementById("popup-enhorabuena").style.display = "block";
    const continuarBtn = document.getElementById("continuar-btn");
    continuarBtn.disabled = true; // Deshabilitamos el botón al abrir el popup
}

function cerrarPopupEnhorabuena() {
    document.getElementById("popup-enhorabuena").style.display = "none";
    const continuarBtn = document.getElementById("continuar-btn");

    // Aseguramos que no haya eventos duplicados
    continuarBtn.removeEventListener("click", avanzarPantalla); // Elimina cualquier evento previo
    continuarBtn.disabled = false; // Habilitamos el botón nuevamente

    // Añadimos el evento para avanzar pantalla y luego deshabilitamos el botón
    continuarBtn.addEventListener("click", function avanzar() {
        avanzarPantalla();
        continuarBtn.removeEventListener("click", avanzar); // Eliminamos el evento tras hacer clic
        continuarBtn.disabled = true; // Deshabilitamos el botón tras el clic
    });
}

// Frase oculta para adivinar
const fraseObjetivo = "Nunca es tarde para aprender";
let fraseActual = "_ _ _ _ _   _ _   _ _ _ _ _   _ _ _ _   _ _ _ _ _ _ _";
let intentosRestantes = 6;
let letrasIntentadas = [];

// Función para cambiar a la pantalla de ahorcado
function intentarDescifrar() {
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    document.getElementById("pantalla-ahorcado").classList.add("visible");
    actualizarFraseOculta();
    pantallaActual = Array.from(pantallas).findIndex(p => p.id === "pantalla-ahorcado");
}

// Función para procesar un intento de letra
function intentarLetra() {
    const letraInput = document.getElementById("letra-input").value.toUpperCase();
    if (letraInput && !letrasIntentadas.includes(letraInput)) {
        letrasIntentadas.push(letraInput);
        document.getElementById("letras-intentadas-lista").innerText = letrasIntentadas.join(", ");

        if (fraseObjetivo.toUpperCase().includes(letraInput)) {
            actualizarFraseOculta();
        } else {
            intentosRestantes--;
            document.getElementById("intentos-restantes").innerText = intentosRestantes;
        }

        if (intentosRestantes === 0) {
            mostrarPopupVolverIntentar(); // Mostrar popup para volver a intentar
        } else if (!fraseActual.includes("_")) {
            mostrarFraseFinalAvanzada(); // Llamar a la nueva función para animar la frase
        }
    }
    document.getElementById("letra-input").value = ""; // Limpiar el input
}

// Función para cerrar el popup de éxito y habilitar el botón
function cerrarPopupExitoAhorcado() {
    document.getElementById("popup-exito-ahorcado").style.display = "none";
    document.getElementById("boton-continuar-ahorcado").disabled = false;
    document.getElementById("boton-continuar-ahorcado").onclick = function() {
        avanzarPantalla();
    };

}


// Función para actualizar la frase oculta
function actualizarFraseOculta() {
    fraseActual = fraseObjetivo
        .split(" ")
        .map(palabra =>
            palabra
                .split("")
                .map(letra => (letrasIntentadas.includes(letra.toUpperCase()) ? letra : "_"))
                .join(" ")
        )
        .join("   "); // Añade tres espacios entre palabras

    // Actualiza el texto en la pantalla
    document.getElementById("frase-oculta").innerText = fraseActual;
}

function mostrarPopupVolverIntentar() {
    document.getElementById("popup-volver-intentar").style.display = "block";
}

// Reiniciar el juego de ahorcado
// Cerrar el popup y reiniciar el juego
function reiniciarAhorcado() {
    document.getElementById("popup-volver-intentar").style.display = "none";
    fraseActual = "_ _ _ _ _   _ _   _ _ _ _ _   _ _ _ _   _ _ _ _ _ _ _";
    intentosRestantes = 6;
    letrasIntentadas = [];
    document.getElementById("letras-intentadas-lista").innerText = "";
    document.getElementById("intentos-restantes").innerText = intentosRestantes;
    actualizarFraseOculta();
}
// Agregar tooltip en el campo de entrada de letra
document.getElementById("letra-input").addEventListener("focus", function () {
    this.setAttribute("title", "Introduce una letra para adivinar la frase");
});

function irAPantalla(n) {
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    if (n >= 0 && n < pantallas.length) {
        pantallaActual = n;
        pantallas[pantallaActual].classList.add('visible');
    } else {
        console.warn("Número de pantalla fuera de rango");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const continuarBtn = document.getElementById("continuar-btn");
    continuarBtn.disabled = true; // Asegura que comienza deshabilitado

    document.getElementById("continuar-btn").onclick = avanzarPantalla;
});


// --- Código para las Tres Puertas ---
// Función para interactuar con las puertas
function interactuarPuerta(puerta) {
    const puertaElemento = document.getElementById(`puerta-${puerta}`);

    // Asignar la puerta seleccionada
    puertaSeleccionada = puerta;

    // Toggle door state
    if (puertasEstado[puerta]) {
        // Si está abierta, cerrarla
        puertaElemento.style.backgroundImage = `url('assets/images/puerta_${puerta}.png')`;
        puertasEstado[puerta] = false;
    } else {
        // Si está cerrada, abrirla y mostrar el popup
        // Para la puerta de música, no abrirla directamente, sino mostrar un mensaje
        if (puerta === "musica") {
            mostrarContenidoSala(puerta); // Esto mostrará el mensaje específico
        } else {
            puertaElemento.style.backgroundImage = `url('assets/images/puerta_${puerta}_abierta.png')`;
            puertasEstado[puerta] = true;

            // Mostrar el popup solo al abrir la puerta
            mostrarContenidoSala(puerta);
        }
    }
}

// Función para cerrar el popup de las puertas o avanzar al minijuego
function accionPuerta() {
    const puerta = puertaSeleccionada; // Guardar la puerta seleccionada en una variable local
    document.getElementById("popup-puerta").style.display = "none";

    if (puerta === "musica") {
        // Iniciar el minijuego de saltos de plataformas
        entrarPantallaJuegoSaltos();
    } else if (puerta === "enfermeria" || puerta === "natacion") {
        // Restablecer el estado de la puerta
        puertasEstado[puerta] = false;

        // Actualizar la imagen de fondo de la puerta para reflejar que está cerrada
        const puertaElemento = document.getElementById(`puerta-${puerta}`);
        puertaElemento.style.backgroundImage = `url('assets/images/puerta_${puerta}.png')`;

        // Resetear la puerta seleccionada
        puertaSeleccionada = null;
    }
    // Si hay más puertas en el futuro, puedes añadir más condiciones aquí
}

// Función para cerrar el popup de las puertas
function cerrarPopupPuerta() {
    const puerta = puertaSeleccionada; // Guardar la puerta seleccionada en una variable local
    const popup = document.getElementById("popup-puerta");

    document.getElementById("popup-puerta").style.display = "none";    
    
    popup.classList.remove("popup-enfermeria", "popup-natacion", "popup-musica");

    if (puerta === "enfermeria" || puerta === "natacion") {
        // Restablecer el estado de la puerta
        puertasEstado[puerta] = false;

        // Actualizar la imagen de fondo de la puerta para reflejar que está cerrada
        const puertaElemento = document.getElementById(`puerta-${puerta}`);
        puertaElemento.style.backgroundImage = `url('assets/images/puerta_${puerta}.png')`;

        // Resetear la puerta seleccionada
        puertaSeleccionada = null;
    } else if (puerta === "musica") {
        // No cerrar la puerta de música, ya que no se abre
        puertaSeleccionada = null;
    }
}
// --- Código para el Minijuego del Camino Roto ---

// Funciones de drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

let piezasEncajadas = 0;
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const fragmento = document.getElementById(data);

    // Agregar el fragmento al camino destino
    ev.target.appendChild(fragmento);
    fragmento.draggable = false; // Evitar que se vuelva a arrastrar
    piezasEncajadas++;

    // Mostrar mensaje breve
    alert("Un paso más hacia adelante.");

    if (piezasEncajadas === 5) {
        // Habilitar botón para intentar abrir la puerta
        document.getElementById("boton-intentar-abrir-puerta").disabled = false;
    }
}

// Función para intentar abrir la puerta después de completar el camino
function intentarAbrirPuerta() {
    irAPantallaPorId("pantalla-puerta-bloqueada");
}

// --- Código para la Puerta Bloqueada y el Baúl ---

function mostrarBaul() {
    irAPantallaPorId("pantalla-baul");
}

function abrirRegalo() {
    document.getElementById("area-contraseña").style.display = "block";
}
// Popup de error de contraseña
function mostrarPopupErrorContraseña() {
    document.getElementById("popup-error-contraseña").style.display = "block";
}

function cerrarPopupErrorContraseña() {
    document.getElementById("popup-error-contraseña").style.display = "none";
}

// Variable para saber si la puerta de la música está desbloqueada
let puertaMusicaDesbloqueada = false;
let cofreMostrado = false;
let llaveObtenida = false;
const contraseñaCorrecta = "PIANO"; // Contraseña para abrir el cofre


// Función para avanzar a una pantalla específica por su id
function irAPantallaPorId(id) {
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    const pantalla = document.getElementById(id);
    if (pantalla) {
        pantalla.classList.add('visible');
    } else {
        console.warn(`Pantalla con id ${id} no encontrada`);
    }
}

function mostrarContenidoSala(puerta) {
    const popup = document.getElementById("popup-puerta");
    const popupContenido = popup.querySelector(".popup-contenido");
    const mensaje = document.getElementById("mensaje-puerta");
    const botonAccion = document.getElementById("boton-accion-puerta");

    // Restablecer estilos y clases previas
    popup.classList.remove("popup-enfermeria", "popup-natacion", "popup-musica");

    // Remover la clase 'centrar-boton' del botón de acción
    botonAccion.classList.remove("centrar-boton");

    if (puerta === "enfermeria") {
        mensaje.innerHTML = "Todo es blanco y huele a... ¿antiséptico? Me resulta todo demasiado familiar...";
        mensaje.style.textAlign = "left";
        botonAccion.innerText = "Salir y cerrar";
        popup.classList.add("popup-enfermeria");
    } else if (puerta === "natacion") {
        mensaje.innerHTML = "Escucho gritos, hay mucho eco y noto un picor en la nariz, creo que es del... ¿cloro?";
        mensaje.style.textAlign = "left";
        botonAccion.innerText = "Salir y cerrar";
        popup.classList.add("popup-natacion");

    } else if (puerta === "musica") {
        mensaje.innerHTML = "El camino está roto, pero puedo ver la puerta al otro lado.<br><br>Parece complicado... ¿Me arriesgo?";
        mensaje.style.textAlign = "left";
        botonAccion.innerText = "Intentar cruzar";
        popup.classList.add("popup-musica");
        botonAccion.classList.add("centrar-boton");
    }
    // Mostrar el popup
    popup.style.display = "block";
}

function mostrarFraseFinal() {
    const fraseFinalElement = document.getElementById("frase-final");
    const continuarBtn = document.getElementById("boton-continuar-ahorcado");
    const fraseOcultaElement = document.getElementById("frase-oculta");

    // Ocultar la frase oculta
    fraseOcultaElement.style.display = "none";

    // Establecer la frase final
    fraseFinalElement.innerText = fraseObjetivo;

    // Añadir la clase 'visible' para iniciar la animación
    setTimeout(() => {
        fraseFinalElement.classList.add("visible");
    }, 100); // Pequeño retraso para asegurar que se aplique la clase

    // Desbloquear el botón al finalizar la animación (2 segundos)
    setTimeout(() => {
        continuarBtn.disabled = false;
    }, 2100); // 2000ms de animación + 100ms de retraso
}

// Función para mostrar la frase final con animación avanzada
function mostrarFraseFinalAvanzada() {
    const fraseSimbolos = document.getElementById("frase-simbolos");
    const fraseFinalElement = document.getElementById("frase-final");
    const continuarBtn = document.getElementById("boton-continuar-ahorcado");
    const fraseOcultaElement = document.getElementById("frase-oculta");
    const letraInput = document.getElementById("letra-input");
    const botonIntentar = document.querySelector("#pantalla-ahorcado button[onclick='intentarLetra()']");

    // Actualizar la frase oculta para mostrar la frase completa con espacios y capitalización original
    const fraseObjetivo = "Nunca es tarde para aprender";
    fraseOcultaElement.innerText = fraseObjetivo;

    // Opcional: Si quieres mantener la animación en `frase-final`, procedemos a ocultar símbolos y animar
    fraseSimbolos.style.display = "none";

    // Limpiar cualquier contenido previo en frase-final
    fraseFinalElement.innerHTML = "";

    // Iterar sobre cada carácter y agregarlo con un retraso
    fraseObjetivo.split("").forEach((char, index) => {
        if (char === " ") {
            // Insertar un espacio directamente sin envolverlo en un span
            fraseFinalElement.innerHTML += " ";
        } else {
            const span = document.createElement("span");
            span.textContent = char;
            span.classList.add("char");
            span.style.animationDelay = `${index * 0.1}s`; // 0.1 segundos de retraso entre caracteres
            fraseFinalElement.appendChild(span);
        }
    });

    // Añadir la clase 'visible' para iniciar las animaciones
    fraseFinalElement.classList.add("visible");

    // Deshabilitar el input y el botón de intentar
    letraInput.disabled = true;
    botonIntentar.disabled = true;

    // Desbloquear el botón tras la duración total de la animación
    const totalAnimacion = fraseObjetivo.length * 100 + 500; // 0.1s por carácter + 0.5s extra
    setTimeout(() => {
        continuarBtn.disabled = false;
    }, totalAnimacion);
}
// --- Código para el Minijuego de Saltos de Plataformas ---


// Inicialización del canvas y contexto para saltos
let gameSaltosInterval;
let canvasSaltos = document.getElementById("saltosCanvas");
let ctxSaltos = canvasSaltos.getContext("2d");
let lastTime = 0;
let timerSaltos = null;
const tiempoObjetivo = 20000; // 30 segundos en milisegundos
let jugadorMuerto = false;
let gameSaltosActivo = false;
let jugadorCayendo = false;

let modoAuto = false;

// Cargar la imagen del jugador para saltos
let jugadorImgSaltos = new Image();
jugadorImgSaltos.src = "assets/images/sariplatform.PNG"; // Asegúrate de que la ruta sea correcta

let jugadorOriginalWidth = 0;
let jugadorOriginalHeight = 0;
const escalaSaltos = 0.05; // Ajusta este valor para escalar la imagen de Sari

// Variables para el jugador
let jugadorSaltos = {
    x: 100, // Posición fija en el eje X
    y: 300, // Posición inicial en el eje Y (se ajustará después de cargar la imagen)
    width: 50, // Tamaño base, ajustaremos con escala
    height: 50,
    velY: 0,
    saltando: false,
    gravedad: 0.8,
    fuerzaSalto: 10
};
// Cargar la imagen de fondo para saltos
// Cargar la imagen de fondo para saltos
let fondoImgSaltos = new Image();
fondoImgSaltos.src = "assets/images/backgroundplatform1.jpeg"; // Asegúrate de que la ruta sea correcta
fondoImgSaltos.onload = () => {
    console.log("Imagen de fondo cargada correctamente.");
    
    // Calcular el factor de escalado basado en la altura del canvas
    fondoScale = canvasSaltos.height / fondoImgSaltos.height;
    fondoImgSaltos.scaledWidth = fondoImgSaltos.width * fondoScale;
    fondoImgSaltos.scaledHeight = canvasSaltos.height;

    console.log(`Fondo Saltos - Scaled Width: ${fondoImgSaltos.scaledWidth}, Scaled Height: ${fondoImgSaltos.scaledHeight}`);
};
fondoImgSaltos.onerror = () => console.error("Error al cargar la imagen de fondo.");

// Variables para el fondo
let fondoX = 0;
let fondoSpeed = 2;

// Variables para el suelo con agujeros
let sueloSaltos = {
    y: 380, // Posición fija del suelo en el eje Y ajustada para que Sari esté completamente visible
    ancho: 600, // Ancho total del suelo
    segmentos: [], // Segmentos del suelo
    velocidad: 5
};
// Inicializar el suelo
function iniciarSueloSaltos() {
    sueloSaltos.segmentos = [];
    // Crear segmentos iniciales sin agujeros
    for (let i = 0; i < Math.ceil(canvasSaltos.width / 100) + 1; i++) {
        sueloSaltos.segmentos.push({ x: i * 100, width: 100, hole: false });
    }
}

// Generar un agujero aleatorio
function generarAgujeroSaltos() {
    if (modoAuto) return 0; // No generar agujeros en modo automático
    const probabilidadAgujero = 0.3; // 30% de probabilidad de generar un agujero
    if (Math.random() < probabilidadAgujero) {
        const anchoAgujero = Math.floor(Math.random() * 50) + 50; // Ancho entre 30 y 80 píxeles
        return anchoAgujero;
    }
    return 0;
}

// Actualizar el suelo
// Actualizar el suelo
function actualizarSueloSaltos(factor) {
    // Mover los segmentos hacia la izquierda
    sueloSaltos.segmentos.forEach(segmento => {
        segmento.x -= sueloSaltos.velocidad * factor;
    });

    // Eliminar segmentos que han salido del canvas
    if (sueloSaltos.segmentos.length > 0 && sueloSaltos.segmentos[0].x + sueloSaltos.segmentos[0].width < 0) {
        sueloSaltos.segmentos.shift();
    }

    // Añadir nuevos segmentos si es necesario
    while (sueloSaltos.segmentos.length < Math.ceil(canvasSaltos.width / 100) + 1) {
        let ultimoSegmento = sueloSaltos.segmentos[sueloSaltos.segmentos.length - 1];
        let anchoAgujero = generarAgujeroSaltos();
        if (anchoAgujero > 0) {
            // Añadir un segmento con agujero
            sueloSaltos.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width, width: anchoAgujero, hole: true });
            // Añadir el segmento después del agujero
            sueloSaltos.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width + anchoAgujero, width: 100, hole: false });
        } else {
            // Añadir un segmento sin agujero
            sueloSaltos.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width, width: 100, hole: false });
        }
    }
}

// Función para dibujar el fondo con múltiples copias para evitar huecos
function dibujarFondoSaltos() {
    if (fondoImgSaltos.complete) {
        let x = fondoX;
        // Dibuja tantas copias del fondo como sean necesarias para cubrir el canvas
        while (x < canvasSaltos.width) {
            ctxSaltos.drawImage(
                fondoImgSaltos,
                x,
                0,
                fondoImgSaltos.scaledWidth,
                fondoImgSaltos.scaledHeight
            );
            x += fondoImgSaltos.scaledWidth;
        }
    }
}

// Función para dibujar el suelo
function dibujarSueloSaltos() {
    ctxSaltos.fillStyle = "#654321"; // Color marrón para el suelo
    sueloSaltos.segmentos.forEach(segmento => {
        if (!segmento.hole) {
            ctxSaltos.fillRect(segmento.x, sueloSaltos.y, segmento.width, 10); // Altura del suelo: 10 píxeles
        }
    });
}

// Función para dibujar al jugador
function dibujarJugadorSaltos() {
    if (jugadorImgSaltos.complete) {
        ctxSaltos.drawImage(jugadorSaltos.img, jugadorSaltos.x, jugadorSaltos.y, jugadorSaltos.width, jugadorSaltos.height);
    }
}

// Función para manejar la física del jugador
function actualizarJugadorSaltos(factor) {
    // Aplicar gravedad
    jugadorSaltos.velY += jugadorSaltos.gravedad * factor;
    jugadorSaltos.y += jugadorSaltos.velY * factor;
    
    let apoyoTotal = 0;


    sueloSaltos.segmentos.forEach(segmento => {
        if (!segmento.hole) {
            const inicioJugador = jugadorSaltos.x;
            const finJugador = jugadorSaltos.x + jugadorSaltos.width;
            const inicioSegmento = segmento.x;
            const finSegmento = segmento.x + segmento.width;

            // Calcula el solapamiento horizontal entre el jugador y el segmento
            const solapamiento = Math.max(0, Math.min(finJugador, finSegmento) - Math.max(inicioJugador, inicioSegmento));
            const toleranciaVertical = 2; 

            // Si hay solapamiento y el jugador está prácticamente sobre el suelo (dentro de esos 10px de margen)
            if (solapamiento > 0 && 
                jugadorSaltos.y + jugadorSaltos.height >= sueloSaltos.y && 
                jugadorSaltos.y + jugadorSaltos.height <= sueloSaltos.y + 10 + toleranciaVertical) {
                apoyoTotal += solapamiento;
            }
        }
    });

    let sobreSuelo = (apoyoTotal > jugadorSaltos.width / 2);

    if (sobreSuelo) {
        jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
        jugadorSaltos.velY = 0;
        jugadorSaltos.saltando = false;
        jugadorCayendo = false; // Asegurar que no esté cayendo
    } else {
        // Si no hay suficiente apoyo, se considera que cae por un agujero (si está a la altura del suelo)
        if (!jugadorCayendo && jugadorSaltos.y + jugadorSaltos.height >= sueloSaltos.y) {
            console.log("Jugador ha caído en un agujero.");
            jugadorCayendo = true;
        }
    }

        // Movimiento automático si está activo
        if (modoAuto) {
            jugadorSaltos.x += 3 * factor;
        }
    
}



function actualizarJuegoSaltos(timestamp) {
    if (!gameSaltosActivo) {
        return; // Detener la ejecución si el juego no está activo
    }
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    const frameIdeal = 16.67; // Un frame ideal a 60 FPS ~16.67 ms
    const factor = deltaTime / frameIdeal;

    // Limpiar el canvas
    ctxSaltos.clearRect(0, 0, canvasSaltos.width, canvasSaltos.height);


    actualizarDesplazamientoFondo(factor);
    actualizarSueloSaltos(factor);
    actualizarJugadorSaltos(factor);
    dibujarFondoSaltos();
    dibujarSueloSaltos();
    dibujarJugadorSaltos();

    // Si modoAuto, verificar si Sari ha salido del canvas
    if (modoAuto) {
        if (jugadorSaltos.x > canvasSaltos.width) {
            mostrarPopupExitoSaltos(); // Mostrar el popup de victoria
            return; // Salir de la función para no solicitar otro frame
        }
    }

    // Si el jugador está cayendo, verificar si ha salido del canvas
    if (jugadorCayendo) {
        if (jugadorSaltos.y > canvasSaltos.height) {
            mostrarPopupDerrotaSaltos();
            return; // Salir de la función para no solicitar otro frame
        }
    }

    // Solicitar el siguiente frame
    requestAnimationFrame(actualizarJuegoSaltos);
}


// Función para cargar una imagen y devolver una promesa
function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error al cargar la imagen: ${src}`));
    });
}

// Función para iniciar el juego de saltos después de cargar las imágenes
async function iniciarJuegoSaltos() {
    
    jugadorMuerto = false; 
    jugadorCayendo = false; // Resetear la bandera de caída

    console.log("Variables reiniciadas: jugadorMuerto =", jugadorMuerto, ", jugadorCayendo =", jugadorCayendo);

    try {
        console.log("Cargando imágenes para el juego de saltos...");
        
        // Cargar imágenes
        [jugadorImgSaltos, fondoImgSaltos] = await Promise.all([
            cargarImagen("assets/images/sariplatform.PNG"),
            cargarImagen("assets/images/backgroundplatform1.jpeg")
        ]);
        
        console.log("Todas las imágenes cargadas correctamente.");
        
        // Calcular las dimensiones escaladas
        jugadorOriginalWidth = jugadorImgSaltos.width;
        jugadorOriginalHeight = jugadorImgSaltos.height;
        jugadorSaltos.width = Math.round(jugadorOriginalWidth * escalaSaltos);
        jugadorSaltos.height = Math.round(jugadorOriginalHeight * escalaSaltos);
        jugadorSaltos.img = jugadorImgSaltos; // Asignar la imagen cargada al objeto jugador

        fondoScale = canvasSaltos.height / fondoImgSaltos.height;
        fondoImgSaltos.scaledWidth = Math.round(fondoImgSaltos.width * fondoScale);
        fondoImgSaltos.scaledHeight = canvasSaltos.height;
        
        console.log(`Jugador Saltos - Width: ${jugadorSaltos.width}, Height: ${jugadorSaltos.height}`);
        console.log(`Fondo Saltos - Scaled Width: ${fondoImgSaltos.scaledWidth}, Scaled Height: ${fondoImgSaltos.scaledHeight}`);
        
        // Ajustar la posición Y para que Sari esté completamente sobre el suelo
        jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
        console.log(`Jugador Saltos - Posición Y: ${jugadorSaltos.y}`);
        
        // Inicializar el suelo
        iniciarSueloSaltos();
        
        // Resetear el jugador
        jugadorSaltos.x = 100;
        jugadorSaltos.velY = 0;
        jugadorSaltos.saltando = false;
        
        // Resetear variables de fondo
        fondoX = 0;
        fondoSpeed = 3;
        
        // Reiniciar el juego
        if (gameSaltosInterval) {
            cancelAnimationFrame(gameSaltosInterval);
        }
        if (rockInterval) {
            clearInterval(rockInterval);
        }
        
        modoAuto = false; // Asegurarse de que modoAuto esté desactivado al iniciar
        gameSaltosActivo = true;
        gameSaltosInterval = requestAnimationFrame(actualizarJuegoSaltos);
        iniciarTemporizadorSaltos(); // Iniciar el temporizador de 20 segundos
        
        console.log("Juego de saltos de plataformas iniciado.");
        
    } catch (error) {
        console.error(error);
        alert("Hubo un problema al cargar las imágenes del juego. Por favor, recarga la página.");
    }
}

// Función para manejar las teclas presionadas (solo salto)
function manejarTeclasSaltos(e) {
    if (modoAuto) return; // Ignorar inputs en modo automático

    // Manejar el salto
    if ((e.key === " " || e.key === "Spacebar") && jugadorSaltos.y === sueloSaltos.y - jugadorSaltos.height) { // Barra espaciadora para saltar
        jugadorSaltos.velY = -jugadorSaltos.fuerzaSalto;
        jugadorSaltos.saltando = true;
        console.log("Jugador saltó.");
    }
}
// Añadir eventos de teclado para saltosCanvas
document.addEventListener("keydown", manejarTeclasSaltos);


function entrarPantallaJuegoSaltos() {
    console.log("Entrando a pantalla de juego de saltos de plataformas.");
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    document.getElementById("pantalla-juego-saltos").classList.add("visible");
    iniciarJuegoSaltos();
}

// Evento para cargar las imágenes y ajustar dimensiones
jugadorImgSaltos.onload = () => {
    console.log("Imagen del jugador para saltos cargada correctamente.");
    jugadorOriginalWidth = jugadorImgSaltos.width;
    jugadorOriginalHeight = jugadorImgSaltos.height;

    // Calcula el tamaño ajustado del jugador manteniendo la proporción
    jugadorSaltos.width = Math.round(jugadorOriginalWidth * escalaSaltos);
    jugadorSaltos.height = Math.round(jugadorOriginalHeight * escalaSaltos);

    // Asignar la imagen cargada al objeto jugador
    jugadorSaltos.img = jugadorImgSaltos;

    // Verificar las dimensiones escaladas
    console.log(`Jugador Saltos - Width: ${jugadorSaltos.width}, Height: ${jugadorSaltos.height}`);

    // Ajustar la posición Y para que Sari esté completamente sobre el suelo
    jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
    console.log(`Jugador Saltos - Posición Y: ${jugadorSaltos.y}`);
};

// Asegúrate de que el fondo está cargado antes de iniciar el juego
fondoImgSaltos.onload = () => {
    console.log("Imagen de fondo cargada correctamente.");
    
    // Calcular el factor de escalado basado en la altura del canvas
    fondoScale = canvasSaltos.height / fondoImgSaltos.height;
    fondoImgSaltos.scaledWidth = Math.round(fondoImgSaltos.width * fondoScale);
    fondoImgSaltos.scaledHeight = canvasSaltos.height;
    
    console.log(`Fondo Saltos - Scaled Width: ${fondoImgSaltos.scaledWidth}, Scaled Height: ${fondoImgSaltos.scaledHeight}`);
};

// Función para actualizar el desplazamiento del fondo
function actualizarDesplazamientoFondo(factor) {
    fondoX -= fondoSpeed * factor;
    if (fondoX <= -fondoImgSaltos.scaledWidth) {
        fondoX += fondoImgSaltos.scaledWidth;
    }
}

// Función para iniciar el temporizador de 20 segundos
function iniciarTemporizadorSaltos() {
    // Asegúrate de que cualquier temporizador anterior se haya limpiado
    if (timerSaltos) {
        clearTimeout(timerSaltos);
    }
    
    timerSaltos = setTimeout(() => {
        activarModoAuto();
    }, tiempoObjetivo);
}

// Función para detener el temporizador (llamada al finalizar el juego)
function detenerTemporizadorSaltos() {
    if (timerSaltos) {
        clearTimeout(timerSaltos);
        timerSaltos = null;
        console.log("Temporizador de saltos detenido.");
    }
}

function activarModoAuto() {
    modoAuto = true;
    console.log("Modo automático activado.");

    // Remover todos los agujeros existentes en el suelo
    sueloSaltos.segmentos.forEach(segmento => {
        segmento.hole = false;
    });

}

// Función para mostrar el popup de derrota en saltos
function mostrarPopupDerrotaSaltos() {
    if (jugadorMuerto) {
        console.log("Popup de derrota ya mostrado anteriormente.");
        return; // Evita mostrar el popup múltiples veces
    }

    console.log("Mostrando popup-derrota-saltos");
    jugadorMuerto = true; // Marca al jugador como muerto
    gameSaltosActivo = false; // Detener el ciclo del juego
    detenerTemporizadorSaltos(); // Detener el temporizador al morir
    if (gameSaltosInterval) {
        cancelAnimationFrame(gameSaltosInterval);
    }

    const popup = document.getElementById("popup-derrota-saltos");
    if (popup) {
        popup.style.display = '';
        popup.classList.add('visible'); // Mostrar el popup
    } else {
        console.error("Elemento con id 'popup-derrota-saltos' no encontrado");
    }
}


// Función para cerrar el popup de derrota en saltos
function cerrarPopupDerrotaSaltos() {
    console.log("Cerrando popup-derrota-saltos");
    const popup = document.getElementById("popup-derrota-saltos");
    if (popup) {
        popup.classList.remove('visible'); // Ocultar el popup
        popup.style.display = '';
        popup.style.display = 'none';
    } else {
        console.error("Elemento con id 'popup-derrota-saltos' no encontrado");
    }
}

// Función para reiniciar el juego de saltos
function reiniciarJuegoSaltos() {
    const popup = document.getElementById("popup-derrota-saltos");
    if (popup) {
        popup.classList.remove('visible'); // Ocultar el popup
        popup.style.display = 'none';
    }
    jugadorMuerto = false; // Resetear la bandera de muerte
    jugadorCayendo = false; // Resetear la bandera de caída
    gameSaltosActivo = true; // Activar el juego nuevamente
    modoAuto = false; // Si estaba activado el modoAuto, desactívalo también
    
    jugadorSaltos.x = 100;
    jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
    jugadorSaltos.velY = 0;
    jugadorSaltos.saltando = false;

    // Reiniciar el tiempo y el suelo
    lastTime = 0; 
    sueloSaltos.segmentos = [];
    iniciarSueloSaltos(); // Crear segmentos iniciales sin agujeros
    iniciarJuegoSaltos(); // Reinicia el juego
}

// Función para volver a las puertas
function volverAPuertas() {
    console.log("Función volverAPuertas() llamada");
    cerrarPopupDerrotaSaltos(); // Cierra el popup de derrota en saltos
    detenerTemporizadorSaltos(); 
    jugadorMuerto = false;
    jugadorCayendo = false;
    modoAuto = false;
    gameSaltosActivo = false;
    lastTime = 0;
    sueloSaltos.segmentos = []; // Vaciar segmentos del suelo
    iniciarSueloSaltos(); // Suelo inicial sin agujeros
    jugadorSaltos.x = 100;
    jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
    jugadorSaltos.velY = 0;
    jugadorSaltos.saltando = false;

    irAPantallaPorId("pantalla-tres-puertas");
}

// Función para mostrar el popup de éxito al superar 30 segundos
function mostrarPopupExitoSaltos() {
    document.getElementById("popup-exito-saltos").style.display = "block";
}

// Función para cerrar el popup de éxito en saltos
function cerrarPopupExitoSaltos() {
    document.getElementById("popup-exito-saltos").style.display = "none";
    // Navegar a la pantalla de la puerta de música cerrada
    irAPantallaPorId("pantalla-puerta-musica-cerrada");
}


function interactuarPuertaMusica() {
    const puertaMusica = document.getElementById('puerta-musica-cerrada');
    const mensajeNarrativo = document.getElementById('mensaje-narrativo-cofre');

    if (!llaveObtenida) {
        mostrarPopupClaveMusica();
    } else {
        if (!puertaMusicaDesbloqueada) {
            // Cambiar la imagen de la puerta a abierta
            puertaMusica.style.backgroundImage = "url('assets/images/puerta_musica_abierta.png')";
            puertaMusicaDesbloqueada = true;

            // Mostrar mensaje narrativo
            mostrarMensajeNarrativo("Has desbloqueado la puerta...");
        } else {
            // Pasar a la siguiente pantalla
            irAPantallaPorId("pantalla-final-puerta-abierta");
        }
    }
}


function desbloquearPuertaMusica() {
    // Cambiar la imagen de la puerta a la versión abierta
    document.getElementById("puerta-musica-cerrada").style.backgroundImage = "url('assets/images/puerta_musica_abierta.png')";

    // Mostrar el popup en lugar del alert
    document.getElementById("popup-puerta-musica-desbloqueada").style.display = "block";
}

function cruzarPuertaMusica() {
    document.getElementById("popup-puerta-musica-desbloqueada").style.display = "none";
    irAPantallaPorId("pantalla-final-puerta-abierta"); 
}

// Función para mostrar el popup que indica que se necesita una clave
function mostrarPopupClaveMusica() {
    const popup = document.getElementById('popup-clave-musica');
    popup.style.display = 'block';
}

// Función para cerrar el popup de clave de música
function cerrarPopupClaveMusica() {
    const popup = document.getElementById('popup-clave-musica');
    popup.style.display = 'none';
    
    if (!cofreMostrado) {
        const cofre = document.getElementById('cofre-musica');
        cofre.style.display = 'block'; // Asegurarse de que el cofre sea visible
        cofre.setAttribute('data-visible', 'true'); // Actualizar atributo para la animación
        cofreMostrado = true; // Actualizar el estado para que no vuelva a aparecer

        mostrarMensajeNarrativo("No había visto ese cofre de lejos, ¿qué habrá dentro?");

    }
}

function interactuarCofreMusica() {
    const popupCofre = document.getElementById('popup-cofre-musica');
    popupCofre.style.display = 'block';
}

function cerrarPopupCofreMusica() {
    const popupCofre = document.getElementById('popup-cofre-musica');
    popupCofre.style.display = 'none';
}
// Función para intentar abrir el cofre
function intentarAbrirCofre() {
    const inputContraseña = document.getElementById('input-contraseña-cofre').value.trim().toUpperCase(); // Normalizamos el texto
    const mensajeError = document.getElementById('mensaje-error-cofre');
    const cofreImagen = document.getElementById('cofre-musica'); // Referencia a la imagen del cofre


    if (inputContraseña === contraseñaCorrecta) {
        mensajeError.style.display = 'none';
        cofreImagen.src = "assets/images/cofre_abierto.png"; 
        mostrarAnimacionLlave();
        setTimeout(() => {
            cerrarPopupCofreMusica();
        }, 1500);
        cerrarPopupCofreMusica();
        llaveObtenida = true;
    } else {
        mensajeError.style.display = 'block';
    }
}

function mostrarAnimacionLlave() {
    const llave = document.getElementById('llave-animada');

    // Asegurarnos de que comience con el estado "oculto"
    llave.classList.remove('llave-desaparece');
    llave.classList.add('llave-visible');

    // Después de 1.5 segundos (duración de la animación de aparición), la llave desaparece
    setTimeout(() => {
        llave.classList.remove('llave-visible'); // Remueve la clase visible
        llave.classList.add('llave-desaparece'); // Añade la clase para desvanecerse
    }, 1500); // 1.5 segundos: duración de la animación
}


function mostrarMensajeNarrativo(texto) {
    const mensajeNarrativo = document.getElementById('mensaje-narrativo-puerta');
    mensajeNarrativo.textContent = texto;
    mensajeNarrativo.style.display = 'block';

    // Ocultar automáticamente después de unos segundos
    setTimeout(() => {
        mensajeNarrativo.style.display = 'none';
    }, 6000);
}

function resetearJuegoSaltos() {
    console.log("Reestableciendo valores del juego de saltos");
    jugadorSaltos.x = 100;
    jugadorSaltos.y = sueloSaltos.y - jugadorSaltos.height;
    jugadorSaltos.velY = 0;
    jugadorSaltos.saltando = false;
    fondoX = 0;
    fondoSpeed = 2;
}
