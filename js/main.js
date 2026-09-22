(function () {
  "use strict";

  const PHOTOS = [
    { src: "photos/01-fountain.png", alt: "Хунцэнгэл — шөнийн усан оргилын дэргэд", caption: "Хотын гэрэлтэй үдэш" },
    { src: "photos/05-roses.png", alt: "Хунцэнгэл — ягаан сарнайтай", caption: "Сарнай шиг ээж" },
    { src: "photos/02-flowers-blue.png", alt: "Хунцэнгэл — цэнхэр цэцэгтэй", caption: "Зуны өнгө" },
    { src: "photos/03-ger.png", alt: "Хунцэнгэл болон охин — гэрт", caption: "Бидний дулаахан гэр" },
    { src: "photos/06-baby.png", alt: "Хунцэнгэл — жижиг хүүхэлтэй", caption: "Анхны тэврэлт" },
    { src: "photos/08-forest.png", alt: "Хунцэнгэл болон охин — ойд", caption: "Ойн дундах аялал" },
    { src: "photos/07-airport.png", alt: "Хунцэнгэл — аэропорт", caption: "Замд гарсан нь" },
    { src: "photos/04-portrait.png", alt: "Хунцэнгэл — зураг", caption: "Миний хамгийн үзэсгэлэнтэй" },
  ];

  const LETTER_PARAGRAPHS = [
    "Ээжээ… ❤️",
    "Өнөөдөр таны төрсөн өдөр. Энэ өдөр зөвхөн таны төрсөн өдөр биш, харин миний амьдралд хамгийн эрхэм хүн ирсэн өдөр юм.",
    "Намайг төрүүлж, анхны алхмыг минь түшиж, унасан бүрд минь босгож, баярлахад минь хамт баярлаж, гуниглахад минь чимээгүйхэн дэргэд минь байсан танд би хэзээ ч хангалттай их баярлалаа гэж хэлж чадахгүй байх.",
    "Би том болох тусам таны надад зориулсан хайр, золиос бүрийг улам их ойлгож байна. Миний төлөө санаа зовсон шөнүүд, хэлээгүй олон үг, нуусан нулимс, үргэлж “зүгээр ээ” гэж инээмсэглэсэн таны минь цаана ямар их хайр байсныг одоо л ойлгож эхэлж байна.",
    "Ээжээ, би таныгаа үргэлж дэргэдээ байлгамаар байдаг. Хэзээ нэгэн өдөр таны ачийг бүрэн хариулж чадахгүй ч, таныгаа бахархуулах хүн болохыг л хамгийн их хүсдэг.",
    "Та минь эрүүл энх, урт удаан насалж, үр хүүхдийнхээ жаргалыг үзэж, үргэлж инээмсэглэж яваарай.",
    "Би хаана ч явсан, хэдэн нас хүрсэн ч таны жаахан охин хэвээрээ. ❤️",
    "Ээжээ, энэ хорвоод миний ээж болж төрсөнд баярлалаа.",
    "Тандаа үгээр хэлэхийн аргагүй их хайртай.",
    "Төрсөн өдрийн мэнд хүргэе, ❤️",
  ];

  const SLIDE_INTERVAL = 5500;
  let slideIndex = 0;
  let slideTimer = null;
  let lightboxIndex = 0;
  let musicPlaying = false;
  let ambientNodes = null;

  const intro = document.getElementById("intro");
  const enterBtn = document.getElementById("enter-btn");
  const heroSlides = document.getElementById("hero-slides");
  const heroDots = document.getElementById("hero-dots");
  const letterBody = document.getElementById("letter-body");
  const galleryGrid = document.getElementById("gallery-grid");
  const galleryCount = document.getElementById("gallery-count");
  const galleryFilters = document.querySelectorAll(".cam-filter");
  const bgAudio = document.getElementById("bg-audio");
  const musicToggle = document.getElementById("music-toggle");
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const heartsCanvas = document.getElementById("hearts-canvas");

  document.body.classList.add("intro-active");

  function buildHero() {
    PHOTOS.forEach((photo, i) => {
      const slide = document.createElement("div");
      slide.className = "hero__slide" + (i === 0 ? " is-active" : "");
      slide.setAttribute("role", "img");
      slide.setAttribute("aria-label", photo.alt);
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      slide.appendChild(img);
      heroSlides.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Зураг " + (i + 1));
      dot.addEventListener("click", () => goToSlide(i));
      heroDots.appendChild(dot);
    });
  }

  function getSlides() {
    return heroSlides.querySelectorAll(".hero__slide");
  }

  function getDots() {
    return heroDots.querySelectorAll(".hero__dot");
  }

  function goToSlide(index) {
    const slides = getSlides();
    const dots = getDots();
    if (!slides.length) return;
    slideIndex = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === slideIndex));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === slideIndex));
    resetSlideTimer();
  }

  function nextSlide() {
    goToSlide(slideIndex + 1);
  }

  function resetSlideTimer() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function buildLetter() {
    LETTER_PARAGRAPHS.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      letterBody.appendChild(p);
    });
  }

  function animateLetter() {
    const paragraphs = letterBody.querySelectorAll("p");
    paragraphs.forEach((p, i) => {
      setTimeout(() => p.classList.add("is-shown"), 400 + i * 650);
    });
  }

  function buildGallery() {
    PHOTOS.forEach((photo, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery__item polaroid";
      btn.setAttribute("aria-label", photo.alt + " — томруулах");
      const photoFrame = document.createElement("span");
      photoFrame.className = "polaroid__photo";
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";
      photoFrame.appendChild(img);
      ["polaroid__grain", "polaroid__leak", "polaroid__flash"].forEach((className) => {
        const overlay = document.createElement("span");
        overlay.className = className;
        photoFrame.appendChild(overlay);
      });
      const frameNumber = document.createElement("span");
      frameNumber.className = "polaroid__frame-num";
      frameNumber.textContent = String(i + 1).padStart(2, "0") + " / 08";
      const stamp = document.createElement("span");
      stamp.className = "polaroid__stamp";
      stamp.textContent = i % 2 === 0 ? "MEMORY" : "LOVE";
      const caption = document.createElement("span");
      caption.className = "polaroid__caption";
      caption.textContent = photo.caption;
      const tape = document.createElement("span");
      tape.className = "polaroid__tape";
      btn.append(photoFrame, frameNumber, stamp, caption, tape);
      btn.addEventListener("click", () => openLightbox(i));
      galleryGrid.appendChild(btn);
    });
  }

  function setGalleryFilter(filter) {
    galleryGrid.className = "gallery__grid gallery__grid--" + filter;
    galleryFilters.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    galleryCount.textContent = PHOTOS.length + " shots · " + (filter === "scatter" ? "all memories" : filter);
  }

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = PHOTOS[index].src;
    lightboxImg.alt = PHOTOS[index].alt;
    document.getElementById("lightbox-counter").textContent = String(index + 1).padStart(2, "0") + " / " + String(PHOTOS.length).padStart(2, "0");
    document.getElementById("lightbox-caption").textContent = PHOTOS[index].caption;
    lightbox.hidden = false;
    document.getElementById("shutter-flash").classList.add("is-active");
    setTimeout(() => document.getElementById("shutter-flash").classList.remove("is-active"), 80);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + PHOTOS.length) % PHOTOS.length;
    lightboxImg.src = PHOTOS[lightboxIndex].src;
    lightboxImg.alt = PHOTOS[lightboxIndex].alt;
    document.getElementById("lightbox-counter").textContent = String(lightboxIndex + 1).padStart(2, "0") + " / " + String(PHOTOS.length).padStart(2, "0");
    document.getElementById("lightbox-caption").textContent = PHOTOS[lightboxIndex].caption;
  }

  function startAmbientMusic() {
    if (ambientNodes) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 0.08;
      master.connect(ctx.destination);

      const notes = [261.63, 329.63, 392.0, 523.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.12 / notes.length;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.08 + i * 0.02;
        lfoGain.gain.value = 3 + i;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
      });

      ambientNodes = { ctx, master };
    } catch (_) {
      /* Web Audio unavailable */
    }
  }

  function stopAmbientMusic() {
    if (!ambientNodes) return;
    try {
      ambientNodes.master.gain.exponentialRampToValueAtTime(
        0.001,
        ambientNodes.ctx.currentTime + 0.5
      );
      setTimeout(() => {
        ambientNodes.ctx.close();
        ambientNodes = null;
      }, 600);
    } catch (_) {
      ambientNodes = null;
    }
  }

  async function playMusic() {
    let played = false;
    if (bgAudio) {
      try {
        bgAudio.volume = 0.45;
        await bgAudio.play();
        played = true;
      } catch (_) {
        /* file missing or autoplay blocked — use ambient */
      }
    }
    if (!played) {
      startAmbientMusic();
      if (ambientNodes) {
        await ambientNodes.ctx.resume();
      }
    }
    musicPlaying = true;
    musicToggle.classList.remove("is-muted");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Дуу унтраах");
  }

  function pauseMusic() {
    if (bgAudio) bgAudio.pause();
    stopAmbientMusic();
    musicPlaying = false;
    musicToggle.classList.add("is-muted");
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Дуу асаах");
  }

  function toggleMusic() {
    if (musicPlaying) pauseMusic();
    else playMusic();
  }

  function enterSite() {
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
    document.body.classList.add("is-ready");
    playMusic();
    resetSlideTimer();
    setTimeout(() => intro.remove(), 1200);
  }

  /* Floating hearts */
  function initHearts() {
    const ctx = heartsCanvas.getContext("2d");
    const hearts = [];
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      heartsCanvas.width = window.innerWidth;
      heartsCanvas.height = window.innerHeight;
    }

    function spawnHeart() {
      if (prefersReduced) return;
      hearts.push({
        x: Math.random() * heartsCanvas.width,
        y: heartsCanvas.height + 20,
        size: 8 + Math.random() * 14,
        speed: 0.4 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 0.6,
        opacity: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.5 ? "#c45c7a" : "#e8a0b8",
      });
    }

    function drawHeart(x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const top = y - size * 0.3;
      ctx.moveTo(x, top + size * 0.35);
      ctx.bezierCurveTo(x, top, x - size, top, x - size, top + size * 0.35);
      ctx.bezierCurveTo(x - size, top + size * 0.7, x, top + size, x, top + size * 1.15);
      ctx.bezierCurveTo(x, top + size, x + size, top + size * 0.7, x + size, top + size * 0.35);
      ctx.bezierCurveTo(x + size, top, x, top, x, top + size * 0.35);
      ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
      if (!prefersReduced && Math.random() < 0.04) spawnHeart();
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y -= h.speed;
        h.x += h.drift;
        drawHeart(h.x, h.y, h.size, h.hue, h.opacity);
        if (h.y < -40) hearts.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    frame();
  }

  /* Scroll reveal */
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.id === "letter-card") animateLetter();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    document.querySelectorAll(".gallery__item").forEach((el, i) => {
      el.style.transitionDelay = i * 80 + "ms";
      observer.observe(el);
    });
  }

  /* Nav mobile */
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });

  enterBtn.addEventListener("click", enterSite);
  musicToggle.addEventListener("click", toggleMusic);
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));
  galleryFilters.forEach((button) => {
    button.addEventListener("click", () => setGalleryFilter(button.dataset.filter));
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  buildHero();
  buildLetter();
  buildGallery();
  initHearts();
  initReveal();
})();
