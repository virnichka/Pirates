/**
 * 🎨 Gestion de l'interface et des textes (V2.4)
 * 
 * - Charge les accroches (titres, sous-titres, commentaires finaux)
 * - Gère le thème clair/sombre
 * - Fournit des utilitaires (shuffle, prénoms aléatoires)
 */

/* =======================================
   🔤 RÉCUPÉRATION DES TEXTES MULTILINGUES
   ======================================= */

// ⚙️ Initialisation à vide : évite le crash si TEXTS n'est pas encore prêt
let ACCROCHES = {};

// ⚠️ Log d'information (non bloquant)
if (typeof TEXTS === "undefined" || !TEXTS?.ui) {
  console.warn("[i18n] TEXTS non défini dans ui.js — vérifie le chargement depuis main.js");
}

/**
 * 🧩 Retourne un élément aléatoire dans une liste
 */
function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * 🎲 Mélange un tableau (utile pour les questions / réponses)
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * 👥 Récupère un ensemble de prénoms aléatoires (sauf le bon)
 */
function getRandomNames(exclude) {
  const noms = ["Thomas", "Simon", "Vladimir", "Alexis", "Ludovic", "Sacha", "Maxence", "Le zinc"];
  return noms.filter(n => n !== exclude).sort(() => Math.random() - 0.5).slice(0, 3);
}

/**
 * ======================================================
 *  🧠 getCommentaire(pourcentage)
 *  Renvoie la phrase finale selon le score ET le mode
 * ======================================================
 */
function getCommentaire(pourcentage) {
  const modeFromStorage = localStorage.getItem("selectedMode");
  const data = ACCROCHES || (typeof TEXTS !== "undefined" ? TEXTS.accroches : null);

  if (!data) {
    console.warn("⚠️ ACCROCHES non chargé ou inaccessible.");
    return "Fin du quiz — données indisponibles.";
  }

  const byMode = data?.modes?.[modeFromStorage]?.commentairesFin;
  const comments = byMode || data?.commentairesFin || {};

  const keys = Object.keys(comments);
  if (!keys.length) {
    console.warn("⚠️ Aucun commentaire de fin trouvé pour le mode:", modeFromStorage);
    return "Bravo pour avoir terminé le quiz !";
  }

  const niveaux = keys
    .map(k => parseInt(k, 10))
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => a - b);

  let palier = niveaux[0];
  for (let i = 0; i < niveaux.length; i++) {
    if (pourcentage >= niveaux[i]) palier = niveaux[i];
    else break;
  }

  const message = comments[palier] || "Bravo pour avoir terminé le quiz !";
  console.log(`💬 Mode: ${modeFromStorage} | Palier ${palier}% → ${message}`);
  return message;
}

/**
 * 🌗 Bascule entre le thème clair et sombre
 */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light");
  const btn = document.getElementById("toggleThemeBtn");

  // ⚙️ Ne pas planter si TEXTS n'est pas encore chargé
  if (typeof TEXTS !== "undefined" && TEXTS?.ui) {
    btn.innerText = isLight ? TEXTS.ui.toggleDark : TEXTS.ui.toggleLight;
  } else {
    btn.innerText = isLight ? "Basculer en thème sombre" : "Basculer en thème clair";
  }
}

/* =======================================
   🔁 Mise à jour dynamique de l'interface
   ======================================= */
function updateUITexts() {
  if (!TEXTS?.ui) return;
  const btn = document.getElementById("toggleThemeBtn");
  const isLight = document.body.classList.contains("light");
  btn.innerText = isLight ? TEXTS.ui.toggleDark : TEXTS.ui.toggleLight;
  console.log("[i18n] Textes UI mis à jour.");
}

/* =======================================
   ⏳ Attente du chargement de TEXTS
   ======================================= */
