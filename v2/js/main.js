/**
 * 🚀 Point d’entrée unique du quiz
 */
window.addEventListener("load", async () => {
  try {
    // 1️⃣ Récupération ou création du mode par défaut
    let savedMode = localStorage.getItem("selectedMode");
    if (!savedMode) {
      savedMode = "general";
      localStorage.setItem("selectedMode", savedMode);
    }

    // 2️⃣ Application du thème et des accroches
    applyTheme(savedMode);
    await applyAccroches(savedMode);

    // 3️⃣ Chargement des accroches globales (si besoin)
    const response = await fetch("data/accroches.json");
    const accroches = await response.json();
    ACCROCHES = accroches;
    console.log("✅ ACCROCHES chargées :", ACCROCHES);

    // 4️⃣ Chargement des questions + démarrage du quiz
    const questions = await fetchQuestions();
    console.log("✅ Questions reçues :", questions.length);
    if (questions && questions.length > 0) {
      startQuiz(questions);
    } else {
      document.getElementById("quizQuestion").innerText = "Aucune question trouvée.";
    }

    // 5️⃣ Gestion du sélecteur de mode
    const select = document.getElementById("themeMode");
    if (select) {
      select.value = savedMode;
      select.addEventListener("change", async (e) => {
        const mode = e.target.value;
        applyTheme(mode);
        await applyAccroches(mode);
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
