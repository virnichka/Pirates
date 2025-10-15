
// ===============================================
// QUIZ ENTRE POTES – main.js (version corrigée)
// * 🚀 Point d’entrée unique du quiz
// ===============================================


/* =======================================
   🔤 GESTION DE LA LANGUE DU SITE
   ======================================= */

const SUPPORTED_LANGS = ["fr", "en", "es", "ro"];
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
  } catch (err) {
    console.error("[i18n] Erreur de chargement de texts.json :", err);
  }
}




// ===============================================
// ⚙️ INITIALISATION DU SITE
// ===============================================

window.addEventListener("load", async () => {
  try {
    await loadTexts(); // 🧩 Charge les textes multilingues au démarrage

      // Recharge texts.json dans la bonne langue
      if (window.ALL_TEXTS && window.ALL_TEXTS[savedLang]) {
        window.TEXTS = window.ALL_TEXTS[savedLang];
      } else {
        const res = await fetch("./data/texts.json", { cache: "no-cache" });
        const all = await res.json();
        window.ALL_TEXTS = all;
        window.TEXTS = all[savedLang];
      }
     
     // 🗣️ Applique la langue sauvegardée au chargement
      const savedLang = localStorage.getItem("lang") || "fr";
      window.currentLang = savedLang;
      
      // Force la mise à jour des textes localisés de l'interface
      if (typeof updateUITexts === "function") {
        updateUITexts();
      }
     
    // 1️⃣ Récupération du mode sauvegardé (ou "general" par défaut)
    const savedMode = localStorage.getItem("selectedMode") || "general";

    // 2️⃣ Application du thème visuel et des accroches correspondantes
    applyTheme(savedMode);
    await applyAccroches(savedMode);

     // Synchronise le sélecteur du mode
      const modeSelect = document.getElementById("themeMode");
      if (modeSelect) {
        modeSelect.value = savedMode;
      }


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
        const modeActuel = localStorage.getItem("selectedMode") || "general";
        const modeDemande = e.target.value;

        // 🏴‍☠️ Si le mode demandé est Full Dark, demande un mot de passe
        if (modeDemande === "full_dark") {
          const mdp = prompt("🗝️");
          if (mdp !== CONFIG.FULL_DARK_PASS) {
            // 🗨️ Message localisé depuis texts.json
            const uiTexts = window.TEXTS?.ui || {};
            alert(uiTexts.badPassword || "❌ Mot de passe incorrect.");
            
            // 🔁 Retour au mode précédent
            e.target.value = modeActuel;
            return; // stoppe ici, on ne change pas de mode
          }
        }

        // ✅ Si on arrive ici, le mode demandé est autorisé
        localStorage.setItem("selectedMode", modeDemande);

        // 🔹 1. Désactive temporairement le sélecteur pour éviter plusieurs clics
        select.disabled = true;

        // 🔹 2. Applique le thème visuel correspondant
        applyTheme(modeDemande);

        // 🔹 2.5. Affiche un message de chargement pendant la transition de mode
        const quizQuestionEl = document.getElementById("quizQuestion");
        const quizAnswersEl = document.getElementById("quizAnswers");
        const miniCommentEl = document.getElementById("miniCommentaire");

        // 🈳 Message localisé "chargement du quiz"
         const uiTexts = window.TEXTS?.ui || {};
         const loadingMsg = uiTexts.loading || "- Chargement du quiz -";
         if (quizQuestionEl) quizQuestionEl.innerText = loadingMsg;
        if (quizAnswersEl) quizAnswersEl.innerHTML = "";
        if (miniCommentEl) miniCommentEl.style.display = "none";

        // 💫 Animation de fondu pour le texte
        if (quizQuestionEl) {
          quizQuestionEl.classList.add("fade");
          quizQuestionEl.classList.remove("show");
          setTimeout(() => quizQuestionEl.classList.add("show"), 50);
        }

        // 🔹 3. Met à jour les accroches (titres/sous-titres)
        await applyAccroches(modeDemande);

        // 🔹 4. Recharge les questions du bon mode
        const newQuestions = await fetchQuestions(modeDemande);

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

async function applyAccroches(mode = "general") {
  try {
    // 🔹 Si les textes ne sont pas encore chargés, on les charge une fois
    if (!window.TEXTS) {
      const response = await fetch("./data/texts.json");
      const allTexts = await response.json();
      const lang = window.currentLang || localStorage.getItem("lang") || "fr";
      window.TEXTS = allTexts[lang];
    }

    // 🔹 Récupère le bloc du mode courant (depuis texts.json)
    const modeData =
      window.TEXTS?.accroches?.modes?.[mode] ||
      window.TEXTS?.accroches?.modes?.general;

    if (!modeData) {
      console.warn(`[i18n] Aucun bloc trouvé pour le mode "${mode}"`);
      return;
    }

    // 🔹 Applique le titre et le sous-titre dans le DOM
    const titre = randomItem(modeData.titres);
    const sousTitre = randomItem(modeData.sousTitres);

    const titleEl =
      document.getElementById("quizTitle") || document.getElementById("titre");
    const subTitleEl =
      document.getElementById("quizSubtitle") || document.getElementById("sousTitre");

    if (titleEl) titleEl.innerText = titre;
    if (subTitleEl) subTitleEl.innerText = sousTitre;

    // 🔹 Sauvegarde les phrases de fin du mode
    window.currentComments = modeData.commentairesFin;
  } catch (err) {
    console.error("❌ Erreur lors du chargement des textes :", err);
  }
}


