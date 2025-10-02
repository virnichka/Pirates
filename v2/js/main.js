
// ===============================================
// QUIZ ENTRE POTES – main.js (version corrigée)
// * 🚀 Point d’entrée unique du quiz
// ===============================================


/* =======================================
   🔤 GESTION DE LA LANGUE DU SITE
   ======================================= */

const SUPPORTED_LANGS = ["fr", "en", "es"];
const DEFAULT_LANG = "fr";

let lang = localStorage.getItem("lang") ||
           (navigator.language || DEFAULT_LANG).slice(0,2).toLowerCase();
if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

window.TEXTS = null;


async function loadTexts() {
  try {
    const res = await fetch("./data/texts.json", { cache: "no-cache" });
    const allTexts = await res.json();
    window.TEXTS = allTexts[lang] || allTexts[DEFAULT_LANG];
    localStorage.setItem("lang", lang);
    console.log(`[i18n] Langue chargée : ${lang}`);
  } catch (err) {
    console.error("[i18n] Erreur de chargement de texts.json :", err);
  }
}

// ===============================================
// ⚙️ INITIALISATION DU SITE
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

        // 🔹 1.5. Désactive temporairement le sélecteur pour éviter plusieurs clics
        select.disabled = true;

        // 🔹 2. Applique le thème visuel correspondant
        applyTheme(mode);

        // 🔹 2.5. Affiche un message de chargement pendant la transition de mode
        const quizQuestionEl = document.getElementById("quizQuestion");
        const quizAnswersEl = document.getElementById("quizAnswers");
        const miniCommentEl = document.getElementById("miniCommentaire");

        console.log("🎨 Début du fondu sur #quizQuestion :", quizQuestionEl);

        if (quizQuestionEl) quizQuestionEl.innerText = "- Chargement du quiz -";
        if (quizAnswersEl) quizAnswersEl.innerHTML = "";
        if (miniCommentEl) miniCommentEl.style.display = "none";

        // 💫 Ajoute la classe d'animation pour le fondu du texte
      if (quizQuestionEl) {
        quizQuestionEl.classList.add("fade");
        quizQuestionEl.classList.remove("show");
        setTimeout(() => quizQuestionEl.classList.add("show"), 50);
      }


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

        // 🔹 6. Réactive le sélecteur après le chargement
        select.disabled = false;
      }); // <-- fermeture du addEventListener
    } // <-- fermeture du if (select)
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

