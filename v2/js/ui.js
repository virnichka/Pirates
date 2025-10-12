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


/* ==========================================================
   🌍 GESTION DU SÉLECTEUR DE LANGUE VISUEL
   ----------------------------------------------------------
   • Affiche le drapeau de la langue actuelle.
   • Permet de changer de langue via un menu déroulant.
   • Met à jour texts.json et l’interface (i18n).
   • S’adapte automatiquement au thème actuel.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  const currentFlag = document.getElementById("currentFlag");

  if (!btn || !menu || !currentFlag) return;

  // 🏳️ Liste des langues disponibles + icônes
  const flags = {
    fr: "flags/fr.svg",
    en: "flags/en.svg",
    es: "flags/es.svg",
    ro: "flags/ro.svg"
  };

  // 🔹 Langue courante (localStorage ou défaut)
  let currentLang = localStorage.getItem("lang") || "fr";
  currentFlag.src = flags[currentLang];

  // 🔹 Clique sur le bouton principal → ouvre/ferme le menu
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // 🔹 Sélection d’une langue dans le menu
  document.querySelectorAll(".lang-option").forEach(opt => {
    opt.addEventListener("click", async (e) => {
      const newLang = e.currentTarget.dataset.lang;
      if (newLang === currentLang) return;

      // 💾 Enregistre la langue choisie
      localStorage.setItem("lang", newLang);
      currentLang = newLang;
      currentFlag.src = flags[newLang];
      menu.classList.add("hidden");

      // 🧩 Recharge les textes depuis texts.json
      try {
        const response = await fetch("./data/texts.json");
        const texts = await response.json();
        if (!texts[newLang]) throw new Error("Langue manquante dans texts.json");
        window.TEXTS = texts[newLang];
        window.currentLang = newLang;
        if (typeof updateUITexts === "function") updateUITexts();
        console.log(`[i18n] Langue changée vers : ${newLang}`);
      } catch (err) {
        console.error("[i18n] Erreur lors du changement de langue :", err);
      }
    });
  });

  // 🔹 Ferme le menu si on clique ailleurs
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-selector")) menu.classList.add("hidden");
  });
});
