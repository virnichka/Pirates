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

    // 🩵 Synchronisation de sécurité avec le contenu global chargé
  if (!ACCROCHES || !Object.keys(ACCROCHES).length) {
    ACCROCHES = window.ACCROCHES || {};
  }
  
  // 1) Récupère le mode courant (sauvegardé par le sélecteur)
  const modeFromStorage = localStorage.getItem("selectedMode");

  // 2) Sélectionne la bonne source de commentaires
  //    - d’abord ceux du mode (si dispo)
  //    - sinon le bloc racine ACCROCHES.commentairesFin
  const byMode = ACCROCHES?.modes?.[modeFromStorage]?.commentairesFin;
  const comments = byMode || ACCROCHES?.commentairesFin || {};

  // 3) Sécurités : si rien trouvé, on renvoie une phrase par défaut
  const keys = Object.keys(comments);
  if (!keys.length) {
    console.warn("⚠️ Aucun commentaire de fin trouvé pour le mode:", modeFromStorage);
    return "Bravo pour avoir terminé le quiz !";
  }

  // 4) Convertit les clés ("0","20",...) en nombres triés
  const niveaux = keys
    .map(k => parseInt(k, 10))
    .filter(n => !Number.isNaN(n))
    .sort((a, b) => a - b);

  // 5) Trouve le palier le plus bas <= pourcentage
  let palier = niveaux[0];
  for (let i = 0; i < niveaux.length; i++) {
    if (pourcentage >= niveaux[i]) palier = niveaux[i];
    else break;
  }

  // 6) Renvoie la phrase correspondante (fallback générique si manquante)
  return comments[palier] || "Bravo pour avoir terminé le quiz !";
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
