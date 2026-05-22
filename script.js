/**
 * Invitación digital — NIMO
 * ================================
 * EDITAR AQUÍ: fecha, horario, ubicación, teléfono, frases, fotos, maps, audio.
 */

const CONFIG = {
  MARCA: "NIMO",

  INVITACION: "Te invito a la gran inauguración de Nimo Company",
  HERO_TAGLINE: "Será un honor compartir este momento contigo.",

  FECHA: "Domingo 31 de mayo",
  HORARIO: "11:00 AM a 5:00 PM",

  /** Cuenta regresiva: año, mes (0 = enero), día, hora, minuto */
  COUNTDOWN_TARGET: new Date(2026, 4, 31, 11, 0, 0),

  UBICACION: "Ocampo Market",

  /**
   * Enlace exacto de Google Maps para Ocampo Market.
   * Reemplaza la cadena vacía por la URL real cuando la tengas.
   */
  MAPS_URL:
    "https://www.google.com/maps/search/?api=1&query=Ocampo+Market",

  /** Teléfono visible */
  TELEFONO: "9261820754",

  /**
   * WhatsApp: número con lada internacional (sin + ni espacios).
   * Ejemplo México: 52 + 10 dígitos → 529261820754
   */
  TELEFONO_WHATSAPP: "529261820754",

  WHATSAPP_MENSAJE:
    "Hola NIMO, vi la invitación digital y quiero más información.",

  FRASES: ["Comer rico es tu decisión", "Todo nace de Él"],

  INVITADOS_ESPECIALES:
    "Hoy cada persona que nos acompaña forma parte de este momento especial. Gracias por compartir con NIMO esta celebración.",

  CIERRE: {
    linea1: "Gracias por ser parte de este momento tan especial.",
    linea2: "Con cariño, NIMO",
  },

  AUDIO_SRC: "music/piano.mp3",

  /**
   * Galería en images/
   * layout: "portrait" | "landscape" — orienta el recorte y la cuadrícula
   * feature: true — celda más alta en escritorio (platillos destacados)
   */
  FOTOS_GALERIA: [
    {
      src: "images/1.jpeg",
      alt: "Chuleta con pasta cremosa, frijoles negros y maduros",
      layout: "portrait",
      feature: true,
    },
    {
      src: "images/2.jpeg",
      alt: "Bandejas de pabellón criollo listas para servir",
      layout: "portrait",
      feature: true,
    },
    {
      src: "images/3.jpeg",
      alt: "Arroz, carne mechada, huevo frito, aguacate y maduros",
      layout: "landscape",
    },
    {
      src: "images/4.jpeg",
      alt: "Pollo frito crujiente con arroz, frijoles y maduros",
      layout: "portrait",
    },
    {
      src: "images/5.jpeg",
      alt: "Pollo a la plancha con arroz, ensalada y plátano maduro",
      layout: "portrait",
      feature: true,
    },
    {
      src: "images/6.jpeg",
      alt: "Albóndigas en salsa con arroz, frijoles y ensalada fresca",
      layout: "portrait",
    },
    {
      src: "images/7.jpeg",
      alt: "Alitas glaseadas con pasta cremosa, frijoles y maduros",
      layout: "portrait",
    },
    {
      src: "images/8.jpeg",
      alt: "Bebida de chocolate NIMO en vaso con logo",
      layout: "portrait",
    },
    {
      src: "images/9.jpeg",
      alt: "Muslo de pollo asado con ensalada de papa y maduros",
      layout: "portrait",
    },
    {
      src: "images/10.jpeg",
      alt: "Bistec encebollado con arroz, maduros y ensalada fresca",
      layout: "portrait",
    },
    {
      src: "images/11.jpeg",
      alt: "Sancocho de res con arroz, arepitas y limón",
      layout: "portrait",
      feature: true,
    },
  ],

  VIDEO: {
    src: "images/c1.mp4",
    poster: "images/5.jpeg",
    titulo: "Vive la experiencia NIMO",
    descripcion: "Un vistazo a los sabores que te esperan en la inauguración.",
  },
};

