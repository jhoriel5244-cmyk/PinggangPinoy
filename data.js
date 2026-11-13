/* ==========================================================================
   PINGGANG PINOY SA TINDAHAN — FOOD CATALOG, BADGES & COPY DICTIONARY
   32 authentic sari-sari store items with 2024-2025 Philippine retail prices
   ========================================================================== */

window.PINGGANG_DATA = (function () {
  "use strict";

  const FOODS = [
    // ==================== GO (ENERGY / CARBS) ====================
    {
      id: "bigas",
      name: "Bigas (1 kilo)",
      kidName: "Kanin / Bigas",
      emoji: "🍚",
      group: "go",
      price: 52,
      unit: "1 kg (~7 tasa)",
      servings: 7,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Pampalakas ng katawan para sa buong pamilya!"
    },
    {
      id: "bigas_half",
      name: "Bigas (Kalahating kilo)",
      kidName: "Kaunting Bigas",
      emoji: "🍚",
      group: "go",
      price: 26,
      unit: "½ kg (~3.5 tasa)",
      servings: 4,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Sakto para sa 3 hanggang 4 na tao."
    },
    {
      id: "pandesal",
      name: "Pandesal (10 piraso)",
      kidName: "Pandesal",
      emoji: "🥖",
      group: "go",
      price: 25,
      unit: "10 pcs",
      servings: 5,
      tags: ["lowCost"],
      swapFor: null,
      kidNote: "Masarap sa almusal at merienda!"
    },
    {
      id: "kamote",
      name: "Kamote (Nilaga / Hilaw)",
      kidName: "Kamote",
      emoji: "🍠",
      group: "go",
      price: 20,
      unit: "½ kg",
      servings: 4,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Masustansyang pampalakas na may hibla!"
    },
    {
      id: "saba",
      name: "Saging na Saba (6 piraso)",
      kidName: "Saging na Saba",
      emoji: "🍌",
      group: "go",
      price: 24,
      unit: "6 pcs",
      servings: 4,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Puwedeng ilaga para sa masustansyang miryenda."
    },
    {
      id: "instant_noodles",
      name: "Instant Noodles (1 pack)",
      kidName: "Instant Noodles",
      emoji: "🍜",
      group: "go",
      price: 12,
      unit: "1 pack",
      servings: 2,
      tags: ["highSodium", "lowCost"],
      swapFor: "bihon",
      kidNote: "Maalat ang sabaw nito — konti lang ang pampalasa."
    },
    {
      id: "bihon",
      name: "Pancit Bihon (1 balot)",
      kidName: "Pancit Bihon",
      emoji: "🍝",
      group: "go",
      price: 22,
      unit: "200g pack",
      servings: 4,
      tags: ["lowCost"],
      swapFor: null,
      kidNote: "Mas mainam kaysa instant noodles kapag nilahukan ng gulay!"
    },
    {
      id: "oats",
      name: "Instant Oatmeal (1 sachet)",
      kidName: "Oatmeal",
      emoji: "🥣",
      group: "go",
      price: 15,
      unit: "1 sachet",
      servings: 1,
      tags: ["goodFiber"],
      swapFor: null,
      kidNote: "Mabuti sa puso at tiyan!"
    },

    // ==================== GROW (PROTEIN) ====================
    {
      id: "itlog",
      name: "Itlog ng Manok (3 piraso)",
      kidName: "Itlog",
      emoji: "🥚",
      group: "grow",
      price: 27,
      unit: "3 pcs (₱9 each)",
      servings: 3,
      tags: ["goodProtein", "lowCost"],
      swapFor: null,
      kidNote: "Murang protina na pampatangkad at pampalakas ng masel!"
    },
    {
      id: "munggo",
      name: "Munggo (1 takal / 250g)",
      kidName: "Munggo",
      emoji: "🫘",
      group: "grow",
      price: 25,
      unit: "250g pack",
      servings: 5,
      tags: ["goodProtein", "goodFiber", "iron", "lowCost"],
      swapFor: null,
      kidNote: "Super-pagkain! Maraming protina at mura pa."
    },
    {
      id: "tofu",
      name: "Tokwa / Tofu (2 bloke)",
      kidName: "Tokwa",
      emoji: "🧊",
      group: "grow",
      price: 20,
      unit: "2 blocks",
      servings: 4,
      tags: ["goodProtein", "lowCost"],
      swapFor: null,
      kidNote: "Walang taba at puno ng protina!"
    },
    {
      id: "sardinas",
      name: "Sardinas (1 lata)",
      kidName: "Sardinas",
      emoji: "🐟",
      group: "grow",
      price: 26,
      unit: "155g can",
      servings: 3,
      tags: ["highSodium", "goodProtein", "iron"],
      swapFor: "munggo",
      kidNote: "May protina, pero maalat ang sarsa kaya haluan ng gulay."
    },
    {
      id: "tuyo",
      name: "Tuyo / Daing (1 balot)",
      kidName: "Tuyo",
      emoji: "🐠",
      group: "grow",
      price: 20,
      unit: "1 small pack",
      servings: 3,
      tags: ["highSodium", "goodProtein"],
      swapFor: "itlog",
      kidNote: "Sobrang alat ng tuyo — kapiraso lang o palitan ng itlog."
    },
    {
      id: "dilis",
      name: "Dilis (1 takal)",
      kidName: "Dilis",
      emoji: "🐟",
      group: "grow",
      price: 18,
      unit: "1 small pack",
      servings: 3,
      tags: ["highSodium", "goodProtein"],
      swapFor: "tofu",
      kidNote: "May calcium para sa buto, pero maasin kaya kaunti lang."
    },
    {
      id: "corned_beef",
      name: "Corned Beef (1 maliit na lata)",
      kidName: "Corned Beef",
      emoji: "🥫",
      group: "grow",
      price: 38,
      unit: "150g can",
      servings: 3,
      tags: ["highSodium", "highFat", "goodProtein"],
      swapFor: "itlog",
      kidNote: "Maalat at mamantika — mas mabuti ang itlog o tokwa."
    },
    {
      id: "tuna_can",
      name: "Tuna Flakes in Water (1 lata)",
      kidName: "Tuna",
      emoji: "🐟",
      group: "grow",
      price: 34,
      unit: "155g can",
      servings: 3,
      tags: ["goodProtein"],
      swapFor: null,
      kidNote: "Mas kaunti ang mantika kaysa ibang de-lata!"
    },
    {
      id: "mani",
      name: "Nilagang Mani (1 balot)",
      kidName: "Nilagang Mani",
      emoji: "🥜",
      group: "grow",
      price: 15,
      unit: "1 pouch",
      servings: 2,
      tags: ["goodProtein", "goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Masustansyang kutkutin na may protina!"
    },

    // ==================== GLOW (VEGETABLES & FRUITS) ====================
    {
      id: "kangkong",
      name: "Kangkong (1 tali)",
      kidName: "Kangkong",
      emoji: "🥬",
      group: "glow",
      price: 15,
      unit: "1 tali",
      servings: 4,
      tags: ["goodFiber", "iron", "lowCost"],
      swapFor: null,
      kidNote: "Pampalinaw ng mata at pampalakas ng dugo!"
    },
    {
      id: "pechay",
      name: "Pechay Tagalog (1 tali)",
      kidName: "Pechay",
      emoji: "🥬",
      group: "glow",
      price: 18,
      unit: "1 tali",
      servings: 4,
      tags: ["goodFiber", "iron", "lowCost"],
      swapFor: null,
      kidNote: "Masarap isahog sa sardinas, itlog, o sabaw!"
    },
    {
      id: "kalabasa",
      name: "Kalabasa (1 hiwa)",
      kidName: "Kalabasa",
      emoji: "🎃",
      group: "glow",
      price: 20,
      unit: "1 slice (~300g)",
      servings: 4,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Puno ng Vitamin A para sa malinaw na mata!"
    },
    {
      id: "kamatis",
      name: "Kamatis (4 piraso)",
      kidName: "Kamatis",
      emoji: "🍅",
      group: "glow",
      price: 15,
      unit: "4 pcs",
      servings: 4,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "May Vitamin C para hindi madaling magkasakit!"
    },
    {
      id: "talong",
      name: "Talong (3 piraso)",
      kidName: "Talong",
      emoji: "🍆",
      group: "glow",
      price: 20,
      unit: "3 pcs",
      servings: 3,
      tags: ["goodFiber", "lowCost"],
      swapFor: null,
      kidNote: "Masarap gawing tortang talong kasama ng itlog!"
    },
    {
      id: "malunggay",
      name: "Malunggay (1 tali)",
      kidName: "Malunggay",
      emoji: "🌿",
      group: "glow",
      price: 10,
      unit: "1 tali",
      servings: 5,
      tags: ["goodFiber", "iron", "lowCost"],
      swapFor: null,
      kidNote: "Pinakamasustansyang dahon sa bakuran at tindahan!"
    },
    {
      id: "saging_lakatan",
      name: "Saging na Lakatan (4 piraso)",
      kidName: "Saging",
      emoji: "🍌",
      group: "glow",
      price: 28,
      unit: "4 pcs",
      servings: 4,
      tags: ["goodFiber"],
      swapFor: null,
      kidNote: "Matamis na prutas na pampalakas ng puso!"
    },
    {
      id: "mangga",
      name: "Manggang Hinog (2 piraso)",
      kidName: "Mangga",
      emoji: "🥭",
      group: "glow",
      price: 30,
      unit: "2 pcs",
      servings: 3,
      tags: ["goodFiber"],
      swapFor: null,
      kidNote: "Masarap na panghimagas na puno ng bitamina!"
    },

    // ==================== DRINKS ====================
    {
      id: "tubig",
      name: "Malinis na Tubig (1 litro)",
      kidName: "Tubig",
      emoji: "💧",
      group: "drink",
      price: 15,
      unit: "1L bottle",
      servings: 4,
      tags: ["lowCost"],
      swapFor: null,
      kidNote: "Pinakamabuting inumin! Walang asukal at nakakapawi ng uhaw."
    },
    {
      id: "buko_juice",
      name: "Sariwang Sabaw ng Buko (1 baso)",
      kidName: "Sabaw ng Buko",
      emoji: "🥥",
      group: "drink",
      price: 15,
      unit: "1 cup",
      servings: 1,
      tags: ["lowCost"],
      swapFor: null,
      kidNote: "Natural na pampalamig at pampalakas!"
    },
    {
      id: "softdrinks",
      name: "Softdrinks (1 bote / mismo)",
      kidName: "Softdrinks",
      emoji: "🥤",
      group: "drink",
      price: 18,
      unit: "295ml bottle",
      servings: 1,
      tags: ["highSugar"],
      swapFor: "tubig",
      kidNote: "Napakaraming asukal nito — mas okay ang tubig!"
    },
    {
      id: "coffee_3in1",
      name: "3-in-1 Coffee (2 sachet)",
      kidName: "3-in-1 Kape",
      emoji: "☕",
      group: "drink",
      price: 18,
      unit: "2 sachets",
      servings: 2,
      tags: ["highSugar"],
      swapFor: "tubig",
      kidNote: "Matamis ang 3-in-1 — hindi rin ito para sa mga bata."
    },
    {
      id: "powder_juice",
      name: "Powdered Juice (1 sachet)",
      kidName: "Juice sa Sachet",
      emoji: "🧃",
      group: "drink",
      price: 14,
      unit: "1 sachet (1L)",
      servings: 4,
      tags: ["highSugar"],
      swapFor: "tubig",
      kidNote: "May dagdag na asukal — tubig na lang para mas tipid at healthy!"
    },

    // ==================== SNACKS ====================
    {
      id: "biscuits",
      name: "SkyFlakes / Soda Crackers (3 packs)",
      kidName: "Crackers",
      emoji: "🍘",
      group: "snack",
      price: 24,
      unit: "3 single packs",
      servings: 3,
      tags: ["lowCost"],
      swapFor: null,
      kidNote: "Magandang pantawid-gutom kasama ng tubig o saging."
    },
    {
      id: "chichirya",
      name: "Chichirya / Chips (2 maliliit)",
      kidName: "Chichirya",
      emoji: "🍟",
      group: "snack",
      price: 16,
      unit: "2 small packs",
      servings: 2,
      tags: ["highSodium", "highFat"],
      swapFor: "mani",
      kidNote: "Sobrang alat ng chichirya — mas masarap at masustansya ang mani!"
    }
  ];

  // Kid-friendly Badges
  const BADGES = [
    {
      id: "veggie_hero",
      emoji: "🥦",
      name: "Veggie Hero",
      desc: "Naglagay ng 2 o higit pang gulay/prutas"
    },
    {
      id: "protein_pro",
      emoji: "💪",
      name: "Protein Pro",
      desc: "May pagkaing pampalakas (Grow)"
    },
    {
      id: "budget_boss",
      emoji: "🏅",
      name: "Budget Boss",
      desc: "Balanseng pinggan at pasok sa badyet"
    },
    {
      id: "water_warrior",
      emoji: "💧",
      name: "Water Warrior",
      desc: "Pinili ang tubig kaysa matamis na inumin"
    },
    {
      id: "busog_master",
      emoji: "🍚",
      name: "Busog Master",
      desc: "Sapat ang kanin/Go para sa buong pamilya"
    }
  ];

  // Condition explanations in gentle, plain Filipino
  const CONDITION_RULES = {
    hypertension: {
      flaggedTags: ["highSodium"],
      getReason: function (item, isBata) {
        if (isBata) {
          return `Medyo maalat ang ${item.kidName} — mas okay kung ipapalit natin sa mas kaunting asin.`;
        }
        return `Mataas sa asin (sodium) ang ${item.name} — maaaring makapagpataas ng presyon.`;
      }
    },
    diabetes: {
      flaggedTags: ["highSugar"],
      getReason: function (item, isBata) {
          if (isBata) {
            return `Matamis ang ${item.kidName} — palitan natin ng mas hindi matamis para malakas ang katawan.`;
          }
          return `Mataas sa asukal ang ${item.name} — nakakapagpataas ng blood sugar.`;
      }
    }
  };

  // Adult vs. Bata Mode Copy Dictionary
  const I18N = {
    adult: {
      resetBtn: "Ulitin",
      tab1: "Simula",
      tab2: "Badyet",
      tab3: "Tindahan",
      tab4: "Pinggan",
      tab5: "Resibo",
      budgetMeterLabel: "Natitirang Badyet:",
      busogLabel: "Busog Meter",
      welcomeTitle: "Kumusta! Ako si Kuya Ping! 👋",
      welcomeBody: "Tutulungan kitang pumili ng masustansya at abot-kayang ulam at kanin mula sa tindahan — sakto sa badyet at kalusugan ng pamilya!",
      startBtn: "Simulan",
      trophyTitle: "Mga Badge Mo",
      setupTitle: "Ihanda Natin ang Plano",
      setupSub: "Ilagay ang badyet at kung sino-sino ang kakain ngayon.",
      budgetLabel: "Magkano ang badyet sa tindahan? (₱)",
      peopleLabel: "Ilang tao ang kakain?",
      peopleUnit: "katao",
      mealLabel: "Anong kainan ito?",
      conditionLabel: "May binabantayan bang kondisyon sa pamilya?",
      goStoreBtn: "Pumunta sa Tindahan",
      storeTitle: "Mga Paninda sa Tindahan",
      storeSub: "Pindutin ang pagkain para ilagay sa iyong bayong.",
      autoSuggestBtn: "Tulungan Akong Pumili",
      basketTitle: "Iyong Bayong",
      emptyBasket: "Wala pang laman ang bayong. Pumili sa kaliwa!",
      totalLabel: "Kabuuan:",
      checkPlateBtn: "Tingnan ang Pinggan",
      plateTitle: "Ang Iyong Pinggang Pinoy",
      scoreTitle: "Marka ng Balanse",
      tipsTitle: "Payo ni Kuya Ping",
      addMoreBtn: "Magdagdag Pa",
      viewReceiptBtn: "Kunin ang Resibo",
      receiptTitle: "Listahan sa Tindahan (Resibo)",
      resTotalLabel: "Kabuuang Gastos",
      resPerPersonLabel: "Bawat Tao",
      resScoreLabel: "Marka",
      resListHeading: "Mga Bibilhin sa Tindahan",
      resBadgesHeading: "Nakamit na mga Badge",
      printBtn: "I-print",
      newPlanBtn: "Bagong Plano",
      groupLabels: {
        go: "Go (Enerhiya)",
        grow: "Grow (Protina)",
        glow: "Glow (Gulay/Prutas)",
        drink: "Inumin",
        snack: "Miryenda"
      }
    },
    bata: {
      resetBtn: "Ulit",
      tab1: "1. Hi!",
      tab2: "2. Barya",
      tab3: "3. Pili",
      tab4: "4. Pinggan",
      tab5: "5. Listahan",
      budgetMeterLabel: "Pera Mo:",
      busogLabel: "Ilang Busog?",
      welcomeTitle: "Hi Bata! Ako si Ping! 🍽️",
      welcomeBody: "Maglaro tayo! Pumili ng masarap at masustansyang pagkain sa tindahan para busog at malakas ang buong pamilya!",
      startBtn: "Tara Na!",
      trophyTitle: "Mga Tala at Badge Mo 🌟",
      setupTitle: "Ilang Barya at Sino Kakain?",
      setupSub: "Piliin ang pera at bilang ng kakain.",
      budgetLabel: "Magkano ang pera pambili? (₱)",
      peopleLabel: "Ilang tao ang kakain?",
      peopleUnit: "tao",
      mealLabel: "Anong oras kakain?",
      conditionLabel: "May bawal ba kay Lolo, Lola, Nanay, o Tatay?",
      goStoreBtn: "Punta sa Tindahan!",
      storeTitle: "Pumili ng Pagkain 🛒",
      storeSub: "I-tap ang pagkain para ilagay sa bayong!",
      autoSuggestBtn: "Piliin Mo Para Sa Akin ✨",
      basketTitle: "Bayong Ko",
      emptyBasket: "Walang laman! Pindot ka ng pagkain sa kaliwa!",
      totalLabel: "Bayad:",
      checkPlateBtn: "Tingnan ang Pinggan!",
      plateTitle: "Pinggan Natin! 🍽️",
      scoreTitle: "Puntos Mo!",
      tipsTitle: "Sabi ni Kuya Ping 💬",
      addMoreBtn: "Pili Pa",
      viewReceiptBtn: "Gawin ang Listahan!",
      receiptTitle: "Listahan Pambili 📝",
      resTotalLabel: "Lahat ng Bayad",
      resPerPersonLabel: "Bawat Isa",
      resScoreLabel: "Puntos",
      resListHeading: "Ibibigay kay Ate/Kuya sa Tindahan",
      resBadgesHeading: "Mga Napanalunan Mong Badge! 🏆",
      printBtn: "I-print",
      newPlanBtn: "Laro Ulit!",
      groupLabels: {
        go: "Pang-lakas (Go)",
        grow: "Pang-pagrow (Grow)",
        glow: "Pang-sigla (Glow)",
        drink: "Inumin",
        snack: "Kutkutin"
      }
    }
  };

  return {
    FOODS: FOODS,
    BADGES: BADGES,
    CONDITION_RULES: CONDITION_RULES,
    I18N: I18N
  };
})();
