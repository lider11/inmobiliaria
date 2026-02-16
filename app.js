// ==========================
// CONFIG (AJUSTALA)
// ==========================
const BUSINESS = {
  name: "Constructora Nuevo Mundo",
  project: "Mares de Juan de Acosta",
  // Cambia por tu numero real en formato internacional sin + ni espacios (ej: 573001234567)
  whatsappNumber: "573000000000",
  defaultMessage:
    "Hola, estoy interesado(a) en informacion del proyecto y disponibilidad de lotes. ¿Me puedes asesorar?"
};
const ANALYTICS_KEY = "nm_analytics_v1";

// Lotes DEMO (ajusta con datos reales)
const LOTS = [
  { id: "L-101", area: 350, type: "estandar", label: "Estándar", price: 49000000, status: "Disponible", note: "Ideal inversion/descanso" },
  { id: "L-102", area: 350, type: "estandar", label: "Estándar", price: 52000000, status: "Disponible", note: "Cerca de zona verde" },
  { id: "L-103", area: 389, type: "premium", label: "Premium", price: 65000000, status: "Disponible", note: "Mayor frente y privacidad" },
  { id: "L-104", area: 431, type: "premium", label: "Premium", price: 74000000, status: "Disponible", note: "Excelente para casa amplia" },
  { id: "L-105", area: 548, type: "premium", label: "Premium", price: 92000000, status: "Disponible", note: "Lote amplio premium" },
  { id: "L-106", area: 637, type: "premium", label: "Premium", price: 108000000, status: "Disponible", note: "Top: espacio y valorizacion" }
];

// ==========================
// HELPERS
// ==========================
const money = (n) => {
  try {
    return n.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    });
  } catch (e) {
    return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${text}`;
}

function trackEvent(name, payload = {}) {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const data = raw ? JSON.parse(raw) : { counts: {}, events: [] };

    data.counts[name] = (data.counts[name] || 0) + 1;
    data.events.unshift({
      name,
      ts: new Date().toISOString(),
      ...payload
    });
    data.events = data.events.slice(0, 200);

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {
    // Silent fallback: analytics should never break UI behavior.
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  }
}

// ==========================
// TOAST
// ==========================
let toastTimer = null;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText = `
      position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%);
      background: rgba(0,0,0,.55); color: #fff; padding: 12px 14px; border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18); z-index: 99; font-weight: 800; font-size: 13px;
      backdrop-filter: blur(10px); box-shadow: 0 18px 50px rgba(0,0,0,.35);
    `;
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.style.opacity = "0"), 1800);
}

// ==========================
// LOTES (render + filtro)
// ==========================
const grid = document.getElementById("lotsGrid");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const countPill = document.getElementById("countPill");
const resetBtn = document.getElementById("resetBtn");

function renderLots() {
  const q = (search.value || "").trim().toLowerCase();
  const f = filter.value;

  const results = LOTS.filter((l) => {
    const blob = `${l.id} ${l.area} ${l.type} ${l.label} ${l.status} ${l.note}`.toLowerCase();
    const okQ = !q || blob.includes(q);
    const okF = f === "all" || l.type === f;
    return okQ && okF;
  });

  countPill.textContent = `${results.length} resultado(s)`;

  grid.innerHTML = results
    .map((l) => {
      const msg = `Hola, deseo cotizar el ${l.id} (${l.area} m²) del proyecto ${BUSINESS.project}. ¿Está disponible?`;
      const safeMsg = msg.replace(/"/g, "&quot;");
      return `
        <article class="lot reveal">
          <div class="tag">${l.label}</div>
          <div class="lot-top">
            <div class="lot-code">${l.id}</div>
            <div class="lot-area">${l.area} m²</div>
          </div>
          <div class="meta">${l.status} · ${l.note}</div>
          <div class="lot-price">${money(l.price)}</div>
          <div class="lot-price-label">Precio referencial</div>
          <div class="lot-kpis">
            <div class="lot-kpi"><b>Tipo:</b> ${l.label}</div>
            <div class="lot-kpi"><b>Área:</b> ${l.area} m²</div>
          </div>
          <div class="lot-actions">
            <a class="btn primary" data-track="lot-quote" data-lot-id="${l.id}" href="${waLink(msg)}" target="_blank" rel="noopener">Cotizar</a>
            <button class="btn" data-copy="${safeMsg}">Copiar</button>
          </div>
          <div class="hint">Solicita lista actualizada y condiciones vigentes.</div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll('button[data-copy]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy").replace(/&quot;/g, '"');
      await copyText(text);
      toast("Mensaje copiado ✅");
    });
  });

  grid.querySelectorAll('a[data-track="lot-quote"]').forEach((a) => {
    a.addEventListener("click", () => {
      trackEvent("lot_quote_click", { lotId: a.getAttribute("data-lot-id") || "" });
    });
  });

  revealNow();
}

