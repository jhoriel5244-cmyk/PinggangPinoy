/* ==========================================================================
   PINGGANG PINOY SA TINDAHAN — STATE, ROUTER, NUTRITION ENGINE & RENDERING
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.PINGGANG_DATA;
  const UI = window.PINGGANG_UI;
  const STORAGE_KEY = "pinggang_pinoy_state_v1";

  // Safe localStorage wrapper (degrades gracefully to in-memory)
  const memoryStorage = {};
  const store = {
    get: function (key) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return memoryStorage[key] || null;
      }
    },
    set: function (key, val) {
      try {
        window.localStorage.setItem(key, val);
      } catch (e) {
        memoryStorage[key] = val;
      }
    },
    remove: function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        delete memoryStorage[key];
      }
    }
  };

  // Default Application State
  const defaultState = {
    step: "welcome",
    budget: 150,
    people: 5,
    meal: "Tanghalian",
    condition: "none", // "none" | "hypertension" | "diabetes" | "both"
    category: "all",
    bataMode: false,
    basket: {}, // { [foodId]: quantity }
    unlockedBadges: [], // array of badge IDs
    celebratedBalanced: false
  };

  let state = loadState();
  let newlyUnlockedIds = [];

  function loadState() {
    const raw = store.get(STORAGE_KEY);
    if (!raw) return Object.assign({}, defaultState);
    try {
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaultState, parsed, {
        basket: parsed.basket || {},
        unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : []
      });
    } catch (e) {
      return Object.assign({}, defaultState);
    }
  }

  function saveState() {
    store.set(STORAGE_KEY, JSON.stringify(state));
  }

  function getFoodById(id) {
    return DATA.FOODS.find(function (f) { return f.id === id; });
  }

  // ==========================================================================
  // CORE NUTRITION, BUDGET & CONDITION EVALUATION ENGINE
  // ==========================================================================

  function evaluateMeal() {
    const entries = Object.keys(state.basket)
      .map(function (id) {
        const food = getFoodById(id);
        const qty = state.basket[id];
        return food && qty > 0 ? { food: food, qty: qty } : null;
      })
      .filter(Boolean);

    let totalCost = 0;
    let goCount = 0;
    let growCount = 0;
    let glowCount = 0;
    let goServings = 0;
    let hasProtein = false;
    let hasVegOrFruit = false;
    let hasWater = false;
    let hasSweetDrink = false;

    entries.forEach(function (entry) {
      const f = entry.food;
      const q = entry.qty;
      totalCost += f.price * q;

      if (f.group === "go") {
        goCount += q;
        goServings += f.servings * q;
      } else if (f.group === "grow") {
        growCount += q;
      } else if (f.group === "glow") {
        glowCount += q;
        hasVegOrFruit = true;
      } else if (f.group === "drink") {
        if (f.id === "tubig" || f.id === "buko_juice") hasWater = true;
        if (f.tags.includes("highSugar")) hasSweetDrink = true;
      }

      if (f.tags.includes("goodProtein")) {
        hasProtein = true;
      }
    });

    const underBudget = totalCost <= state.budget;
    const isBalanced = goCount >= 1 && growCount >= 1 && glowCount >= 1 && underBudget && entries.length > 0;

    // Condition Flagging
    const flaggedItems = [];
    const activeConditions = [];
    if (state.condition === "hypertension" || state.condition === "both") {
      activeConditions.push("hypertension");
    }
    if (state.condition === "diabetes" || state.condition === "both") {
      activeConditions.push("diabetes");
    }

    entries.forEach(function (entry) {
      const f = entry.food;
      let matchedCond = null;

      if (activeConditions.includes("hypertension") && f.tags.includes("highSodium")) {
        matchedCond = "hypertension";
      } else if (activeConditions.includes("diabetes") && f.tags.includes("highSugar")) {
        matchedCond = "diabetes";
      }

      if (matchedCond) {
        const swapFood = f.swapFor ? getFoodById(f.swapFor) : null;
        flaggedItems.push({
          food: f,
          qty: entry.qty,
          condition: matchedCond,
          reason: DATA.CONDITION_RULES[matchedCond].getReason(f, state.bataMode),
          swapFood: swapFood
        });
      }
    });

    // Weighted Score Calculation (100 max):
    // Coverage 40 (13.33 each for Go/Grow/Glow), Protein 15, Veg/Fruit 15, Condition Safety 20, Budget Fit 10
    let score = 0;
    if (entries.length > 0) {
      const groupParts = (goCount >= 1 ? 1 : 0) + (growCount >= 1 ? 1 : 0) + (glowCount >= 1 ? 1 : 0);
      score += Math.round((groupParts / 3) * 40);
      if (hasProtein) score += 15;
      if (hasVegOrFruit) score += 15;

      const conditionScore = Math.max(0, 20 - flaggedItems.length * 8);
      score += conditionScore;

      if (underBudget) {
        score += 10;
      }
    }
    score = Math.max(0, Math.min(100, score));

    // Evaluate Badges
    const earnedNow = [];
    if (glowCount >= 2) earnedNow.push("veggie_hero");
    if (hasProtein) earnedNow.push("protein_pro");
    if (isBalanced) earnedNow.push("budget_boss");
    if (hasWater && !hasSweetDrink) earnedNow.push("water_warrior");
    if (goServings >= state.people && entries.length > 0) earnedNow.push("busog_master");

    newlyUnlockedIds = [];
    earnedNow.forEach(function (bId) {
      if (!state.unlockedBadges.includes(bId)) {
        state.unlockedBadges.push(bId);
        newlyUnlockedIds.push(bId);
      }
    });

    if (newlyUnlockedIds.length > 0) {
      saveState();
    }

    return {
      entries: entries,
      totalCost: totalCost,
      budgetPerPerson: state.budget / Math.max(1, state.people),
      costPerPerson: totalCost / Math.max(1, state.people),
      goCount: goCount,
      growCount: growCount,
      glowCount: glowCount,
      goServings: goServings,
      hasProtein: hasProtein,
      hasVegOrFruit: hasVegOrFruit,
      underBudget: underBudget,
      isBalanced: isBalanced,
      flaggedItems: flaggedItems,
      score: score
    };
  }

  // ==========================================================================
  // SMART BUDGET-AWARE AUTO-SUGGESTION (Handles ₱150 / 5 pax / Hypertension)
  // ==========================================================================

  function suggestBalancedMeal() {
    const needsLowSodium = state.condition === "hypertension" || state.condition === "both";
    const needsLowSugar = state.condition === "diabetes" || state.condition === "both";

    function isSafe(item) {
      if (needsLowSodium && item.tags.includes("highSodium")) return false;
      if (needsLowSugar && item.tags.includes("highSugar")) return false;
      return true;
    }

    // Pick best rice/carb portion for people count & budget
    const bigasFull = getFoodById("bigas");
    const bigasHalf = getFoodById("bigas_half");
    const newBasket = {};
    let remaining = state.budget;

    if (state.people >= 5 && remaining >= 110) {
      newBasket[bigasFull.id] = 1;
      remaining -= bigasFull.price;
    } else if (remaining >= bigasHalf.price) {
      newBasket[bigasHalf.id] = 1;
      remaining -= bigasHalf.price;
    }

    // Pick safe, affordable Grow (protein)
    const growCandidates = DATA.FOODS.filter(function (f) {
      return f.group === "grow" && isSafe(f) && f.price <= remaining;
    }).sort(function (a, b) { return a.price - b.price; });

    if (growCandidates.length > 0) {
      // Prefer munggo or itlog for great family servings
      const preferredGrow = growCandidates.find(function (f) { return f.id === "munggo" || f.id === "itlog"; }) || growCandidates[0];
      newBasket[preferredGrow.id] = 1;
      remaining -= preferredGrow.price;
    }

    // Pick safe, affordable Glow (vegetables/fruits) — aim for 2 items if budget allows
    const glowCandidates = DATA.FOODS.filter(function (f) {
      return f.group === "glow" && isSafe(f) && f.price <= remaining;
    }).sort(function (a, b) { return a.price - b.price; });

    if (glowCandidates.length > 0) {
      newBasket[glowCandidates[0].id] = 1;
      remaining -= glowCandidates[0].price;
    }
    if (glowCandidates.length > 1 && remaining >= glowCandidates[1].price + 15) {
      newBasket[glowCandidates[1].id] = 1;
      remaining -= glowCandidates[1].price;
    }

    // Add clean water if budget fits
    const tubig = getFoodById("tubig");
    if (tubig && remaining >= tubig.price) {
      newBasket[tubig.id] = 1;
      remaining -= tubig.price;
    }

    state.basket = newBasket;
    saveState();
    renderAll();
  }

  // ==========================================================================
  // VIEW ROUTING & I18N (ADULT / BATA MODE)
  // ==========================================================================

  function goToStep(stepName) {
    state.step = stepName;
    saveState();

    document.querySelectorAll(".view").forEach(function (v) {
      v.classList.remove("active");
    });
    const targetView = document.getElementById("view-" + stepName);
    if (targetView) targetView.classList.add("active");

    document.querySelectorAll(".step-nav .tab").forEach(function (tab) {
      const isMatch = tab.dataset.step === stepName;
      tab.classList.toggle("active", isMatch);
      if (isMatch) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    const liveBar = document.getElementById("live-status-bar");
    if (stepName === "welcome" || stepName === "resibo") {
      liveBar.classList.add("hidden");
    } else {
      liveBar.classList.remove("hidden");
    }

    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyBataMode() {
    document.documentElement.classList.toggle("bata-mode", state.bataMode);
    const toggleBtn = document.getElementById("bata-mode-btn");
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(state.bataMode));
      toggleBtn.querySelector(".bata-label").textContent = state.bataMode ? "Bata Mode: ON" : "Bata Mode: OFF";
    }

    const dict = state.bataMode ? DATA.I18N.bata : DATA.I18N.adult;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  // ==========================================================================
  // RENDER FUNCTIONS
  // ==========================================================================

  function renderBadges(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = DATA.BADGES.map(function (b) {
      const unlocked = state.unlockedBadges.includes(b.id);
      const justUnlocked = newlyUnlockedIds.includes(b.id);
      return `
        <div class="badge ${unlocked ? "unlocked" : ""} ${justUnlocked ? "just-unlocked" : ""}" tabindex="0">
          <span class="badge-emoji" aria-hidden="true">${unlocked ? b.emoji : "🔒"}</span>
          <span class="badge-name">${b.name}</span>
          <span class="badge-desc">${b.desc}</span>
        </div>
      `;
    }).join("");
  }

  function renderLiveMeters(metrics) {
    const spentEl = document.getElementById("live-spent");
    const budgetEl = document.getElementById("live-budget");
    const fillEl = document.getElementById("budget-fill");
    const trackEl = document.getElementById("budget-track");
    const busogEl = document.getElementById("live-busog");

    spentEl.textContent = `₱${metrics.totalCost}`;
    budgetEl.textContent = `₱${state.budget}`;

    const ratio = state.budget > 0 ? metrics.totalCost / state.budget : 1;
    const remainingPct = Math.max(0, Math.min(100, (1 - ratio) * 100));

    fillEl.classList.remove("warn", "over");
    trackEl.classList.remove("shake");

    if (metrics.totalCost > state.budget) {
      fillEl.style.width = "100%";
      fillEl.classList.add("over");
      void trackEl.offsetWidth;
      trackEl.classList.add("shake");
    } else {
      fillEl.style.width = `${remainingPct}%`;
      if (ratio >= 0.9) {
        fillEl.classList.add("warn");
      }
    }

    trackEl.setAttribute("aria-valuenow", String(Math.round(remainingPct)));
    busogEl.textContent = `${metrics.goServings} / ${state.people} tao`;
  }

  function renderSetupControls() {
    document.getElementById("budget-slider").value = String(state.budget);
    document.getElementById("budget-number").value = String(state.budget);
    document.getElementById("people-count").textContent = String(state.people);

    const perPerson = (state.budget / Math.max(1, state.people)).toFixed(2);
    document.getElementById("per-person-hint").textContent = `(₱${perPerson} bawat isa)`;

    document.querySelectorAll("#meal-chips .chip").forEach(function (btn) {
      const active = btn.dataset.meal === state.meal;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-checked", String(active));
    });

    document.querySelectorAll("#condition-chips .chip").forEach(function (btn) {
      const active = btn.dataset.cond === state.condition;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function renderFoodGrid() {
    const grid = document.getElementById("food-grid");
    if (!grid) return;

    const dict = state.bataMode ? DATA.I18N.bata : DATA.I18N.adult;
    const filtered = DATA.FOODS.filter(function (item) {
      return state.category === "all" || item.group === state.category;
    });

    grid.innerHTML = filtered.map(function (item, index) {
      const displayName = state.bataMode ? item.kidName : item.name;
      const inBasketQty = state.basket[item.id] || 0;
      return `
        <button type="button" class="food-card" data-food-id="${item.id}" style="animation-delay: ${index * 60}ms;" aria-label="Idagdag ang ${displayName}, ₱${item.price}">
          <div class="food-card-top">
            <span class="food-emoji" aria-hidden="true">${item.emoji}</span>
            <span class="group-pill group-${item.group}">${dict.groupLabels[item.group]}</span>
          </div>
          <div>
            <div class="food-name">${displayName}</div>
            <div class="food-meta">${item.unit} • ${item.servings} serving</div>
          </div>
          <div class="food-card-bottom">
            <span class="food-price tabular">₱${item.price}</span>
            <span class="food-add-badge">${inBasketQty > 0 ? `✓ ${inBasketQty} sa bayong` : "+ Idagdag"}</span>
          </div>
        </button>
      `;
    }).join("");
  }

  function renderBasketSidebar(metrics) {
    const listEl = document.getElementById("basket-list");
    const countEl = document.getElementById("basket-item-count");
    const totalEl = document.getElementById("basket-total");

    const totalItems = metrics.entries.reduce(function (sum, e) { return sum + e.qty; }, 0);
    countEl.textContent = `${totalItems} item`;
    totalEl.textContent = `₱${metrics.totalCost.toFixed(2)}`;

    document.getElementById("dot-go").classList.toggle("filled", metrics.goCount >= 1);
    document.getElementById("dot-grow").classList.toggle("filled", metrics.growCount >= 1);
    document.getElementById("dot-glow").classList.toggle("filled", metrics.glowCount >= 1);

    if (metrics.entries.length === 0) {
      const dict = state.bataMode ? DATA.I18N.bata : DATA.I18N.adult;
      listEl.innerHTML = `<li class="empty-basket-msg">${dict.emptyBasket}</li>`;
      return;
    }

    listEl.innerHTML = metrics.entries.map(function (entry) {
      const name = state.bataMode ? entry.food.kidName : entry.food.name;
      return `
        <li class="basket-item">
          <div class="basket-item-info">
            <span aria-hidden="true">${entry.food.emoji}</span>
            <span class="basket-item-name" title="${name}">${name}</span>
          </div>
          <div class="basket-item-right">
            <div class="qty-controls">
              <button type="button" class="qty-btn" data-action="dec" data-id="${entry.food.id}" aria-label="Bawasan ang ${name}">−</button>
              <span class="tabular"><strong>${entry.qty}</strong></span>
              <button type="button" class="qty-btn" data-action="inc" data-id="${entry.food.id}" aria-label="Dagdagan ang ${name}">+</button>
            </div>
            <span class="tabular">₱${entry.food.price * entry.qty}</span>
            <button type="button" class="remove-btn" data-action="rem" data-id="${entry.food.id}" aria-label="Alisin ang ${name}">×</button>
          </div>
        </li>
      `;
    }).join("");
  }

  function renderPlateScreen(metrics) {
    // 1. SVG Segment Fills
    const segGo = document.getElementById("seg-go");
    const segGrow = document.getElementById("seg-grow");
    const segGlow = document.getElementById("seg-glow");

    segGo.setAttribute("fill", metrics.goCount >= 1 ? "#E8B84B" : "#F5EEDB");
    segGrow.setAttribute("fill", metrics.growCount >= 1 ? "#D97B90" : "#F5E4E8");
    segGlow.setAttribute("fill", metrics.glowCount >= 1 ? "#6FA34A" : "#E6ECE2");

    document.getElementById("svg-go-count").textContent = `${metrics.goCount} item`;
    document.getElementById("svg-grow-count").textContent = `${metrics.growCount} item`;
    document.getElementById("svg-glow-count").textContent = `${metrics.glowCount} item`;

    // 2. Mascot Mood & Comment
    let mood = "idle";
    let comment = "Magdagdag tayo ng Go, Grow, at Glow para maging masaya ang pinggan!";

    if (metrics.flaggedItems.length > 0) {
      mood = "worried";
      comment = "Naku, may medyo maalat o matamis para sa kondisyon ng pamilya. Tingnan ang puwedeng ipalit sa ibaba!";
    } else if (!metrics.hasProtein && metrics.entries.length > 0) {
      mood = "sleepy";
      comment = "Inaantok pa si Ping — kulang pa tayo ng Grow (protina) tulad ng itlog, munggo, o tokwa!";
    } else if (metrics.isBalanced) {
      mood = "happy";
      comment = "Yehey! Balanse ang Pinggang Pinoy mo at pasok sa badyet! Ang galing!";
    }

    document.getElementById("plate-mascot-slot").innerHTML = UI.getMascotSVG(mood);
    document.getElementById("plate-mascot-comment").textContent = comment;

    // 3. Group Breakdown Cards
    const breakdownEl = document.getElementById("plate-group-lists");
    const groups = [
      { key: "go", title: "🍚 Go (Lakas)" },
      { key: "grow", title: "🐟 Grow (Protina)" },
      { key: "glow", title: "🥬 Glow (Gulay/Prutas)" }
    ];

    breakdownEl.innerHTML = groups.map(function (g) {
      const items = metrics.entries.filter(function (e) { return e.food.group === g.key; });
      const listHtml = items.length > 0
        ? `<ul>${items.map(function (e) { return `<li>${e.food.emoji} ${state.bataMode ? e.food.kidName : e.food.name} (${e.qty})</li>`; }).join("")}</ul>`
        : `<p class="sub-text" style="margin:0;">Wala pa</p>`;
      return `<div class="group-box"><h4>${g.title}</h4>${listHtml}</div>`;
    }).join("");

    // 4. Animated Score Gauge
    if (state.step === "plate") {
      UI.animateScoreGauge(metrics.score);
    }
    const verdictEl = document.getElementById("score-verdict");
    if (metrics.score >= 85) {
      verdictEl.textContent = "🌟 Napakagaling! Balanse at ligtas para sa pamilya.";
    } else if (metrics.score >= 55) {
      verdictEl.textContent = "👍 Magandang simula! Puwede pang dagdagan o i-adjust.";
    } else {
      verdictEl.textContent = "💡 Kumpletuhin ang Go, Grow, at Glow sa tindahan.";
    }

    // 5. Gentle Hints (never scolding)
    const hintsEl = document.getElementById("hints-container");
    const hints = [];

    if (!metrics.underBudget) {
      hints.push({
        type: "warn",
        text: `Lumampas nang ₱${metrics.totalCost - state.budget} sa badyet. Puwedeng magbawas ng isang item para sakto sa pera.`
      });
    }
    if (metrics.goCount === 0) {
      hints.push({ type: "warn", text: "Puwedeng magdagdag ng Bigas, Pandesal, o Kamote para sa lakas (Go)." });
    }
    if (!metrics.hasProtein) {
      hints.push({ type: "warn", text: "Kulang pa ng Grow (protina) — subukan ang Itlog (₱27), Tokwa (₱20), o Munggo (₱25)." });
    }
    if (!metrics.hasVegOrFruit) {
      hints.push({ type: "warn", text: "Walang laman ang Glow (½ ng pinggan) — magdagdag ng Kangkong, Pechay, Malunggay, o Saging!" });
    }
    if (metrics.goServings < state.people && metrics.entries.length > 0) {
      hints.push({
        type: "warn",
        text: `Busog Meter: Pang-${metrics.goServings} katao pa lang ang kanin/Go para sa ${state.people} na kakain.`
      });
    }
    if (hints.length === 0 && metrics.entries.length > 0) {
      hints.push({ type: "good", text: "Kumpleto ang tatlong bahagi ng Pinggang Pinoy at pasok sa badyet!" });
    }

    hintsEl.innerHTML = hints.map(function (h) {
      return `<div class="hint-item ${h.type === "good" ? "good" : ""}">${h.text}</div>`;
    }).join("");

    // 6. Condition Swap Cards
    const swapsEl = document.getElementById("swaps-container");
    swapsEl.innerHTML = metrics.flaggedItems.map(function (flag) {
      const swap = flag.swapFood;
      const swapBtnHtml = swap
        ? `<button type="button" class="btn-primary btn-sm swap-apply-btn" data-old-id="${flag.food.id}" data-new-id="${swap.id}">
             Palitan ng ${swap.emoji} ${state.bataMode ? swap.kidName : swap.name} (₱${swap.price})
           </button>`
        : `<span>Puwedeng bawasan ang dami nito.</span>`;

      return `
        <div class="swap-card" tabindex="0">
          <div class="swap-reason">⚠️ ${flag.reason}</div>
          <div class="swap-action-row">
            <span>Puwedeng palitan ito ng mas ligtas na opsyon:</span>
            ${swapBtnHtml}
          </div>
        </div>
      `;
    }).join("");

    // Confetti trigger when balanced plate is achieved or new badge unlocks
    if (state.step === "plate" && (newlyUnlockedIds.length > 0 || (metrics.isBalanced && !state.celebratedBalanced))) {
      if (metrics.isBalanced) {
        state.celebratedBalanced = true;
        saveState();
      }
      UI.launchConfetti();
    }
  }

  function renderResibo(metrics) {
    const condLabels = {
      none: "Wala",
      hypertension: "Altapresyon",
      diabetes: "Diabetes",
      both: "Altapresyon at Diabetes"
    };

    document.getElementById("resibo-meta").textContent =
      `${state.meal} • ${state.people} Katao • Kondisyon: ${condLabels[state.condition]}`;
    document.getElementById("res-total").textContent = `₱${metrics.totalCost.toFixed(2)}`;
    document.getElementById("res-per-person").textContent = `₱${metrics.costPerPerson.toFixed(2)}`;
    document.getElementById("res-score").textContent = `${metrics.score} / 100`;

    const dict = state.bataMode ? DATA.I18N.bata : DATA.I18N.adult;
    const tbody = document.getElementById("resibo-tbody");

    if (metrics.entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Walang nakalistang pagkain.</td></tr>`;
    } else {
      tbody.innerHTML = metrics.entries.map(function (e) {
        const name = state.bataMode ? e.food.kidName : e.food.name;
        return `
          <tr>
            <td>${e.food.emoji} ${name}</td>
            <td>${dict.groupLabels[e.food.group]}</td>
            <td class="num-col">${e.qty}</td>
            <td class="num-col">₱${(e.food.price * e.qty).toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }

    renderBadges("resibo-badges");
  }

  function renderAll() {
    applyBataMode();
    const metrics = evaluateMeal();

    // Welcome Mascot & Trophy Shelf
    const welcomeSlot = document.getElementById("welcome-mascot-slot");
    if (welcomeSlot && !welcomeSlot.innerHTML.trim()) {
      welcomeSlot.innerHTML = UI.getMascotSVG("idle");
    }
    renderBadges("welcome-badges");

    renderLiveMeters(metrics);
    renderSetupControls();
    renderFoodGrid();
    renderBasketSidebar(metrics);
    renderPlateScreen(metrics);
    renderResibo(metrics);
  }

  // ==========================================================================
  // BLOB DOWNLOAD EXPORT (.TXT & .CSV — ZERO NETWORK)
  // ==========================================================================

  function downloadReceipt(format) {
    const metrics = evaluateMeal();
    let content = "";
    let mime = "text/plain;charset=utf-8";
    let filename = `pinggang-pinoy-resibo.${format}`;

    if (format === "csv") {
      mime = "text/csv;charset=utf-8";
      const rows = [
        ["Pagkain", "Grupo", "Dami", "Presyo_Bawat_Isa", "Kabuuan"],
        ...metrics.entries.map(function (e) {
          return [
            `"${e.food.name}"`,
            e.food.group.toUpperCase(),
            e.qty,
            e.food.price,
            e.food.price * e.qty
          ];
        }),
        [],
        ["Kabuuang Gastos", metrics.totalCost],
        ["Badyet", state.budget],
        ["Bilang ng Tao", state.people],
        ["Gastos Bawat Tao", metrics.costPerPerson.toFixed(2)],
        ["Marka ng Balanse", `${metrics.score}/100`]
      ];
      content = rows.map(function (r) { return r.join(","); }).join("\n");
    } else {
      const lines = [
        "==========================================",
        "       PINGGANG PINOY SA TINDAHAN",
        "==========================================",
        `Kainan: ${state.meal}`,
        `Bilang ng Kakain: ${state.people} katao`,
        `Badyet: PHP ${state.budget.toFixed(2)}`,
        `Kabuuang Gastos: PHP ${metrics.totalCost.toFixed(2)}`,
        `Gastos Bawat Tao: PHP ${metrics.costPerPerson.toFixed(2)}`,
        `Marka ng Balanse: ${metrics.score} / 100`,
        "------------------------------------------",
        "MGA BIBILHIN SA TINDAHAN:"
      ];
      metrics.entries.forEach(function (e) {
        lines.push(`- ${e.food.name} x${e.qty} = PHP ${(e.food.price * e.qty).toFixed(2)}`);
      });
      lines.push("==========================================");
      content = lines.join("\n");
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  function bindEvents() {
    // Top step tabs
    document.querySelectorAll(".step-nav .tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        goToStep(tab.dataset.step);
      });
    });

    // Bata Mode toggle
    document.getElementById("bata-mode-btn").addEventListener("click", function () {
      state.bataMode = !state.bataMode;
      saveState();
      renderAll();
    });

    // Reset with confirmation
    document.getElementById("reset-btn").addEventListener("click", function () {
      if (window.confirm("Sigurado ka bang gusto mong burahin ang kasalukuyang plano at magsimula muli?")) {
        const keepBadges = state.unlockedBadges;
        state = Object.assign({}, defaultState, { unlockedBadges: keepBadges });
        saveState();
        goToStep("welcome");
      }
    });

    // Welcome -> Setup
    document.getElementById("start-btn").addEventListener("click", function () {
      goToStep("setup");
    });

    // Budget slider & number sync
    const slider = document.getElementById("budget-slider");
    const numInput = document.getElementById("budget-number");

    slider.addEventListener("input", function () {
      state.budget = Math.max(10, Number(slider.value) || 150);
      saveState();
      renderAll();
    });

    numInput.addEventListener("input", function () {
      state.budget = Math.max(10, Number(numInput.value) || 10);
      saveState();
      renderAll();
    });

    document.querySelectorAll(".preset-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.budget = Number(chip.dataset.budget);
        saveState();
        renderAll();
      });
    });

    // People stepper
    document.getElementById("people-minus").addEventListener("click", function () {
      state.people = Math.max(1, state.people - 1);
      saveState();
      renderAll();
    });

    document.getElementById("people-plus").addEventListener("click", function () {
      state.people = Math.min(25, state.people + 1);
      saveState();
      renderAll();
    });

    // Meal chips
    document.querySelectorAll("#meal-chips .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.meal = chip.dataset.meal;
        saveState();
        renderAll();
      });
    });

    // Condition chips
    document.querySelectorAll("#condition-chips .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.condition = chip.dataset.cond;
        saveState();
        renderAll();
      });
    });

    // Setup -> Tindahan
    document.getElementById("to-tindahan-btn").addEventListener("click", function () {
      goToStep("tindahan");
    });

    // Auto-suggest balanced meal
    document.getElementById("auto-suggest-btn").addEventListener("click", function () {
      suggestBalancedMeal();
    });

    // Category filter tabs
    document.querySelectorAll(".cat-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.category = tab.dataset.cat;
        document.querySelectorAll(".cat-tab").forEach(function (t) {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", String(active));
        });
        renderFoodGrid();
      });
    });

    // Add food card to basket (event delegation)
    document.getElementById("food-grid").addEventListener("click", function (e) {
      const card = e.target.closest(".food-card");
      if (!card) return;
      const foodId = card.dataset.foodId;
      const food = getFoodById(foodId);
      if (!food) return;

      state.basket[foodId] = (state.basket[foodId] || 0) + 1;
      saveState();
      UI.flyEmojiToBasket(card, food.emoji);
      renderAll();
    });

    // Basket item quantity & remove controls
    document.getElementById("basket-list").addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === "inc") {
        state.basket[id] = (state.basket[id] || 0) + 1;
      } else if (action === "dec") {
        if ((state.basket[id] || 0) > 1) {
          state.basket[id] -= 1;
        } else {
          delete state.basket[id];
        }
      } else if (action === "rem") {
        delete state.basket[id];
      }

      saveState();
      renderAll();
    });

    // Tindahan -> Plate
    document.getElementById("to-plate-btn").addEventListener("click", function () {
      goToStep("plate");
    });

    // Swap card one-click replacement
    document.getElementById("swaps-container").addEventListener("click", function (e) {
      const btn = e.target.closest(".swap-apply-btn");
      if (!btn) return;
      const oldId = btn.dataset.oldId;
      const newId = btn.dataset.newId;
      const qty = state.basket[oldId] || 1;

      delete state.basket[oldId];
      state.basket[newId] = (state.basket[newId] || 0) + qty;
      saveState();
      renderAll();
    });

    // Plate navigation buttons
    document.getElementById("back-to-store-btn").addEventListener("click", function () {
      goToStep("tindahan");
    });

    document.getElementById("to-resibo-btn").addEventListener("click", function () {
      goToStep("resibo");
    });

    // Resibo actions
    document.getElementById("print-btn").addEventListener("click", function () {
      window.print();
    });

    document.getElementById("download-txt-btn").addEventListener("click", function () {
      downloadReceipt("txt");
    });

    document.getElementById("download-csv-btn").addEventListener("click", function () {
      downloadReceipt("csv");
    });

    document.getElementById("new-plan-btn").addEventListener("click", function () {
      state.basket = {};
      state.celebratedBalanced = false;
      saveState();
      goToStep("setup");
    });
  }

  // Register Service Worker safely (works under HTTP/HTTPS, ignores file:// restriction)
  function registerServiceWorker() {
    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(function () {
        // Silent fallback when offline or restricted
      });
    }
  }

  // Initialize App
  document.addEventListener("DOMContentLoaded", function () {
    bindEvents();
    goToStep(state.step || "welcome");
    registerServiceWorker();
  });
})();