/* ---------- Intro: pared interactiva + música tras el gesto del usuario ---------- */
function initWallIntro() {
  const audio = document.getElementById("musica-fondo");
  const btn = document.getElementById("btn-musica");
  const gate = document.getElementById("wall-intro");
  const wallBtn = document.getElementById("wall-target");
  const bricksRoot = document.getElementById("wall-bricks");
  const canvas = document.getElementById("wall-particles");
  const impactHost = document.getElementById("wall-impact-host");
  if (!gate || !wallBtn || !bricksRoot) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Tiempo que el confeti permanece visible sobre la invitación ya revelada */
  const CONFETTI_MS = reduceMotion ? 0 : 2600;

  const CONFETTI_COLORS = [
    "#d4af37",
    "#f5d78e",
    "#7a2f42",
    "#b54a3c",
    "#9b3d32",
    "#f0ece6",
    "#c8c0c8",
    "#e8b84a",
  ];

  if (audio) {
    const src = CONFIG.AUDIO_SRC;
    if (src) {
      const source = audio.querySelector("source");
      if (source) {
        source.src = src;
        audio.load();
      }
    }
  }

  const syncBtn = () => {
    if (!btn || !audio) return;
    const playing = !audio.paused;
    btn.setAttribute("aria-pressed", playing ? "true" : "false");
    btn.classList.toggle("music-player__btn--playing", playing);
  };

  function playDesdeInicio() {
    if (!audio) return Promise.resolve();
    try {
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
    return audio.play();
  }

  function revelarContenido() {
    document.body.classList.add("wall-intro-revealed");
    document.body.classList.remove("wall-intro-abierta");
    gate.classList.add("wall-intro--revealing");
    playDesdeInicio()
      .then(() => syncBtn())
      .catch(() => {});
  }

  function cerrarIntro() {
    gate.classList.remove("wall-intro--breaking", "wall-intro--revealing");
    gate.classList.remove("wall-intro--visible");
    gate.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      gate.style.display = "none";
    }, 450);
  }

  function crearLadrillo(row, col, isHalf) {
    const brick = document.createElement("span");
    brick.className = "wall-intro__brick";
    if (isHalf) brick.classList.add("wall-intro__brick--half");
    brick.dataset.row = String(row);
    brick.dataset.col = String(col);

    const hue = 4 + Math.random() * 14;
    const sat = 52 + Math.random() * 22;
    const light = 36 + Math.random() * 16;
    brick.style.setProperty("--brick-h", String(hue));
    brick.style.setProperty("--brick-s", `${sat}%`);
    brick.style.setProperty("--brick-l", `${light}%`);
    brick.style.setProperty("--brick-c1", `hsl(${hue} ${sat}% ${light + 8}%)`);
    brick.style.setProperty("--brick-c2", `hsl(${hue + 2} ${sat + 4}% ${light}%)`);
    brick.style.setProperty("--brick-c3", `hsl(${hue - 4} ${sat - 6}% ${light - 14}%)`);
    brick.style.setProperty("--brick-tilt", `${(Math.random() - 0.5) * 1.2}deg`);

    if (Math.random() < 0.22) brick.classList.add("wall-intro__brick--worn");
    if (Math.random() < 0.12) brick.classList.add("wall-intro__brick--chip");
    if (Math.random() < 0.08) brick.classList.add("wall-intro__brick--dark");

    return brick;
  }

  function crearLadrillos() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 8;
    const padX = 16;
    const padY = 18;
    /** Proporción ancho : alto (ladrillo horizontal, no cuadrado) */
    const aspect = 2.35;
    const targetBrickW = 112;

    const cols = Math.max(4, Math.floor((vw - padX) / targetBrickW));
    const innerW = vw - padX - gap * Math.max(0, cols - 1);
    const brickW = innerW / cols;
    const brickH = Math.round(brickW / aspect);
    const rows = Math.max(5, Math.ceil((vh - padY) / (brickH + gap)));

    bricksRoot.style.setProperty("--wall-cols", String(cols));
    bricksRoot.style.setProperty("--brick-h", `${brickH}px`);
    bricksRoot.style.setProperty("--wall-gap", `${gap}px`);
    bricksRoot.innerHTML = "";

    for (let r = 0; r < rows; r += 1) {
      const rowEl = document.createElement("div");
      rowEl.className = "wall-intro__row";
      if (r % 2 === 1) rowEl.classList.add("wall-intro__row--offset");

      if (r % 2 === 1) {
        rowEl.appendChild(crearLadrillo(r, -1, true));
      }

      for (let c = 0; c < cols; c += 1) {
        rowEl.appendChild(crearLadrillo(r, c, false));
      }

      if (r % 2 === 1) {
        rowEl.appendChild(crearLadrillo(r, cols, true));
      }

      bricksRoot.appendChild(rowEl);
    }
  }

  function aplicarExplosion(ix, iy) {
    const rect = wallBtn.getBoundingClientRect();
    const maxDist = Math.hypot(rect.width, rect.height) * 0.55;

    bricksRoot.querySelectorAll(".wall-intro__brick").forEach((brick) => {
      const bRect = brick.getBoundingClientRect();
      const bx = bRect.left + bRect.width / 2 - rect.left;
      const by = bRect.top + bRect.height / 2 - rect.top;
      const dist = Math.hypot(bx - ix, by - iy);
      const norm = Math.min(1, dist / maxDist);
      const angle = Math.atan2(by - iy, bx - ix);
      const force = 60 + (1 - norm) * 280;
      const spread = 0.65 + Math.random() * 0.9;

      const dx = Math.cos(angle) * force * spread + (Math.random() - 0.5) * 40;
      const dy =
        Math.sin(angle) * force * spread + 50 + Math.random() * 100 + norm * 40;

      brick.style.setProperty("--brick-dx", `${dx.toFixed(1)}px`);
      brick.style.setProperty("--brick-dy", `${dy.toFixed(1)}px`);
      brick.style.setProperty(
        "--brick-rot",
        `${((Math.random() - 0.5) * 140 + (1 - norm) * 40).toFixed(1)}deg`
      );
      brick.style.setProperty("--brick-delay", `${(norm * 0.38 + Math.random() * 0.06).toFixed(3)}s`);
      brick.style.setProperty("--brick-scale", `${(0.35 + Math.random() * 0.5).toFixed(2)}`);
      if (norm < 0.35) brick.classList.add("wall-intro__brick--burst");
    });
  }

  function lanzarConfettiFiesta() {
    const host = document.getElementById("wall-confetti");
    if (!host || reduceMotion) return;
    host.innerHTML = "";

    for (let i = 0; i < 64; i += 1) {
      const piece = document.createElement("span");
      const isRect = Math.random() > 0.3;
      piece.className = `wall-confetti__piece${isRect ? " wall-confetti__piece--rect" : ""}`;
      piece.style.setProperty("--cf-color", CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
      piece.style.setProperty("--cf-x", `${(Math.random() - 0.5) * 90}vw`);
      piece.style.setProperty("--cf-sway", `${(Math.random() - 0.5) * 80}px`);
      piece.style.setProperty("--cf-delay", `${Math.random() * 0.45}s`);
      piece.style.setProperty("--cf-dur", `${2 + Math.random() * 1.6}s`);
      piece.style.setProperty("--cf-rot", `${Math.random() * 720}deg`);
      piece.style.setProperty("--cf-size", `${6 + Math.random() * 8}px`);
      host.appendChild(piece);
    }
  }

  function mostrarImpacto(ix, iy) {
    if (!impactHost) return;
    impactHost.innerHTML = "";
    const ripple = document.createElement("span");
    ripple.className = "wall-intro__impact";
    ripple.style.left = `${ix}px`;
    ripple.style.top = `${iy}px`;
    impactHost.appendChild(ripple);
  }

  function lanzarParticulas(ix, iy) {
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const wallRect = wallBtn.getBoundingClientRect();
    const cx = wallRect.left + (ix != null ? ix : wallRect.width / 2);
    const cy = wallRect.top + (iy != null ? iy : wallRect.height * 0.42);

    const particles = [];
    const fiestaColors = [
      [212, 175, 55],
      [245, 215, 142],
      [181, 74, 60],
      [155, 61, 50],
      [240, 236, 230],
      [192, 192, 200],
      [255, 200, 120],
    ];

    for (let i = 0; i < 130; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 14;
      const roll = Math.random();
      let type = "confetti";
      if (roll < 0.28) type = "spark";
      else if (roll < 0.45) type = "dust";

      const color = fiestaColors[Math.floor(Math.random() * fiestaColors.length)];
      particles.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === "spark" ? 4 : 2),
        life: 1,
        w: type === "confetti" ? 4 + Math.random() * 6 : 2 + Math.random() * 4,
        h: type === "confetti" ? 3 + Math.random() * 5 : 2 + Math.random() * 4,
        type,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color,
        flutter: Math.random() * Math.PI * 2,
        flutterSpd: 0.08 + Math.random() * 0.12,
      });
    }

    let frame = 0;
    const maxFrames = 150;

    function drawParticle(p) {
      const alpha = p.life * (p.type === "spark" ? 1 : 0.88);
      if (alpha <= 0) return;
      ctx.globalAlpha = alpha;
      const [r, g, b] = p.color;

      if (p.type === "spark") {
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.w * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === "dust") {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.w, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.flutter += p.flutterSpd;
        p.x += p.vx + Math.sin(p.flutter) * (p.type === "confetti" ? 1.2 : 0.3);
        p.y += p.vy;
        p.vy += p.type === "spark" ? 0.05 : 0.14;
        p.vx *= 0.992;
        p.life -= p.type === "spark" ? 0.018 : 0.011;
        p.rot += p.vr;
        if (p.life <= 0) return;
        drawParticle(p);
      });
      frame += 1;
      if (frame < maxFrames) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    }

    tick();
  }

  function abrirExperiencia(ev) {
    if (gate.classList.contains("wall-intro--breaking")) return;

    const rect = wallBtn.getBoundingClientRect();
    let ix = rect.width / 2;
    let iy = rect.height * 0.42;

    if (ev && "clientX" in ev) {
      ix = ev.clientX - rect.left;
      iy = ev.clientY - rect.top;
    }

    const pctX = (ix / rect.width) * 100;
    const pctY = (iy / rect.height) * 100;
    gate.style.setProperty("--impact-x", `${pctX}%`);
    gate.style.setProperty("--impact-y", `${pctY}%`);

    if (reduceMotion) {
      aplicarExplosion(ix, iy);
      gate.classList.add("wall-intro--breaking");
      revelarContenido();
      window.setTimeout(cerrarIntro, 0);
      return;
    }

    mostrarImpacto(ix, iy);
    aplicarExplosion(ix, iy);
    gate.classList.add("wall-intro--breaking");
    revelarContenido();
    lanzarConfettiFiesta();
    lanzarParticulas(ix, iy);
    window.setTimeout(cerrarIntro, CONFETTI_MS);
  }

  crearLadrillos();
  document.body.classList.add("wall-intro-abierta");
  gate.setAttribute("aria-hidden", "false");
  wallBtn.focus();

  wallBtn.addEventListener("click", abrirExperiencia);
  wallBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirExperiencia(e);
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    if (gate.classList.contains("wall-intro--breaking")) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(crearLadrillos, 200);
  });

  if (btn && audio) {
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(syncBtn).catch(() => {});
      } else {
        audio.pause();
        syncBtn();
      }
    });
    audio.addEventListener("play", syncBtn);
    audio.addEventListener("pause", syncBtn);
  }
}

