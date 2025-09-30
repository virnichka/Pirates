// ===============================================
// QUIZ ENTRE POTES – main.js (version enrichie)
// * 🚀 Point d’entrée unique du quiz
// * ⏳ Ajout : gestion visuelle de l’état "Chargement"
// ===============================================

window.addEventListener("load", async () => {
  /* -----------------------------------------------------------
     🚀 CHARGEMENT INITIAL DU SITE
     -----------------------------------------------------------
     Lors du premier chargement de la page :
     - affiche le message "Chargement…" dans le sous-titre
     - masque temporairement la zone principale du quiz
     - puis affiche le quiz une fois les données prêtes
  ----------------------------------------------------------- */
  setLoadingState(true); // ⏳ Début du chargement

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

      /* -----------------------------------------------------------
         🎛️ CHANGEMENT DE MODE — RECHARGEMENT DU QUIZ
         -----------------------------------------------------------
         Lorsqu’un mode est sélectionné depuis la liste :
         - affiche "Chargement…" et masque le quiz
         - applique le nouveau thème et les textes associés
         - recharge les questions du mode choisi
         - relance le quiz avec les nouvelles données
      ----------------------------------------------------------- */
      select.addEventListener("change", async (e) => {
        const mode = e.target.value;

        setLoadingState(true); // ⏳ Affiche "Chargement…" et masque le quiz

        try {
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
          } e



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

/**
 * ======================================================
 *  🧩 Mise à jour des accroches selon le mode choisi
 * ======================================================
 */
async function applyAccroches(mode = "general") {
  try {
    // 🔹 Si les accroches n'ont jamais été chargées, on les charge une fois
    if (!window.ACCROCHES) {
      const response = await fetch("./data/accroches.json");
      const data = await response.json();
      window.ACCROCHES = data; // ✅ Sauvegarde globale
      console.log("📦 Accroches chargées globalement :", Object.keys(window.ACCROCHES.modes));
    }

    // 🔹 Récupère le bloc du mode courant
    const modeData = window.ACCROCHES.modes?.[mode] || window.ACCROCHES.modes.general;

    // 🔹 Applique le titre et le sous-titre dans le DOM
    const titre = randomItem(modeData.titres);
    const sousTitre = randomItem(modeData.sousTitres);

    const titleEl = document.getElementById("quizTitle") || document.getElementById("titre");
    const subTitleEl = document.getElementById("quizSubtitle") || document.getElementById("sousTitre");

    if (titleEl) titleEl.innerText = titre;
    if (subTitleEl) subTitleEl.innerText = sousTitre;

    // 🔹 Sauvegarde les phrases de fin du mode
    window.currentComments = modeData.commentairesFin;
    console.log(`🧠 Accroches appliquées pour le mode "${mode}"`);

  } catch (err) {
    console.error("❌ Erreur lors du chargement des accroches :", err);
  }
}