// ==========================
// FORM -> WhatsApp
// ==========================
const form = document.getElementById("leadForm");
const copyBtn = document.getElementById("copyBtn");

function buildLeadMessage(data) {
  const lines = [
    `Hola, soy ${data.get("nombre")}.`,
    `Tel: ${data.get("telefono")}`,
    data.get("email") ? `Email: ${data.get("email")}` : null,
    `Interés: ${data.get("interes")} · Horario: ${data.get("horario")}`,
    data.get("mensaje") ? `Mensaje: ${data.get("mensaje")}` : null,
    `Proyecto: ${BUSINESS.project}`
  ].filter(Boolean);

  return lines.join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const msg = buildLeadMessage(data);
  trackEvent("lead_form_submit", {
    interes: data.get("interes") || "",
    horario: data.get("horario") || ""
  });
  window.open(waLink(msg), "_blank", "noopener");
});

copyBtn.addEventListener("click", async () => {
  const data = new FormData(form);
  const msg = buildLeadMessage(data);
  await copyText(msg);
  toast("Mensaje copiado ✅");
});

// ==========================
// WhatsApp CTAs
// ==========================
const waFloat = document.getElementById("waFloat");
const ctaWhats = document.getElementById("ctaWhats");

function initWhats() {
  const msg = BUSINESS.defaultMessage + `\nProyecto: ${BUSINESS.project}`;

  waFloat.href = waLink(msg);
  waFloat.target = "_blank";
  waFloat.rel = "noopener";

  ctaWhats.href = waLink(msg);
  ctaWhats.target = "_blank";
  ctaWhats.rel = "noopener";

  waFloat.addEventListener("click", () => trackEvent("whatsapp_click_float"));
  ctaWhats.addEventListener("click", () => trackEvent("whatsapp_click_hero"));
}

function initDynamicWaCta() {
  if (!waFloat) return;
  const waLabel = waFloat.querySelector("span");
  const sections = [
    {
      id: "lotes",
      label: "Cotizar lotes",
      message: "Hola, quiero ver disponibilidad actual y precios de lotes."
    },
    {
      id: "videos",
      label: "Agendar recorrido",
      message: "Hola, quiero agendar un recorrido guiado del proyecto."
    },
    {
      id: "faq",
      label: "Resolver dudas",
      message: "Hola, tengo preguntas sobre financiación y separación de lote."
    },
    {
      id: "contacto",
      label: "Enviar datos",
      message: "Hola, quiero dejar mis datos y recibir una llamada hoy."
    }
  ]
    .map((s) => ({ ...s, el: document.getElementById(s.id) }))
    .filter((s) => s.el);

  const applyState = (state) => {
    if (!state) return;
    if (waLabel) waLabel.textContent = state.label;
    waFloat.href = waLink(`${state.message}\nProyecto: ${BUSINESS.project}`);
  };

  if (!sections.length) {
    applyState({
      label: "WhatsApp",
      message: BUSINESS.defaultMessage
    });
    return;
  }

  let activeId = "";
  let ticking = false;

  const setActive = (next) => {
    if (!next || next.id === activeId) return;
    activeId = next.id;
    applyState(next);
  };

  // Decide la seccion activa usando una linea de referencia en el viewport.
  const evaluateSection = () => {
    ticking = false;
    const viewportPivot = window.innerHeight * 0.42;

    let inside = null;
    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const rect = section.el.getBoundingClientRect();
      const isInside = rect.top <= viewportPivot && rect.bottom >= viewportPivot;
      if (isInside) inside = section;

      const distance = Math.abs(rect.top - viewportPivot);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = section;
      }
    });

    setActive(inside || nearest || sections[0]);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(evaluateSection);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  evaluateSection();
}

// ==========================
// FAQ Accordion
// ==========================
function initFaq() {
  document.querySelectorAll(".faq .item").forEach((item) => {
    const btn = item.querySelector("button");
    const ans = item.querySelector(".ans");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const nextOpen = !item.classList.contains("open");
      item.classList.toggle("open", nextOpen);
      btn.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      ans.hidden = !nextOpen;
    });
  });
}

