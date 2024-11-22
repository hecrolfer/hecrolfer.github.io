let pantallaActual = 0;
const pantallas = document.querySelectorAll('.pantalla');
let tablero = ["", "", "", "", "", "", "", "", ""];
let jugadorActual = "O";
let intentosFallidos = 0; // Contador para los intentos fallidos del jugador
let puertaSeleccionada = null; 
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

// Función para mostrar la última frase después de abrir el regalo
function mostrarUltimaFrase() {
    document.getElementById('pantalla-final').classList.remove('visible');
    document.getElementById('pantalla-final-revelacion').classList.add('visible');
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
    ctx.drawImage(sari, sariX, sariY, sariWidth, sariHeight);

    // Movimiento fluido del personaje
    if (movimientoIzquierda && sariX > 0) {
        sariX -= velocidadMovimiento;
    }
    if (movimientoDerecha && sariX < canvas.width - sariWidth) {
        sariX += velocidadMovimiento;
    }

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
    iniciarJuego(); // Llama a iniciarJuego para reiniciar con valores iniciales
}

// Función para manejar el movimiento de Sari con las flechas
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        movimientoIzquierda = true;
    } else if (event.key === "ArrowRight") {
        movimientoDerecha = true;
    }
});

document.addEventListener("keyup", function (event) {
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
    iniciarJuego();
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
    document.getElementById("popup-puerta").style.display = "none";

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

function comprobarContraseña() {
    const contraseña = document.getElementById("input-contraseña").value.toLowerCase();
    if (contraseña === "piano") {
        alert("El baúl se ha abierto y has obtenido la llave.");
        // Marcar que la puerta de la música está desbloqueada
        puertaMusicaDesbloqueada = true;
        irAPantallaPorId("pantalla-final-puerta-abierta");
    } else {
        mostrarPopupErrorContraseña();
    }
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

// Función para avanzar a una pantalla específica por su id
function irAPantallaPorId(id) {
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
}

function mostrarContenidoSala(puerta) {
    const popup = document.getElementById("popup-puerta");
    const popupContenido = popup.querySelector(".popup-contenido");
    const mensaje = document.getElementById("mensaje-puerta");
    const botonAccion = document.getElementById("boton-accion-puerta");

    // Restablecer estilos y clases previas
    popup.classList.remove("popup-enfermeria"); // Remover la clase del popup principal
    popup.classList.remove("popup-natacion"); // Remover la clase del popup de natación si está presente


    if (puerta === "enfermeria") {
        mensaje.innerHTML = "Todo es blanco y huele a... ¿antiséptico? Me resulta todo demasiado familiar...";
        botonAccion.innerText = "Salir y cerrar";
        popup.classList.add("popup-enfermeria");
    } else if (puerta === "natacion") {
        mensaje.innerHTML = "Escucho gritos, hay mucho eco y noto un picor en la nariz, creo que es del... ¿cloro?";
        botonAccion.innerText = "Salir y cerrar";
        popup.classList.add("popup-natacion");

    } else if (puerta === "musica") {
        mensaje.innerHTML = "¡¡¡¡¡Ayyyy!!!!!!! El camino está partido... no puedo llegar a la puerta";
        botonAccion.innerText = "Intentar llegar hasta la puerta";
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

console.log("Minijuego de Saltos de Plataformas cargado.");

// Variables para el juego de saltos
let canvasSaltos = document.getElementById("saltosCanvas");
if (canvasSaltos) {
    console.log("Canvas Saltos encontrado:", canvasSaltos);
} else {
    console.error("Canvas Saltos no encontrado. Verifica el id del canvas.");
}

let ctxSaltos = canvasSaltos ? canvasSaltos.getContext("2d") : null;
if (ctxSaltos) {
    console.log("Contexto Saltos obtenido:", ctxSaltos);
} else {
    console.error("No se pudo obtener el contexto del canvas.");
}
// Declaración de la variable gameSaltosInterval
let gameSaltosInterval;

// Cargar la imagen del jugador
let jugadorImg = new Image();
jugadorImg.src = "assets/images/sariplatform.PNG"; // Asegúrate de que el nombre y la ruta sean correctos
jugadorImg.onload = () => console.log("Imagen del jugador cargada correctamente.");
jugadorImg.onerror = () => console.error("Error al cargar la imagen del jugador.");

// Cargar la imagen de fondo
let fondoImg = new Image();
fondoImg.src = "assets/images/background.jpg"; // Asegúrate de que el nombre y la ruta sean correctos
fondoImg.onload = () => console.log("Imagen de fondo cargada correctamente.");
fondoImg.onerror = () => console.error("Error al cargar la imagen de fondo.");

// Variables para el jugador
let jugador = {
    x: 100, // Posición fija en el eje X
    y: 300, // Posición inicial en el eje Y
    width: 50, // Ajusta según el tamaño de tu imagen
    height: 50, // Ajusta según el tamaño de tu imagen
    velY: 0,
    saltando: false,
    gravedad: 1.0,
    fuerzaSalto: 15
};

// Variables para el fondo
let fondoX = 0;
let fondoSpeed = 2;

// Variables para el suelo con agujeros
let suelo = {
    y: 350, // Posición fija del suelo en el eje Y
    ancho: 600, // Ancho total del suelo
    segmentos: [], // Segmentos del suelo
    velocidad: 2
};

// Inicializar el suelo
function iniciarSuelo() {
    suelo.segmentos = [];
    // Crear segmentos iniciales sin agujeros
    for (let i = 0; i < Math.ceil(canvasSaltos.width / 100) + 1; i++) {
        suelo.segmentos.push({ x: i * 100, width: 100, hole: false });
    }
}

// Generar un agujero aleatorio
function generarAgujero() {
    const probabilidadAgujero = 0.3; // 30% de probabilidad de generar un agujero
    if (Math.random() < probabilidadAgujero) {
        const anchoAgujero = Math.floor(Math.random() * 50) + 30; // Ancho entre 30 y 80 píxeles
        return anchoAgujero;
    }
    return 0;
}

// Actualizar el suelo
function actualizarSuelo() {
    // Mover los segmentos hacia la izquierda
    suelo.segmentos.forEach(segmento => {
        segmento.x -= suelo.velocidad;
    });

    // Eliminar segmentos que han salido del canvas
    if (suelo.segmentos.length > 0 && suelo.segmentos[0].x + suelo.segmentos[0].width < 0) {
        suelo.segmentos.shift();
    }

    // Añadir nuevos segmentos si es necesario
    while (suelo.segmentos.length < Math.ceil(canvasSaltos.width / 100) + 1) {
        let ultimoSegmento = suelo.segmentos[suelo.segmentos.length - 1];
        let anchoAgujero = generarAgujero();
        if (anchoAgujero > 0) {
            // Añadir un segmento con agujero
            suelo.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width, width: anchoAgujero, hole: true });
            // Añadir el segmento después del agujero
            suelo.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width + anchoAgujero, width: 100, hole: false });
        } else {
            // Añadir un segmento sin agujero
            suelo.segmentos.push({ x: ultimoSegmento.x + ultimoSegmento.width, width: 100, hole: false });
        }
    }
}

// Función para dibujar el fondo
function dibujarFondo() {
    if (fondoImg.complete) {
        ctxSaltos.drawImage(fondoImg, fondoX, 0, canvasSaltos.width, canvasSaltos.height);
        ctxSaltos.drawImage(fondoImg, fondoX + canvasSaltos.width, 0, canvasSaltos.width, canvasSaltos.height);
    }
}

// Función para dibujar el suelo
function dibujarSuelo() {
    ctxSaltos.fillStyle = "#654321"; // Color marrón para el suelo
    suelo.segmentos.forEach(segmento => {
        if (!segmento.hole) {
            ctxSaltos.fillRect(segmento.x, suelo.y, segmento.width, 10); // Altura del suelo: 10 píxeles
        }
    });
}

// Función para dibujar al jugador
function dibujarJugador() {
    if (jugadorImg.complete) {
        ctxSaltos.drawImage(jugadorImg, jugador.x, jugador.y, jugador.width, jugador.height);
    }
}

// Función para manejar la física del jugador
function actualizarJugadorSaltos() {
    // Aplicar gravedad
    jugador.velY += jugador.gravedad;
    jugador.y += jugador.velY;

    // Detectar colisión con el suelo
    let sobreSuelo = false;
    suelo.segmentos.forEach(segmento => {
        if (!segmento.hole) {
            if (
                jugador.x < segmento.x + segmento.width &&
                jugador.x + jugador.width > segmento.x &&
                jugador.y + jugador.height >= suelo.y &&
                jugador.y + jugador.height <= suelo.y + 10
            ) {
                sobreSuelo = true;
                jugador.y = suelo.y - jugador.height;
                jugador.velY = 0;
                jugador.saltando = false;
            }
        }
    });

    // Detectar si el jugador cae por un agujero
    if (!sobreSuelo && jugador.y + jugador.height >= suelo.y) {
        // Caída: finalizar el juego
        mostrarPopupDerrota();
    }
}

// Función para actualizar el juego en cada frame
function actualizarJuegoSaltos() {
    console.log("Actualizando juego de saltos de plataformas.");
    ctxSaltos.clearRect(0, 0, canvasSaltos.width, canvasSaltos.height);

    // Dibujar y actualizar el fondo
    dibujarFondo();
    fondoX -= fondoSpeed;
    if (fondoX <= -canvasSaltos.width) {
        fondoX = 0;
    }

    // Dibujar y actualizar el suelo
    dibujarSuelo();
    actualizarSuelo();

    // Dibujar al jugador
    dibujarJugador();

    // Actualizar la física del jugador
    actualizarJugadorSaltos();
}

// Función para iniciar el juego de saltos
function iniciarJuegoSaltos() {
    console.log("Iniciando juego de saltos de plataformas.");

    // Resetear el jugador
    jugador.x = 100;
    jugador.y = 300;
    jugador.velY = 0;
    jugador.saltando = false;

    // Inicializar el suelo
    iniciarSuelo();

    // Iniciar el loop del juego
    if (gameSaltosInterval) clearInterval(gameSaltosInterval);
    gameSaltosInterval = setInterval(actualizarJuegoSaltos, 20);
    console.log("Loop del juego iniciado.");
}

// Función para manejar las teclas presionadas
function manejarTeclasSaltos(e) {
    // Manejar el salto
    if ((e.key === " " || e.key === "Spacebar") && jugador.y === suelo.y - jugador.height) { // Barra espaciadora para saltar
        jugador.velY = -jugador.fuerzaSalto;
        jugador.saltando = true;
        console.log("Jugador saltó.");
    }
}

// Añadir eventos de teclado
document.addEventListener("keydown", manejarTeclasSaltos);

// Función para finalizar el juego de saltos y avanzar
function finalizarJuegoSaltos() {
    // Opcional: Mostrar un popup de felicitación antes de avanzar
    alert("¡Has llegado a la puerta! La puerta se abre ante ti, permitiéndote continuar tu aventura.");
    clearInterval(gameSaltosInterval); // Detener el juego
    avanzarPantalla(); // Avanza a la siguiente pantalla en tu flujo
}

// Función para ingresar a la pantalla del juego de saltos
function entrarPantallaJuegoSaltos() {
    console.log("Entrando a pantalla de juego de saltos de plataformas.");
    pantallas.forEach(pantalla => pantalla.classList.remove('visible'));
    document.getElementById("pantalla-juego-saltos").classList.add("visible");
    iniciarJuegoSaltos();
}
