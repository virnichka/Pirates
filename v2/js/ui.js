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
 * 🏴‍☠️ Retourne un commentaire final selon le pourcentage de réussite
 * → Les phrases sont définies dans data/accroches.json
 */
function getCommentaire(pourcentage) {
  if (!ACCROCHES.commentairesFin) {
    console.warn("⚠️ Commentaires finaux non trouvés dans accroches.json — fallback local utilisé");
    return "Fin du quiz — résultat non interprété.";
  }

  // 🔢 Convertit les clés de l’objet (ex: "10", "20", …) en nombres triés
  const niveaux = Object.keys(ACCROCHES.commentairesFin)
    .map(n => parseInt(n, 10))
    .sort((a, b) => a - b);

  // 📊 Trouve le palier le plus proche sans dépasser le score
  let palier = niveaux[0];
  for (let i = 0; i < niveaux.length; i++) {
    if (pourcentage >= niveaux[i]) palier = niveaux[i];
    else break;
  }

  // 🗣️ Retourne le commentaire du palier trouvé
  return ACCROCHES.commentairesFin[palier] || "Bravo… ou pas, on sait plus trop 😅";
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
