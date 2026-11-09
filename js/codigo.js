// Lista de palabras
const palabras = ["PROGRAMACION","JAVASCRIPT","TECLADO","COMPUTADORA","CODIGO","INTERNET","PANTALLA","VIDEOJUEGO","DESARROLLO","SOFTWARE"];

// Objeto del jugador
const jugador = {
    nombre: "Jugador",
    puntuacion: 0
};

// Objeto del ahorcado
const ahorcado = {

    dibujar: function(ctx, errores) {

        ctx.clearRect(0, 0, 350, 300);

        // Dibujar la horca
        ctx.strokeStyle = "#142b4c";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(35, 270);
        ctx.lineTo(150, 270);
        ctx.moveTo(85, 270);
        ctx.lineTo(85, 30);
        ctx.lineTo(230, 30);
        ctx.lineTo(230, 60);
        ctx.stroke();

        // Dibujar la cabeza
        ctx.strokeStyle = "#1b9aaa";
        ctx.lineWidth = 5;

        if (errores >= 1) {
            ctx.beginPath();
            ctx.arc(230, 82, 22, 0, Math.PI * 2);
            ctx.stroke();
        }
        // Dibujar el cuerpo
        if (errores >= 2) {
            ctx.beginPath();
            ctx.moveTo(230, 104);
            ctx.lineTo(230, 180);
            ctx.stroke();
       }
        // Brazo izquierdo
        if (errores >= 3) {
            ctx.beginPath();
            ctx.moveTo(230, 125);
            ctx.lineTo(195, 155);
            ctx.stroke();
        }
        // Brazo derecho
        if (errores >= 4) {
            ctx.beginPath();
            ctx.moveTo(230, 125);
            ctx.lineTo(265, 155);
            ctx.stroke();
        }
        // Pierna izquierda
        if (errores >= 5) {

            ctx.beginPath();
            ctx.moveTo(230, 180);
            ctx.lineTo(195, 220);
            ctx.stroke();

        }
        // Pierna derecha
        if (errores >= 6) {

            ctx.beginPath();
            ctx.moveTo(230, 180);
            ctx.lineTo(265, 220);
            ctx.stroke();

        }

    }

};
// Objeto principal del juego
const juego = {

    errores: 0,
    maxErrores: 6,
    letrasAdivinadas: [],
    letrasUsadas: [],
    palabraSecreta: "",
    terminado: false,
    pausado: false,

    // Iniciar el juego
    iniciar: function() {

        this.errores = 0;
        this.letrasAdivinadas = [];
        this.letrasUsadas = [];
        this.terminado = false;
        this.pausado = false;

        // Elegir palabra al azar
        const posicion = Math.floor(Math.random() * palabras.length);

        this.palabraSecreta = palabras[posicion];

        document.getElementById("mensaje").textContent = "";

        document.getElementById("contador-errores").textContent = "0 / 6";

        document.getElementById("puntuacion").textContent =
            jugador.puntuacion;

        document.getElementById("boton-pausar").textContent = "Pausar";

        this.dibujarPalabra();
        this.crearTeclado();
        this.dibujarAhorcado();

    },

    // Mostrar la palabra secreta
    dibujarPalabra: function() {

        let contenido = "";

        for (let letra of this.palabraSecreta) {

            if (this.letrasAdivinadas.includes(letra)) {

                contenido += letra + " ";

            } else {

                contenido += "_ ";

            }

        }

        document.getElementById("palabra-pantalla").textContent =
            contenido.trim();

    },

    // Crear botones de las letras
    crearTeclado: function() {

        const teclado = document.getElementById("teclado");

        teclado.innerHTML = "";

        const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

        for (let letra of letras) {

            const boton = document.createElement("button");

            boton.textContent = letra;

            boton.addEventListener("click", () => {

                this.procesarIntento(letra, boton);

            });

            teclado.appendChild(boton);

        }

    },

    // Comprobar la letra seleccionada
    procesarIntento: function(letra, boton) {

        if (this.terminado || this.pausado) {
            return;
        }

        if (this.letrasUsadas.includes(letra)) {
            return;
        }

        boton.disabled = true;

        this.letrasUsadas.push(letra);

        if (this.palabraSecreta.includes(letra)) {

            this.letrasAdivinadas.push(letra);

            this.dibujarPalabra();

            this.verificarGanador();

        } else {

            this.errores++;

            document.getElementById("contador-errores").textContent =
                this.errores + " / 6";

            this.dibujarAhorcado();

            this.verificarPerdedor();

        }

    },

    // Dibujar el ahorcado en Canvas
    dibujarAhorcado: function() {

        const canvas = document.getElementById("canvasAhorcado");

        const ctx = canvas.getContext("2d");

        ahorcado.dibujar(ctx, this.errores);

    },

    // Verificar si ganó
    verificarGanador: function() {

        const gano = this.palabraSecreta.split("").every(letra =>
            this.letrasAdivinadas.includes(letra)
        );

        if (gano) {

            this.terminado = true;

            jugador.puntuacion += 10;

            document.getElementById("puntuacion").textContent =
                jugador.puntuacion;

            document.getElementById("mensaje").textContent =
                "¡Felicidades! ¡Descubriste la palabra! 🎉";

            document.getElementById("mensaje").style.color = "#168a58";

            this.desactivarTeclado();

        }

    },

    // Verificar si perdió
    verificarPerdedor: function() {

        if (this.errores >= this.maxErrores) {

            this.terminado = true;

            document.getElementById("mensaje").textContent =
                "¡Perdiste! La palabra era: " + this.palabraSecreta;

            document.getElementById("mensaje").style.color = "#dc3545";

            this.desactivarTeclado();

        }

    },

    // Desactivar todas las letras
    desactivarTeclado: function() {

        const botones = document.querySelectorAll("#teclado button");

        botones.forEach(boton => {

            boton.disabled = true;

        });

    },

    // Pausar el juego
    pausar: function() {

        if (this.terminado) {
            return;
        }

        this.pausado = !this.pausado;

        const boton = document.getElementById("boton-pausar");

        const mensaje = document.getElementById("mensaje");

        if (this.pausado) {

            boton.textContent = "Continuar";

            mensaje.textContent = "Juego pausado ⏸️";

            mensaje.style.color = "#d18b22";

            this.desactivarTeclado();

        } else {

            boton.textContent = "Pausar";

            mensaje.textContent = "";

            this.actualizarTeclado();

        }

    },

    // Activar las letras que todavía no se utilizaron
    actualizarTeclado: function() {

        const botones = document.querySelectorAll("#teclado button");

        botones.forEach(boton => {

            boton.disabled = this.letrasUsadas.includes(
                boton.textContent
            );

        });

    }

};

// Evento del botón reiniciar
document.getElementById("boton-reiniciar").addEventListener("click", function() {

    juego.iniciar();

});

// Evento del botón pausar
document.getElementById("boton-pausar").addEventListener("click", function() {

    juego.pausar();

});

// Jugar utilizando el teclado de la computadora
document.addEventListener("keydown", function(evento) {

    const letra = evento.key.toUpperCase();

    if (/^[A-ZÑ]$/.test(letra)) {

        const botones = document.querySelectorAll("#teclado button");

        botones.forEach(boton => {

            if (boton.textContent === letra && !boton.disabled) {

                boton.click();

            }

        });

    }

});

// Iniciar el juego al abrir la página
juego.iniciar();