function waitForTexts() {
  if (typeof TEXTS !== "undefined" && TEXTS?.ui) {
    ACCROCHES = TEXTS.accroches || {};
    console.log("[i18n] TEXTS disponible, UI prête ✅");

    const btn = document.getElementById("toggleThemeBtn");
    if (btn) {
      const isLight = document.body.classList.contains("light");
      btn.innerText = isLight ? TEXTS.ui.toggleDark : TEXTS.ui.toggleLight;
    }
  } else {
    console.log("[i18n] TEXTS pas encore disponible, nouvelle tentative...");
    setTimeout(waitForTexts, 300);
  }
}

// 🚀 Lancement automatique
waitForTexts();

// ========================================
// 🌍 Sélecteur de langue dynamique
// ========================================
document.addEventListener("DOMContentLoaded", () => {

// Restaure la langue sauvegardée si elle existe
const savedLang = localStorage.getItem("lang");
if (savedLang) {
  langSelector.value = savedLang;
  window.currentLang = savedLang;
}

   
   const langSelector = document.getElementById("langSelector");
  if (!langSelector) return;

  // Sélection initiale basée sur la langue chargée
  if (typeof currentLang !== "undefined") {
    langSelector.value = currentLang;
  }

   
   // ========================================
// 🌍 Sélecteur de langue dynamique
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const langSelector = document.getElementById("langSelector");
  if (!langSelector) return;

  // 🔸 Restaure la langue sauvegardée si elle existe
  const savedLang = localStorage.getItem("lang");
  if (savedLang) {
    langSelector.value = savedLang;
    window.currentLang = savedLang;
  }

  // 🔹 Détecte le changement de langue
  langSelector.addEventListener("change", async (e) => {
    const newLang = e.target.value;
    console.log(`[i18n] Changement de langue demandé : ${newLang}`);

    // 💾 Sauvegarde la langue choisie
    localStorage.setItem("lang", newLang);

    try {
      const response = await fetch("./data/texts.json");
      const texts = await response.json();
      if (!texts[newLang]) {
        console.warn(`[i18n] Langue ${newLang} introuvable dans texts.json`);
        return;
      }

      // Met à jour la variable globale
      window.TEXTS = texts[newLang];
      window.currentLang = newLang;

      console.log(`[i18n] Langue changée en : ${newLang} ✅`);
      if (typeof updateUI === "function") updateUI();
    } catch (err) {
      console.error("[i18n] Erreur lors du changement de langue :", err);
    }
  });
}


/* =======================================
   🌍 BOUTON FUN DE CHANGEMENT DE LANGUE
   ======================================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("langBtn");
  if (!btn) return;

  // Liste des langues disponibles dans le bon ordre
  const langs = ["fr", "en", "es", "ro"];
  const flags = { fr: "🇫🇷", en: "🇬🇧", es: "🇪🇸", ro: "🇷🇴" };

  // Langue sauvegardée ou FR par défaut
  let currentLang = localStorage.getItem("lang") || "fr";
  window.currentLang = currentLang;
  btn.innerText = `${flags[currentLang]} ${currentLang.toUpperCase()}`;

  btn.addEventListener("click", async () => {
    // Passe à la langue suivante dans le tableau
    const nextIndex = (langs.indexOf(currentLang) + 1) % langs.length;
    const newLang = langs[nextIndex];
    console.log(`🏴‍☠️ Ahoy! Changement de langue : ${newLang}`);

    // 💾 Sauvegarde la langue choisie
    localStorage.setItem("lang", newLang);

    try {
      const response = await fetch("./data/texts.json");
      const texts = await response.json();

      if (!texts[newLang]) {
        console.warn(`[i18n] Langue ${newLang} introuvable dans texts.json`);
        return;
      }

      window.TEXTS = texts[newLang];
      window.currentLang = newLang;
      currentLang = newLang;

      // 🎨 Met à jour le bouton
      btn.classList.add("lang-change");
      setTimeout(() => btn.classList.remove("lang-change"), 400);
      btn.innerText = `${flags[newLang]} ${newLang.toUpperCase()}`;

      if (typeof updateUI === "function") updateUI();
    } catch (err) {
      console.error("[i18n] Erreur lors du changement de langue :", err);
    }
  });
});
