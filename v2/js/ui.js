/**
 * 🎨 Gestion de l'interface et des textes
 */

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light");
  const btn = document.getElementById("toggleThemeBtn");
  btn.innerText = isLight ? "Basculer en thème sombre" : "Basculer en thème clair";
}

/**
 * Récupère un ensemble de prénoms aléatoires à afficher comme fausses réponses
 */
function getRandomNames(exclude) {
  const noms = ["Thomas", "Simon", "Vladimir", "Alexis", "Ludovic", "Sacha", "Maxence", "Le zinc"];
  return noms.filter(n => n !== exclude).sort(() => Math.random() - 0.5).slice(0, 3);
}

/**
 * Mélange un tableau
 */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Retourne un message final selon le score
 */
function getCommentaire(pourcentage) {
  if (pourcentage === 100) return "Tu es imbattable 🔥";
  if (pourcentage >= 80) return "Excellent ! Tu connais tout le monde !";
  if (pourcentage >= 50) return "Pas mal, tu t’en sors bien 👏";
  if (pourcentage >= 20) return "Hmm… on a connu mieux 😅";
  return "Zéro pointé. T'es sûr que tu fais partie du groupe ? 😬";
}

