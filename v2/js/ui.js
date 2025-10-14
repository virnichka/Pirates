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
  if (!window.TEXTS?.ui) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = key.split('.').reduce((o, i) => o?.[i], window.TEXTS);
    if (value) {
      if (el.tagName === "TITLE") document.title = value;
      else el.innerText = value;
    }
  });
}






/* =======================================
   ⏳ Attente du chargement de TEXTS
   ======================================= */
function waitForTexts() {
  if (typeof TEXTS !== "undefined" && TEXTS?.ui) {
    ACCROCHES = TEXTS.accroches || {};

  } else {
    setTimeout(waitForTexts, 300);
  }
}

// 🚀 Lancement automatique
waitForTexts();

// 🌍 Gestion du changement de langue simplifiée
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  if (!langSelect) return;

  // Langue courante (depuis le localStorage ou défaut)
  let currentLang = localStorage.getItem("lang") || "fr";
  langSelect.value = currentLang;

  // 🔁 Quand on change de langue dans le menu
  langSelect.addEventListener("change", async (e) => {
    const newLang = e.target.value;
    if (newLang === currentLang) return;

    localStorage.setItem("lang", newLang);
    currentLang = newLang;

    try {
      const response = await fetch("./data/texts.json");
      const texts = await response.json();
      if (!texts[newLang]) throw new Error("Langue manquante dans texts.json");

      window.TEXTS = texts[newLang];
      window.currentLang = newLang;

      if (typeof updateUITexts === "function") updateUITexts();
         // 🔁 Recharge les questions dans la nouvelle langue
         if (typeof fetchQuestions === "function" && typeof startQuiz === "function") {
           const savedMode = localStorage.getItem("selectedMode") || "general";
           const newQuestions = await fetchQuestions(savedMode);
           startQuiz(newQuestions);
           console.log(`[i18n] Quiz rechargé pour la langue : ${newLang}`);
         }

    } catch (err) {
      console.error("[i18n] Erreur lors du changement de langue :", err);
    }
  });
}

/**
 * ============================================================
 * 🌐 Barre compacte Langue / Mode
 * ------------------------------------------------------------
 * Relie les  boutons en haut du header
 * aux <select> existants pour langue et mode.
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments du DOM
  const langBtn = document.getElementById("langBtn");
  const modeBtn = document.getElementById("modeBtn");
  const langSelect = document.getElementById("langSelect");
  const modeSelect = document.getElementById("themeMode");

  /* === LANGUE === */
  if (langBtn && langSelect) {
    // Au clic sur le bouton, on ouvre le menu de sélection natif
    langBtn.addEventListener("click", () => {
      // showPicker() est supporté par Chrome, sinon fallback focus()
      langSelect.showPicker?.() || langSelect.focus();
    });

    // Quand la langue change, on met à jour le texte du bouton
    langSelect.addEventListener("change", () => {
      const selectedLang = langSelect.value.toUpperCase();
      langBtn.textContent = `🌐 ${selectedLang}`;
    });
  }

  /* === MODE === */
  if (modeBtn && modeSelect) {
    // Au clic sur le bouton, ouverture du menu mode
    modeBtn.addEventListener("click", () => {
      modeSelect.showPicker?.() || modeSelect.focus();
    });

    // Quand le mode change, on met à jour le texte du bouton
    modeSelect.addEventListener("change", () => {
      const selectedMode = modeSelect.options[modeSelect.selectedIndex].textContent.trim();
      modeBtn.textContent = `🏴‍☠️ ${selectedMode}`;
    });
  }
});


