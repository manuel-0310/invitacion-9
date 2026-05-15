/* ============================================================
   COUNTDOWN
   ============================================================ */
const weddingDate = new Date("Aug 8, 2026 14:00:00").getTime();

const timer = setInterval(function () {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(timer);
        document.getElementById("timer").innerHTML = "¡LLEGÓ EL DÍA!";
    }
}, 1000);

/* ============================================================
   MUSIC — reproduce de 0:22 a 4:08 en loop
   ============================================================ */
const MUSIC_START = 23;   // segundos (0:23)
const MUSIC_END   = 248;  // segundos (4:08)
let   musicStarted = false;

window.addEventListener("DOMContentLoaded", () => {
    const audio     = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto     = document.getElementById("texto");

    if (!audio || !btnMusica || !texto) return;

    // Loop entre MUSIC_START y MUSIC_END
    audio.addEventListener("timeupdate", () => {
        if (audio.currentTime >= MUSIC_END) {
            audio.currentTime = MUSIC_START;
        }
    });

    const debeReproducir = localStorage.getItem("reproducirMusica");
    if (debeReproducir === "true") {
        audio.currentTime = MUSIC_START;
        musicStarted = true;
        audio.play();
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
        localStorage.removeItem("reproducirMusica");
    }

    btnMusica.addEventListener("click", () => {
        if (audio.paused) {
            if (!musicStarted) {
                audio.currentTime = MUSIC_START;
                musicStarted = true;
            }
            audio.play();
            btnMusica.classList.add("sonando");
            texto.innerText = "Pausar";
        } else {
            audio.pause();
            btnMusica.classList.remove("sonando");
            texto.innerText = "Reproducir canción";
        }
    });
});

function iniciarSonidoMusicaDesdeIntro() {
    const audio     = document.getElementById("miMusica");
    const btnMusica = document.getElementById("btnMusica");
    const texto     = document.getElementById("texto");
    if (!audio || !btnMusica || !texto) return;

    audio.currentTime = MUSIC_START;
    musicStarted = true;
    audio.play().then(() => {
        btnMusica.classList.add("sonando");
        texto.innerText = "Pausar";
    }).catch(() => {
        texto.innerText = "Reproducir canción";
    });
}

window.iniciarMusicaDesdeIntro = iniciarSonidoMusicaDesdeIntro;

/* ============================================================
   INTRO — animación sello → sobre → tarjeta → continuar
   ============================================================ */
const sello = document.getElementById('sello');
const botonContinuar = document.getElementById('btn-continuar');
const sobreCerrado = document.getElementById('sobre-cerrado');
const sobreAbierto = document.getElementById('sobre-abierto');
const tarjetaIntro = document.getElementById('tarjeta-intro');
const overlay = document.getElementById('intro-overlay');
const mainContent = document.getElementById('main-content');

function iniciarAnimacion() {
    sello.classList.add('girar-desvanecer');
    setTimeout(() => { sobreCerrado.style.opacity = '0'; sobreAbierto.style.opacity = '1'; }, 1000);
    setTimeout(() => { tarjetaIntro.classList.add('subir-tarjeta'); }, 1800);
    setTimeout(() => { botonContinuar.classList.add('mostrar-boton'); }, 2800);
}

function continuarIntro() {
    overlay.classList.add('ocultar-overlay');
    if (mainContent) mainContent.classList.remove('hidden');
    if (window.iniciarMusicaDesdeIntro) window.iniciarMusicaDesdeIntro();
    setTimeout(() => { overlay.style.display = 'none'; }, 750);
}

if (sello) sello.addEventListener('click', iniciarAnimacion);
if (botonContinuar) botonContinuar.addEventListener('click', continuarIntro);

/* ============================================================
   SLIDESHOW — auto-avance + navegación manual (fade transition)
   ============================================================ */
document.querySelectorAll('.slideshow').forEach(show => {
    const imgs = show.querySelectorAll('img');
    const counter = show.querySelector('.slide-counter');
    let idx = 0;
    const AUTO_DELAY = 4000; // ms entre cada foto

    function updateSlide(newIdx) {
        imgs[idx].classList.remove('active');
        idx = newIdx;
        imgs[idx].classList.add('active');
        if (counter) counter.textContent = (idx + 1) + ' / ' + imgs.length;
    }

    // Auto-avance automático
    let autoTimer = setInterval(() => {
        updateSlide((idx + 1) % imgs.length);
    }, AUTO_DELAY);

    // Al hacer clic manual se reinicia el temporizador
    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            updateSlide((idx + 1) % imgs.length);
        }, AUTO_DELAY);
    }

    const nextBtn = show.querySelector('.slide-next');
    const prevBtn = show.querySelector('.slide-prev');

    if (nextBtn) nextBtn.addEventListener('click', () => {
        updateSlide((idx + 1) % imgs.length);
        resetTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        updateSlide((idx - 1 + imgs.length) % imgs.length);
        resetTimer();
    });
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   RSVP — Google Sheets via Apps Script
   ============================================================ */

// Reemplaza esta URL con la del Web App desplegado en Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_KGX8-mjMwpVhjItNQBYz6xoBdmG-zZZzG2BpH60dEUWRjqIXJCgQLpGTm0k8BEtlVw/exec';

const btn = document.getElementById('button-send');

document.getElementById('rsvp-form').addEventListener('submit', function (event) {
    event.preventDefault();

    btn.innerText = 'ENVIANDO...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const formData = {
        from_name:  document.getElementById('from_name').value,
        last_name:  document.getElementById('last_name').value,
        age:        document.getElementById('age').value,
        attendance: document.querySelector('[name="attendance"]:checked')?.value || '',
        allergies:  document.getElementById('allergies').value,
    };

    fetch(SCRIPT_URL, {
        method:  'POST',
        body:    JSON.stringify(formData),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        mode:    'no-cors',
    })
    .then(() => {
        btn.innerText = '¡ENVIADO CON ÉXITO!';
        btn.style.backgroundColor = '#27ae60';
        btn.disabled = false;
        alert('¡Gracias! Tu confirmación ha sido recibida.');
        this.reset();
    })
    .catch(() => {
        btn.innerText = 'ERROR AL ENVIAR';
        btn.style.backgroundColor = '#e74c3c';
        btn.disabled = false;
        alert('Hubo un error al enviar. Intenta de nuevo.');
    });
});
