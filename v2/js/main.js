/**
 * 🚀 Point d’entrée du quiz
 */

window.onload = async () => {
  try {
    // ✅ Charger les accroches et les rendre globales (visibles dans ui.js)
    const response = await fetch("data/accroches.json");
    const accroches = await response.json();
    ACCROCHES = accroches; // ⬅️ pas window.ACCROCHES, juste ACCROCHES global
    console.log("✅ ACCROCHES chargées :", ACCROCHES);

    // 🎯 Appliquer un titre et un sous-titre aléatoires
    const titre = randomItem(ACCROCHES.titres);
    const sousTitre = randomItem(ACCROCHES.sousTitres);
    document.getElementById("titre").innerText = titre;
    document.getElementById("sousTitre").innerText = sousTitre;

    // 📦 Charger les questions
    const questions = await fetchQuestions();
    if (questions.length > 0) startQuiz(questions);
    else document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  } catch (err) {
    console.error("❌ Erreur lors du démarrage :", err);
  }
};

/**
 * Renvoie un élément aléatoire d’un tableau
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// === Gestion du thème visuel du site ===

// Applique le thème visuel selon le mode choisi
function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("selectedMode", mode); // sauvegarde du choix dans le navigateur
}

// === Gestion des accroches dynamiques selon le mode ===
async function applyAccroches(mode) {
  try {
    const response = await fetch("data/accroches.json");
    const data = await response.json();

    // On regarde dans la partie "modes"
    const selectedMode = data.modes[mode] || data.modes[data._defaultMode];

    // Sélectionne aléatoirement un titre et un sous-titre
    const titre = selectedMode.titres[Math.floor(Math.random() * selectedMode.titres.length)];
    const sousTitre = selectedMode.sousTitres[Math.floor(Math.random() * selectedMode.sousTitres.length)];

    // Injection dans le DOM
    const headerTitle = document.querySelector("header h1");
    const headerSubtitle = document.querySelector("header p");

    if (headerTitle) headerTitle.textContent = titre;
    if (headerSubtitle) headerSubtitle.textContent = sousTitre;

  } catch (err) {
    console.error("Erreur lors du chargement des accroches :", err);
  }
}


// Au chargement de la page : on applique le thème sauvegardé ou le thème par défaut
document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("selectedMode") || "general";
  applyTheme(savedMode);
  applyAccroches(savedMode);
  
  
  // Gestion du sélecteur de mode si présent dans le HTML
  const select = document.getElementById("themeMode");
  if (select) {
    select.value = savedMode;
    select.addEventListener("change", (e) => {
      const mode = e.target.value;
      applyTheme(mode);
      applyAccroches(mode);
    });
  }
});


