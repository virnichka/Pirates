
// ===============================================
// QUIZ ENTRE POTES – main.js (version corrigée)
// * 🚀 Point d’entrée unique du quiz
// ===============================================

window.addEventListener("load", async () => {
  try {
    // 1️⃣ Récupération du mode sauvegardé (ou "general" par défaut)
    const savedMode = localStorage.getItem("selectedMode") || "general";

    // 2️⃣ Application du thème visuel et des accroches correspondantes
    applyTheme(savedMode);
    await applyAccroches(savedMode);

    // 3️⃣ Chargement des questions selon le mode choisi
    const questions = await fetchQuestions(savedMode);

    // 4️⃣ Démarrage du quiz
    startQuiz(questions);

    // 5️⃣ Gestion du sélecteur de mode (liste déroulante)
    const select = document.getElementById("themeMode");
    if (select) {
      // initialise la valeur affichée dans la liste
      select.value = savedMode;

      // écoute le changement de mode
      select.addEventListener("change", async (e) => {
        const mode = e.target.value;

        // 🔹 1. Sauvegarde le mode choisi
        localStorage.setItem("selectedMode", mode);

        // 🔹 2. Applique le thème visuel correspondant
        applyTheme(mode);

        // 🔹 3. Met à jour les accroches (titres/sous-titres)
        await applyAccroches(mode);

        // 🔹 4. Recharge les questions du bon mode
        const newQuestions = await fetchQuestions(mode);

        // 🔹 5. Redémarre le quiz avec les nouvelles questions
        if (newQuestions && newQuestions.length > 0) {
          startQuiz(newQuestions);
        } else {
          document.getElementById("quizQuestion").innerText =
            "Aucune question trouvée pour ce mode.";
        }
      });
    }
  } catch (err) {
    console.error("❌ Erreur lors du démarrage du quiz :", err);
  }
});


/**
 * Renvoie un élément aléatoire d’un tableau
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// === Gestion du thème visuel du site ===
function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("selectedMode", mode);
}

// === Gestion des accroches dynamiques selon le mode ===
async function applyAccroches(mode) {
  try {
    const response = await fetch("data/accroches.json");
    const data = await response.json();

    const selectedMode = data.modes[mode] || data.modes[data._defaultMode];

    const titre = selectedMode.titres[Math.floor(Math.random() * selectedMode.titres.length)];
    const sousTitre = selectedMode.sousTitres[Math.floor(Math.random() * selectedMode.sousTitres.length)];

    const headerTitle = document.querySelector("header h1");
    const headerSubtitle = document.querySelector("header p");

    if (headerTitle) headerTitle.textContent = titre;
    if (headerSubtitle) headerSubtitle.textContent = sousTitre;
  } catch (err) {
    console.error("Erreur lors du chargement des accroches :", err);
  }
}
