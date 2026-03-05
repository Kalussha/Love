document.addEventListener('DOMContentLoaded', () => {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    // Elementos de música
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    // Lógica para la música de fondo
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '🔇 Música Pausada';
        } else {
            bgMusic.play().catch(e => console.log('Autoplay bloqueado, el usuario debe interactuar primero'));
            musicBtn.innerHTML = '🔊 Música Sonando';
        }
        isPlaying = !isPlaying;
    });

    // Frases divertidas para el botón No
    const frasesNo = [
        "¿Segura?",
        "¿No cambias de opinión?",
        "Piénsalo bien...",
        "Me vas a romper el corazón",
        "Ándale di que sí 🥺",
        "Esa no es la respuesta correcta",
        "Te equivocas de botón",
        "¡Intenta el del otro lado!"
    ];
    let fraseIndex = 0;

    // Función para mover el botón "No"
    const moveButton = () => {
        // 1. Cambiar el texto del botón PRIMERO para saber su tamaño real una vez que el texto sea más largo
        btnNo.textContent = frasesNo[fraseIndex];
        // Pasar a la siguiente frase y hacer loop
        fraseIndex = (fraseIndex + 1) % frasesNo.length;

        // Forzar a que la clase moving aplique el 'position: fixed' antes de medir para evitar distorsiones del DOM original
        if (!btnNo.classList.contains('moving')) {
            btnNo.classList.add('moving');
        }

        // 2. Obtenemos las dimensiones de la ventana para mantener el botón dentro
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 3. Obtenemos las dimensiones del botón recién actualizado usando getBoundingClientRect para ser 100% exactos
        const rect = btnNo.getBoundingClientRect();
        const btnWidth = rect.width;
        const btnHeight = rect.height;

        // Un margen ENORME para garantizar que el centro del botón y todos sus bordes quepan en la pantalla visible
        // (por ejemplo, el padding y la sombra)
        const margin = 50;

        // 4. Calculamos límites máximos
        const maxX = windowWidth - btnWidth - margin;
        const maxY = windowHeight - btnHeight - margin;

        // Calculamos posiciones aleatorias entre el margen (mínimo) y el maxX (máximo)
        const randomX = Math.max(margin, Math.random() * Math.max(0, maxX));
        const randomY = Math.max(margin, Math.random() * Math.max(0, maxY));

        // 5. Aplicar la nueva posición asegurándonos de que tiene la transición
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        btnNo.style.transition = 'left 0.3s ease, top 0.3s ease'; // Transición suave pero rápida
    };

    // Hacer casi imposible presionar el botón
    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evitar el tap
        moveButton();
    });
    // Por si acaso logra hacer click mágicamente
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
    });

    // Acción para el botón "Sí"
    btnYes.addEventListener('click', () => {
        // 1. Lanzar celebración de Confetti
        var duration = 4 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // Confetti rojo y rosa
            confetti({
                ...defaults, particleCount,
                colors: ['#ff758c', '#ff7eb3', '#ffffff', '#ff4d6d'],
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                colors: ['#ff758c', '#ff7eb3', '#ffffff', '#ff4d6d'],
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // 2. Actualizar el contenido de la tarjeta
        const title = document.querySelector('.title');
        const message = document.querySelector('.message');
        const buttonsContainer = document.querySelector('.buttons');

        title.innerHTML = "¡Sabía que dirías que sí! ❤️";
        message.innerHTML = "No tienes idea de lo feliz que me haces.";
        buttonsContainer.style.display = 'none';

        setTimeout(() => {
            const miNumero = "524495803742";
            const textoMensaje = encodeURIComponent("¡Hola amor! Sí acepto ir a la cita el sábado contigo <3");
            const whatsappUrl = `https://wa.me/${miNumero}?text=${textoMensaje}`;
            window.location.href = whatsappUrl;
        }, 3500); // Esperar 3.5 segundos para ver el confetti
    });

    // Intento de autoplay directo al inicio:
    const startAudio = () => {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.innerHTML = '🔊 Música Sonando';
            }).catch(e => {
                console.log("El navegador bloqueó el autoplay. Se requiere interacción del usuario.");
            });
        }
    };

    // Lo intentamos apenas carga
    startAudio();

    // Pequeño truco para arrancar la música con la primera interacción de la usuaria en la pantalla, 
    // por si el intento automático falló (política de los navegadores)
    document.body.addEventListener('click', startAudio, { once: true });
    document.body.addEventListener('touchstart', startAudio, { once: true });
});
