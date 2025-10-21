
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



// ============================================================
// 📤 Gestion complète du formulaire de proposition de question
// ============================================================

const proposeBtn = document.getElementById("proposeBtn");
const proposeSection = document.getElementById("proposeSection");

if (proposeBtn && proposeSection) {
  proposeBtn.addEventListener("click", () => {
    // 🔁 Toggle d'affichage du formulaire avec transition fade déjà existante
    if (proposeSection.style.display === "block") {
      proposeSection.classList.remove("show"); // fade-out
      setTimeout(() => {
        proposeSection.style.display = "none";
        proposeSection.innerHTML = "";
        proposeSection.classList.remove("fade");
      }, 800);
      return;
    }

    // ✅ Création du formulaire avec effet fade déjà défini en CSS
    proposeSection.style.display = "block";
    proposeSection.classList.add("fade");
    setTimeout(() => proposeSection.classList.add("show"), 50);

    proposeSection.innerHTML = `
      <form id="userQuestionForm" class="user-question-form">
        <h3 data-i18n="ui.submitQuestionTitle">💡 Proposer une nouvelle question</h3>

        <div class="form-group">
          <label for="userKey" data-i18n="ui.userKeyLabel">🔑 Clé d'accès :</label>
          <input type="text" id="userKey" name="userKey" required />
        </div>

        <div class="form-group">
          <label for="questionText" data-i18n="ui.questionLabel">❓ Question :</label>
          <textarea id="questionText" name="questionText" rows="2" required></textarea>
        </div>

        <div class="form-group">
          <label for="correctAnswer" data-i18n="ui.correctAnswerLabel">✅ Bonne réponse :</label>
          <input type="text" id="correctAnswer" name="correctAnswer" required />
        </div>

        <fieldset class="wrong-answers">
          <legend>❌ <span data-i18n="ui.wrongAnswersGroup">Mauvaises réponses</span></legend>
          ${Array.from({ length: 6 }, (_, i) => `
            <input type="text" id="wrongAnswer${i+1}" name="wrongAnswer${i+1}" placeholder="Mauvaise réponse ${i+1}" />
          `).join("")}
        </fieldset>

        <div class="form-group">
          <label for="category" data-i18n="ui.categoryLabel">🏷️ Catégorie :</label>
          <select id="category" name="category" required>
            <option value="general">Général 🦁</option>
            <option value="fun">Fun 🤪</option>
            <option value="full_dark">Full Dark 🏴‍☠️</option>
          </select>
        </div>

        <div id="sendMessage" class="send-status"></div>

        <div class="form-group center">
          <button type="submit" id="sendQuestionBtn" data-i18n="ui.sendButton">📤 Envoyer</button>
        </div>
      </form>
    `;

    // 🔠 Mise à jour des traductions
    if (typeof updateUITexts === "function") updateUITexts();

    const form = document.getElementById("userQuestionForm");
    const sendBtn = document.getElementById("sendQuestionBtn");
    const messageBox = document.getElementById("sendMessage");

    // ✅ Version améliorée : vérifie proprement la clé avant l'envoi et gère l'affichage du message

   form.addEventListener("submit", async (e) => {
        e.preventDefault();
      
        const ui = window.TEXTS?.ui || {};
        const sendBtn = document.getElementById("sendQuestionBtn");
        const messageBox = document.getElementById("sendMessage");
      
        // Récupération des valeurs
        const userKey = form.userKey.value.trim();
        const questionText = form.questionText.value.trim();
        const correctAnswer = form.correctAnswer.value.trim();
        const wrongAnswers = Array.from({ length: 6 }, (_, i) => form[`wrongAnswer${i + 1}`].value.trim()).filter(v => v);
        const category = form.category.value;
      
        // Validation basique des champs obligatoires
        if (!userKey || !questionText || !correctAnswer) {
          messageBox.textContent = ui.missingFields || "⚠️ Merci de remplir la clé, la question et la bonne réponse.";
          messageBox.style.color = "orange";
          return;
        }
      
        // Vérification de la clé d’accès
        const validKeys = CONFIG.VALID_KEYS || {};
        const submitted_by = validKeys[userKey];
      
        if (!submitted_by) {
          // 🔴 Cas clé invalide : message localisé et blocage complet
          messageBox.textContent = ui.invalidKey || "❌ Clé d’accès invalide.";
          messageBox.style.color = "red";
          sendBtn.disabled = false;
          sendBtn.textContent = ui.sendButton || "📤 Envoyer";
          return; // ⛔ Stoppe complètement l'envoi
        }
      
        // 🟢 Clé valide → préparation du payload
        const payload = {
          submitted_by,
          questionText,
          correctAnswer,
          wrongAnswers,
          category
        };
      
        try {
          sendBtn.disabled = true;
          sendBtn.textContent = ui.sending || "📤 Envoi en cours...";
          messageBox.textContent = "";
      
          console.log("📦 Données prêtes à l’envoi :", payload);
          const result = await sendUserQuestion(payload);
      
          if (result?.status === "success") {
            messageBox.textContent = ui.sendSuccess || "✅ Question envoyée avec succès ! Merci 🙌";
            messageBox.style.color = "green";
            form.reset();
          } else {
            messageBox.textContent = ui.sendError || "⚠️ Erreur lors de l'envoi. Réessaie plus tard.";
            messageBox.style.color = "orange";
          }
        } catch (err) {
          console.error("❌ Erreur lors de l'envoi :", err);
          messageBox.textContent = ui.networkError || "❌ Une erreur est survenue pendant l'envoi.";
          messageBox.style.color = "red";
        } finally {
          sendBtn.disabled = false;
          sendBtn.textContent = ui.sendButton || "📤 Envoyer";
        }
      });
  }); 
}