function initFaqSearch() {
  const faqSearch = document.getElementById("faqSearch");
  const faqCountPill = document.getElementById("faqCountPill");
  const items = Array.from(document.querySelectorAll(".faq .item"));
  if (!faqSearch || !faqCountPill || !items.length) return;

  const applyFilter = () => {
    const q = (faqSearch.value || "").trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const txt = item.textContent.toLowerCase();
      const show = !q || txt.includes(q);
      item.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    faqCountPill.textContent = `${visible} pregunta(s)`;
  };

  faqSearch.addEventListener("input", applyFilter);
  applyFilter();
}

// ==========================
// Theme toggle
// ==========================
const themeBtn = document.getElementById("themeBtn");
const themeBtn2 = document.getElementById("themeBtn2");

function setTheme(t) {
  document.body.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}
function toggleTheme() {
  const cur = document.body.getAttribute("data-theme");
  setTheme(cur === "dark" ? "light" : "dark");
}
themeBtn.addEventListener("click", toggleTheme);
themeBtn2.addEventListener("click", toggleTheme);

// ==========================
// Mobile drawer
// ==========================
const drawer = document.getElementById("drawer");
const openDrawer = document.getElementById("openDrawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawerPanel = drawer ? drawer.querySelector(".panel") : null;
let lastFocusedBeforeDrawer = null;

function getFocusable(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function onDrawerKeydown(e) {
  if (e.key === "Escape") {
    showDrawer(false);
    return;
  }
  if (e.key !== "Tab") return;

  const focusables = getFocusable(drawerPanel);
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function showDrawer(show) {
  if (!drawer || !openDrawer) return;

  drawer.style.display = show ? "block" : "none";
  drawer.setAttribute("aria-hidden", show ? "false" : "true");

  if (show) {
    lastFocusedBeforeDrawer = document.activeElement;
    openDrawer.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onDrawerKeydown);

    const focusables = getFocusable(drawerPanel);
    (focusables[0] || closeDrawer || drawer).focus();
  } else {
    openDrawer.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onDrawerKeydown);
    if (lastFocusedBeforeDrawer && typeof lastFocusedBeforeDrawer.focus === "function") {
      lastFocusedBeforeDrawer.focus();
    } else {
      openDrawer.focus();
    }
  }
}
if (openDrawer) openDrawer.addEventListener("click", () => showDrawer(true));
if (closeDrawer) closeDrawer.addEventListener("click", () => showDrawer(false));
if (drawer) {
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) showDrawer(false);
  });
}
document.querySelectorAll(".drawerLink").forEach((a) =>
  a.addEventListener("click", () => showDrawer(false))
);

// ==========================
// Reveal on scroll
// ==========================
let observer = null;
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) ent.target.classList.add("show");
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => observer.observe(el));
}
function revealNow() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) el.classList.add("show");
  });
}

// ==========================
// Smooth scroll (anchors)
// ==========================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  });
});

// ==========================
// (Opcional UX) Pausar otros videos al reproducir uno
// ==========================
function initVideoLazyLoad() {
  const videos = Array.from(document.querySelectorAll("video"));
  if (!videos.length) return;

  const loadVideo = (video) => {
    if (!video || video.dataset.loaded === "true") return;
    const source = video.querySelector("source[data-src]");
    if (!source) return;
    source.src = source.dataset.src;
    video.dataset.loaded = "true";
    video.load();
  };

  videos.forEach((video) => {
    const eagerLoad = () => loadVideo(video);
    video.addEventListener("play", eagerLoad);
    video.addEventListener("mouseenter", eagerLoad, { once: true });
    video.addEventListener("focusin", eagerLoad, { once: true });
  });

  if (!("IntersectionObserver" in window)) {
    videos.forEach(loadVideo);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "220px 0px", threshold: 0.01 }
  );

  videos.forEach((video) => observer.observe(video));
}

function initVideoExclusivePlay() {
  const videos = Array.from(document.querySelectorAll("video"));
  videos.forEach((v) => {
    v.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== v && !other.paused) other.pause();
      });
    });
  });
}

// ==========================
// Boot
// ==========================
(function boot() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") setTheme(saved);

  initWhats();
  initDynamicWaCta();
  initFaq();
  initFaqSearch();
  initVideoLazyLoad();
  renderLots();
  initReveal();
  initVideoExclusivePlay();

  search.addEventListener("input", renderLots);
  filter.addEventListener("change", renderLots);
  resetBtn.addEventListener("click", () => {
    search.value = "";
    filter.value = "all";
    renderLots();
  });
})();


