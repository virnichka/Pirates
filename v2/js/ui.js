/**
 * 🎨 Gestion de l'interface et des textes (V2.4)
 * 
 * - Charge les accroches (titres, sous-titres, commentaires finaux)
 * - Gère le thème clair/sombre
 * - Fournit des utilitaires (shuffle, prénoms aléatoires)
 */

let ACCROCHES = {}; // 🔹 Stockera les données du fichier accroches.json


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
  const data = window.ACCROCHES;
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
  btn.innerText = isLight ? "Basculer en thème sombre" : "Basculer en thème clair";
}

/* -----------------------------------------------------------
   ⏳ ÉTAT DE CHARGEMENT — AFFICHAGE / MASQUAGE DU QUIZ
   -----------------------------------------------------------
   Gère l'affichage du texte "Chargement…" dans le sous-titre
   et masque temporairement la zone principale du quiz (<main>)
   lors du changement de mode ou du chargement initial.
----------------------------------------------------------- */
function setLoadingState(isLoading) {
  const subtitle = document.getElementById("quizSubtitle");
  const quizMain = document.querySelector("main"); // zone principale du quiz

  if (!subtitle || !quizMain) return;

  if (isLoading) {
    subtitle.textContent = "Chargement…";
    quizMain.style.display = "none";  // cache question + boutons
  } else {
    subtitle.textContent = "";        // retire le message
    quizMain.style.display = "";      // réaffiche le quiz
  }
}

/* -----------------------------------------------------------
   🎨 THÈME VISUEL — Application par mode
   -----------------------------------------------------------
   Applique l'attribut data-theme sur <html> pour activer
   les variables CSS du mode : "general" | "fun" | "full_dark".
   Ne touche pas au localStorage (géré par main.js).
----------------------------------------------------------- */
function applyTheme(mode) {
  const valid = ["general", "fun", "full_dark"];
  const chosen = valid.includes(mode) ? mode : "general";
  document.documentElement.setAttribute("data-theme", chosen);

  // Aligne le sélecteur si présent (confort UX)
  const select = document.getElementById("themeMode");
  if (select && select.value !== chosen) select.value = chosen;
}

/* -----------------------------------------------------------
   💬 ACCROCHES — Titres / Sous-titres par mode
   -----------------------------------------------------------
   Charge (une seule fois) accroches.json puis applique
   un titre et un sous-titre aléatoires pour le mode choisi.
   Sauvegarde aussi les commentaires de fin du mode.
----------------------------------------------------------- */
async function applyAccroches(mode = "general") {
  try {
    if (!window.ACCROCHES) {
      const res = await fetch("accroches.json");   // au root du projet
      window.ACCROCHES = await res.json();
      console.log("📦 Accroches chargées globalement :", Object.keys(window.ACCROCHES?.modes || {}));
    }

    const modeData =
      window.ACCROCHES?.modes?.[mode] ||
      window.ACCROCHES?.modes?.general ||
      {};

    const titre = Array.isArray(modeData.titres) && modeData.titres.length
      ? modeData.titres[Math.floor(Math.random() * modeData.titres.length)]
      : "Quiz Entre Potes";

    const sousTitre = Array.isArray(modeData.sousTitres) && modeData.sousTitres.length
      ? modeData.sousTitres[Math.floor(Math.random() * modeData.sousTitres.length)]
      : "";

    const titleEl = document.getElementById("quizTitle");
    const subEl = document.getElementById("quizSubtitle");
    if (titleEl) titleEl.textContent = titre;
    if (subEl) subEl.textContent = sousTitre;

    // Dispo pour getCommentaire()
    window.currentComments = modeData.commentairesFin || {};
    console.log(`🧠 Accroches appliquées pour le mode "${mode}"`);
  } catch (err) {
    console.error("❌ Erreur lors du chargement des accroches :", err);
  }
}