/* ---------- Contenido desde CONFIG ---------- */
function initContenido() {
  const heroInvitacion = document.getElementById("hero-invitacion");
  const heroTagline = document.getElementById("hero-tagline");
  const heroMarca = document.getElementById("hero-titulo");
  if (heroInvitacion) heroInvitacion.textContent = CONFIG.INVITACION;
  if (heroTagline) heroTagline.textContent = CONFIG.HERO_TAGLINE;
  if (heroMarca) heroMarca.textContent = CONFIG.MARCA;

  const horario = document.getElementById("evento-horario");
  if (horario) horario.textContent = CONFIG.HORARIO;

  const fechaLabel = document.querySelector(".date-banner__label");
  if (fechaLabel) fechaLabel.textContent = CONFIG.FECHA;

  const lugar = document.getElementById("evento-lugar");
  const ubicTexto = document.getElementById("evento-ubicacion-texto");
  if (lugar) lugar.textContent = CONFIG.UBICACION;
  if (ubicTexto) ubicTexto.textContent = CONFIG.UBICACION;

  const invTexto = document.getElementById("invitados-texto");
  if (invTexto) invTexto.textContent = CONFIG.INVITADOS_ESPECIALES;

  const c1 = document.getElementById("cierre-linea1");
  const c2 = document.getElementById("cierre-linea2");
  if (c1) c1.textContent = CONFIG.CIERRE.linea1;
  if (c2) c2.textContent = CONFIG.CIERRE.linea2;

  const frasesRoot = document.getElementById("frases-container");
  if (frasesRoot && CONFIG.FRASES) {
    frasesRoot.innerHTML = CONFIG.FRASES.map(
      (texto) =>
        `<blockquote class="quote" role="listitem"><p class="quote__text">${escapeHtml(texto)}</p></blockquote>`
    ).join("");
  }

  const tel = document.getElementById("contacto-telefono");
  if (tel) {
    tel.textContent = CONFIG.TELEFONO;
    tel.href = `tel:${CONFIG.TELEFONO.replace(/\s/g, "")}`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initMapLinks() {
  const link = document.querySelector(".js-map-ubicacion");
  if (link && CONFIG.MAPS_URL) link.href = CONFIG.MAPS_URL;
}

function initWhatsApp() {
  const link = document.querySelector(".js-whatsapp");
  if (!link) return;
  const num = CONFIG.TELEFONO_WHATSAPP.replace(/\D/g, "");
  const msg = encodeURIComponent(CONFIG.WHATSAPP_MENSAJE);
  link.href = `https://wa.me/${num}?text=${msg}`;
}

function normalizeFotoGaleria(item, index) {
  if (typeof item === "string") {
    return {
      src: item,
      alt: `NIMO — foto ${index + 1}`,
      layout: "portrait",
      feature: false,
    };
  }
  return {
    src: item.src,
    alt: item.alt || `NIMO — foto ${index + 1}`,
    layout: item.layout === "landscape" ? "landscape" : "portrait",
    feature: Boolean(item.feature),
  };
}

/* ---------- Galería dinámica con placeholders ---------- */
function initGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid || !CONFIG.FOTOS_GALERIA) return;

  grid.innerHTML = CONFIG.FOTOS_GALERIA.map((raw, i) => {
    const foto = normalizeFotoGaleria(raw, i);
    const isLandscape = foto.layout === "landscape";
    const layoutClass = isLandscape
      ? "gallery__cell--landscape"
      : "gallery__cell--portrait";
    const featureClass = foto.feature ? " gallery__cell--feature" : "";
    const w = isLandscape ? 1000 : 800;
    const h = isLandscape ? 750 : 1000;
    return `
      <figure
        class="gallery__cell js-galeria-item ${layoutClass}${featureClass}"
        role="listitem"
        data-gallery-i="${i}"
        style="--gallery-i: ${i}"
        tabindex="0"
      >
        <div class="gallery__shine" aria-hidden="true"></div>
        <div class="gallery__placeholder" aria-hidden="true">
          <span class="gallery__placeholder-icon">◇</span>
          <span class="gallery__placeholder-text">Foto ${i + 1}</span>
        </div>
        <img
          class="gallery__img"
          data-gallery-index="${i}"
          src="${escapeHtml(foto.src)}"
          alt="${escapeHtml(foto.alt)}"
          width="${w}"
          height="${h}"
          loading="lazy"
          decoding="async"
        />
      </figure>`;
  }).join("");

  grid.querySelectorAll(".gallery__img").forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.remove("gallery__img--missing");
      const cell = img.closest(".gallery__cell");
      if (cell) cell.classList.remove("gallery__cell--placeholder");
    });
    img.addEventListener("error", () => {
      img.classList.add("gallery__img--missing");
      const cell = img.closest(".gallery__cell");
      if (cell) cell.classList.add("gallery__cell--placeholder");
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });

  initGaleriaObserver();
}

