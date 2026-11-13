/* ==========================================================================
   PINGGANG PINOY SA TINDAHAN — UI ANIMATIONS, MASCOT "PING", GAUGE & CONFETTI
   Respects prefers-reduced-motion automatically.
   ========================================================================== */

window.PINGGANG_UI = (function () {
  "use strict";

  const prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  /**
   * Generates inline SVG for Mascot "Ping" (a friendly plate with rice-grain eyes)
   * @param {"idle"|"happy"|"sleepy"|"worried"} mood
   */
  function getMascotSVG(mood) {
    const state = mood || "idle";
    let mouthPath = "M 64 98 Q 80 112 96 98"; // happy smile
    let browLeft = "";
    let browRight = "";
    let extra = "";

    if (state === "happy") {
      mouthPath = "M 60 95 Q 80 118 100 95 Z";
      extra = `<text x="122" y="42" font-size="18">✨</text><text x="24" y="46" font-size="16">💛</text>`;
    } else if (state === "sleepy") {
      mouthPath = "M 72 102 Q 80 106 88 102";
      extra = `<text x="116" y="44" font-size="15" font-weight="800" fill="#6B1E2E">zZ</text>`;
    } else if (state === "worried") {
      mouthPath = "M 64 106 Q 80 96 96 106";
      browLeft = `<line x1="54" y1="68" x2="68" y2="63" stroke="#3D0F1A" stroke-width="3.5" stroke-linecap="round"/>`;
      browRight = `<line x1="106" y1="68" x2="92" y2="63" stroke="#3D0F1A" stroke-width="3.5" stroke-linecap="round"/>`;
      extra = `<text x="120" y="54" font-size="16">💧</text>`;
    }

    const eyeTransform = state === "sleepy" ? 'transform="scale(1 0.25)"' : "";

    return `
      <svg viewBox="0 0 160 160" class="ping-mascot ${state}" role="img" aria-label="Si Ping ang masayang pinggan">
        <!-- Gold Glow Halo -->
        <circle cx="80" cy="82" r="70" fill="#F7E3B0" opacity="0.55" />
        <!-- Outer Burgundy Plate Rim -->
        <circle cx="80" cy="82" r="62" fill="#FFFBF5" stroke="#6B1E2E" stroke-width="6" />
        <!-- Inner Gold Trim -->
        <circle cx="80" cy="82" r="50" fill="none" stroke="#E8B84B" stroke-width="2.5" stroke-dasharray="5 3" />
        <!-- Rosy Cheeks -->
        <ellipse cx="50" cy="92" rx="8" ry="5" fill="#F5E4E8" />
        <ellipse cx="110" cy="92" rx="8" ry="5" fill="#F5E4E8" />
        ${browLeft}
        ${browRight}
        <!-- Rice-Grain Eyes -->
        <g class="ping-eye" ${eyeTransform}>
          <ellipse cx="62" cy="78" rx="6" ry="9" fill="#3D0F1A" />
          <circle cx="60" cy="75" r="2" fill="#FFFBF5" />
        </g>
        <g class="ping-eye" ${eyeTransform}>
          <ellipse cx="98" cy="78" rx="6" ry="9" fill="#3D0F1A" />
          <circle cx="96" cy="75" r="2" fill="#FFFBF5" />
        </g>
        <!-- Mouth -->
        <path d="${mouthPath}" fill="${state === "happy" ? "#A63550" : "none"}" stroke="#3D0F1A" stroke-width="4" stroke-linecap="round" />
        ${extra}
      </svg>
    `;
  }

  /**
   * Flies a food emoji clone from source card to the basket icon (450ms)
   */
  function flyEmojiToBasket(sourceEl, emoji) {
    if (prefersReducedMotion() || !sourceEl) return;
    const basketIcon = document.getElementById("basket-icon");
    if (!basketIcon) return;

    const startRect = sourceEl.getBoundingClientRect();
    const endRect = basketIcon.getBoundingClientRect();

    const flyer = document.createElement("span");
    flyer.className = "flying-emoji";
    flyer.textContent = emoji;
    flyer.style.left = `${startRect.left + startRect.width / 2 - 16}px`;
    flyer.style.top = `${startRect.top + startRect.height / 2 - 16}px`;
    document.body.appendChild(flyer);

    const dx = endRect.left - startRect.left;
    const dy = endRect.top - startRect.top;

    requestAnimationFrame(function () {
      flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.35)`;
      flyer.style.opacity = "0.2";
    });

    setTimeout(function () {
      flyer.remove();
      basketIcon.classList.remove("bounce");
      void basketIcon.offsetWidth;
      basketIcon.classList.add("bounce");
    }, 450);
  }

  /**
   * Animates the circular balance score gauge (0 -> target over 800ms)
   */
  let gaugeAnimId = null;
  function animateScoreGauge(targetScore) {
    const numEl = document.getElementById("score-number");
    const ringEl = document.getElementById("score-ring");
    if (!numEl || !ringEl) return;

    const circumference = 351.86; // 2 * pi * 56
    const clamped = Math.max(0, Math.min(100, Math.round(targetScore)));

    // Color based on score
    if (clamped >= 80) {
      ringEl.setAttribute("stroke", "#3F6B2A");
    } else if (clamped >= 50) {
      ringEl.setAttribute("stroke", "#C9962B");
    } else {
      ringEl.setAttribute("stroke", "#6B1E2E");
    }

    if (prefersReducedMotion()) {
      numEl.textContent = String(clamped);
      ringEl.style.strokeDashoffset = String(circumference * (1 - clamped / 100));
      return;
    }

    if (gaugeAnimId) cancelAnimationFrame(gaugeAnimId);
    const start = performance.now();
    const duration = 800;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * clamped);

      numEl.textContent = String(current);
      const offset = circumference * (1 - (eased * clamped) / 100);
      ringEl.style.strokeDashoffset = String(offset);

      if (progress < 1) {
        gaugeAnimId = requestAnimationFrame(tick);
      }
    }

    gaugeAnimId = requestAnimationFrame(tick);
  }

  /**
   * Lightweight canvas confetti (26 particles in burgundy, gold, and green; auto-clears after 1.5s)
   */
  let confettiTimer = null;
  function launchConfetti() {
    if (prefersReducedMotion()) return;
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6B1E2E", "#E8B84B", "#3F6B2A", "#A63550", "#C9962B"];
    const particles = [];
    for (let i = 0; i < 26; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 120,
        size: 7 + Math.random() * 7,
        vx: (Math.random() - 0.5) * 4,
        vy: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.2,
        color: colors[i % colors.length]
      });
    }

    const startTime = performance.now();
    if (confettiTimer) cancelAnimationFrame(confettiTimer);

    function frame(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed > 1500) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const alpha = elapsed > 1100 ? 1 - (elapsed - 1100) / 400 : 1;
      ctx.globalAlpha = Math.max(0, alpha);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      });

      confettiTimer = requestAnimationFrame(frame);
    }

    confettiTimer = requestAnimationFrame(frame);
  }

  return {
    getMascotSVG: getMascotSVG,
    flyEmojiToBasket: flyEmojiToBasket,
    animateScoreGauge: animateScoreGauge,
    launchConfetti: launchConfetti
  };
})();
