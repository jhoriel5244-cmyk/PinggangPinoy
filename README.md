# Pinggang Pinoy sa Tindahan 🍽️

An offline-first, kid-friendly, budget-aware **sari-sari store meal builder** built with pure HTML5, CSS3, and vanilla JavaScript. Designed for Filipino households and Barangay Nutrition Scholars (BNS) to plan balanced **Go, Grow, and Glow** meals directly inside a neighborhood store—with zero internet connection required.

## File Structure

```text
/
├── index.html        # Single-page 5-step app shell & SVG Pinggang Pinoy plate
├── css/
│   └── styles.css    # Burgundy & gold design tokens, animations, responsive & print styles
├── js/
│   ├── data.js       # 32 sari-sari store items, badges, condition rules & Bata Mode copy
│   ├── ui.js         # Mascot "Ping" SVG, flying emoji animation, score gauge & confetti
│   └── app.js        # State management, scoring engine, swap logic & receipt export
├── manifest.json     # Installable PWA manifest with inline SVG icons
├── sw.js             # Cache-first Service Worker for airplane-mode offline support
└── README.md         # Setup and deployment instructions# PinggangPinoy