function initVideo() {
  const cfg = CONFIG.VIDEO;
  const video = document.getElementById("video-nimo-player");
  if (!video || !cfg?.src) return;

  const source = video.querySelector("source");
  if (source) source.src = cfg.src;
  if (cfg.poster) video.poster = cfg.poster;
  video.load();

  const titulo = document.getElementById("video-titulo");
  const desc = document.getElementById("video-descripcion");
  if (titulo && cfg.titulo) titulo.textContent = cfg.titulo;
  if (desc && cfg.descripcion) desc.textContent = cfg.descripcion;
}

function initGaleriaObserver() {
  const section = document.getElementById("galeria-visual");
  const items = section ? section.querySelectorAll(".js-galeria-item") : [];
  if (!section || !items.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    items.forEach((el) => el.classList.add("gallery__cell--inview"));
    return;
  }

  let triggered = false;
  const activate = () => {
    if (triggered) return;
    triggered = true;
    items.forEach((el, i) => {
      window.setTimeout(() => {
        el.classList.add("gallery__cell--inview");
      }, i * 95);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activate();
          io.disconnect();
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: "0px 0px 8% 0px" }
  );

  io.observe(section);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const now = Date.now();
  const end = CONFIG.COUNTDOWN_TARGET.getTime();
  let diff = Math.max(0, end - now);

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(diff / day);
  diff -= days * day;
  const hours = Math.floor(diff / hour);
  diff -= hours * hour;
  const minutes = Math.floor(diff / minute);
  diff -= minutes * minute;
  const seconds = Math.floor(diff / second);

  const set = (unit, value) => {
    const el = root.querySelector(`[data-unit="${unit}"]`);
    if (el) el.textContent = pad2(value);
  };

  set("days", days);
  set("hours", hours);
  set("minutes", minutes);
  set("seconds", seconds);
}

function initReveal() {
  const blocks = document.querySelectorAll(".reveal");
  if (!blocks.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    blocks.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  blocks.forEach((el, index) => {
    el.style.setProperty("--reveal-order", String(Math.min(index, 12)));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  blocks.forEach((el) => observer.observe(el));
}

function init() {
  initContenido();
  initWallIntro();
  initMapLinks();
  initWhatsApp();
  initGaleria();
  initVideo();
  initReveal();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
