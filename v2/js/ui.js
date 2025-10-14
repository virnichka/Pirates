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


// 🌍 Initialisation + gestion du changement de langue (bloc unique)
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  if (!langSelect) return;

  // 1) AU CHARGEMENT : synchro visuelle du sélecteur avec la langue sauvegardée
  const savedLang =
    localStorage.getItem("lang") ||
    (navigator.language || "fr").slice(0, 2).toLowerCase();

  langSelect.value = savedLang;       // ✅ le menu affiche la bonne langue
  window.currentLang = savedLang;     // ✅ référence globale pour le reste du code

  // 2) CHANGEMENT UTILISATEUR : met à jour l'app
  langSelect.addEventListener("change", async (e) => {
    const newLang = e.target.value;
    if (newLang === window.currentLang) return;

    localStorage.setItem("lang", newLang);
    window.currentLang = newLang;

    try {
      // recharge texts.json et sélectionne la langue
      const res = await fetch("./data/texts.json", { cache: "no-cache" });
      const all = await res.json();
      window.TEXTS = all[newLang];

      // met à jour les libellés statiques (data-i18n, boutons, etc.)
      if (typeof updateUITexts === "function") updateUITexts();

      // met à jour le titre / sous-titre pour le mode courant
      const savedMode = localStorage.getItem("selectedMode") || "general";
      if (typeof applyAccroches === "function") await applyAccroches(savedMode);

      // nettoyage visuel + message "loading" localisé
      const ui = window.TEXTS?.ui || {};
      const loadingMsg = ui.loading || "- Chargement du quiz -";
      const qEl = document.getElementById("quizQuestion");
      const aEl = document.getElementById("quizAnswers");
      const miniEl = document.getElementById("miniCommentaire");
      if (qEl) qEl.innerText = loadingMsg;
      if (aEl) aEl.innerHTML = "";
      if (miniEl) miniEl.style.display = "none";

      // recharge les questions et relance le quiz
      if (typeof fetchQuestions === "function" && typeof startQuiz === "function") {
        const qs = await fetchQuestions(savedMode);
        startQuiz(qs);
      }
    } catch (err) {
      console.error("Erreur lors du changement de langue :", err);
    }
  });
});



