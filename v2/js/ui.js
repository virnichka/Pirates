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

if (typeof TEXTS === "undefined" || !TEXTS?.ui) {
  console.warn("[i18n] TEXTS non défini dans ui.js — vérifie le chargement depuis main.js");
}


let ACCROCHES = TEXTS?.accroches || {}; // ✅🔹 texts accroches


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
 *  - Lit d’abord les commentaires du mode actif (localStorage.selectedMode)
 *  - Sinon fallback sur les commentaires racine (compatibilité)
 *  - Conserve ta logique de paliers 0/20/40/60/80/100
 * ======================================================
 */
function getCommentaire(pourcentage) {
  // 🧠 1) Récupère le mode courant (sauvegardé par le sélecteur)
  const modeFromStorage = localStorage.getItem("selectedMode");

  // 🧩 2) Récupère les données globales des accroches
  const data = ACCROCHES || TEXTS?.accroches;
  if (!data) {
    console.warn("⚠️ ACCROCHES non chargé ou inaccessible.");
    return "Fin du quiz — données indisponibles.";
  }

  // 🎯 3) Sélectionne la bonne source de commentaires
  const byMode = data?.modes?.[modeFromStorage]?.commentairesFin;
  const comments = byMode || data?.commentairesFin || {};

  // 🛑 4) Sécurité si rien trouvé
  const keys = Object.keys(comments);
  if (!keys.length) {
    console.warn("⚠️ Aucun commentaire de fin trouvé pour le mode:", modeFromStorage);
    console.log("📂 Modes disponibles :", Object.keys(data.modes || {}));
    return "Bravo pour avoir terminé le quiz !";
  }

  // 📊 5) Trie les clés ("0","20",...) en nombres
  const niveaux = keys
    .map(k => parseInt(k, 10))
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => a - b);

  // 📈 6) Trouve le palier correspondant
  let palier = niveaux[0];
  for (let i = 0; i < niveaux.length; i++) {
    if (pourcentage >= niveaux[i]) palier = niveaux[i];
    else break;
  }

  // 🗣️ 7) Retourne la phrase correspondante
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
  btn.innerText = isLight ? TEXTS.ui.toggleDark : TEXTS.ui.toggleLight;
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

