
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
      
        // 🗣️ Applique la langue sauvegardée 
      const savedLang = localStorage.getItem("lang") || "fr";
      window.currentLang = savedLang;
      
      // 🌈 applique le thème visuel du mode 
      const savedMode = localStorage.getItem("selectedMode") || "general";
      applyTheme(savedMode);
      
      
      // Force la mise à jour des textes localisés de l'interface
      if (typeof updateUITexts === "function") {
      updateUITexts();
      }    

      await loadTexts(); // 🧩 Charge les textes multilingues au démarrage
      await fetchUserKeys(); // 🔑 charge les clés utilisateurs au démarrage
      
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

    // 🔹 Sélectionne aléatoirement un titre et un sous-titre
    const titre = randomItem(modeData.titres);
    const sousTitre = randomItem(modeData.sousTitres);

    // Fonction interne pour appliquer les textes si les éléments existent
    const updateTitles = () => {
      const titleEl =
        document.getElementById("quizTitle") || document.getElementById("titre");
      const subTitleEl =
        document.getElementById("quizSubtitle") || document.getElementById("sousTitre");

      if (titleEl && subTitleEl) {
        titleEl.innerText = titre;
        subTitleEl.innerText = sousTitre;
        window.currentComments = modeData.commentairesFin;
        return true; // succès
      }
      return false; // pas encore dispo
    };

    // 🔹 Premier essai immédiat
    if (updateTitles()) return;

    // 🔹 Sinon, on observe le DOM jusqu’à ce qu’ils apparaissent
    const observer = new MutationObserver(() => {
      if (updateTitles()) {
        observer.disconnect(); // stoppe dès que c’est fait
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (err) {
    console.error("❌ Erreur lors du chargement des textes :", err);
  }
}



// ============================================================
// 🏆📤 Connexion des boutons du footer aux fonctions Toggle-logic
// ============================================================

const proposeBtn = document.getElementById("proposeBtn");
const rankingBtn = document.getElementById("rankingBtn");

if (proposeBtn) {
  proposeBtn.addEventListener("click", toggleProposeSection);
}

if (rankingBtn) {
  rankingBtn.addEventListener("click", toggleRankingSection);
}

// 🎚️ Logique unifiée d'ouverture / fermeture des deux panneaux

const proposeSection = document.getElementById("proposeSection");
const rankingSection = document.getElementById("rankingSection");

// Durée cohérente avec l'animation CSS existante
const FADE_DURATION = 400; // ms
let proposeFormInitialized = false;
// 📄 Crée le formulaire si pas déjà généré (et conserve les valeurs déjà saisies)
function createProposeForm() {
  if (proposeFormInitialized) return;
  proposeSection.innerHTML = `
      <form id="userQuestionForm" class="user-question-form">
        <h3 data-i18n="ui.submitQuestionTitle">💡 Proposer une nouvelle question</h3>

        <div class="form-group">
          <label for="userKey" data-i18n="ui.userKeyLabel">🔑 Clé d'accès :</label>
          <input type="text" id="userKey" name="userKey" required />
        </div>

        <div class="form-group">
          <label for="category" data-i18n="ui.categoryLabel">🏷️ Catégorie :</label>
          <select id="category" name="category" required>
            <option value="general">Général 🦁</option>
            <option value="fun">Fun 🤪</option>
            <option value="full_dark">Full Dark 🏴‍☠️</option>
          </select>
        </div>

        <div class="form-group">
          <label for="questionLang" data-i18n="ui.languageLabel">🌍 Langue de la question :</label>
          <select id="questionLang" name="questionLang" required>
            <option value="fr">🇫🇷</option>
            <option value="en">🇬🇧</option>
            <option value="es">🇪🇸</option>
            <option value="ro">🇷🇴</option>
          </select>
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
          <legend data-i18n="ui.wrongAnswersGroup">🔀 Réponses possibles</legend>
          ${Array.from({ length: 6 }, (_, i) => `
            <input type="text" id="wrongAnswer${i+1}" name="wrongAnswer${i+1}" placeholder="✏️" />
          `).join("")}
        </fieldset>

        <div class="form-group">
          <label for="explanationText" data-i18n="ui.explanationLabel">📝 Explication (optionnelle) :</label>
          <textarea id="explanationText" name="explanationText" rows="3" data-i18n-ph="ui.explanationPlaceholder"></textarea>
          </div>

        <div id="sendMessage" class="send-status"></div>

        <div class="form-group center">
          <button type="submit" id="sendQuestionBtn" data-i18n="ui.sendButton">📤 Envoyer</button>
        </div>
      </form>
    `;

    if (typeof updateUITexts === "function") updateUITexts();

    const form = document.getElementById("userQuestionForm");
    const sendBtn = document.getElementById("sendQuestionBtn");
    const messageBox = document.getElementById("sendMessage");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const ui = window.TEXTS?.ui || {};

      const userKey = form.userKey.value.trim();
      const category = form.category.value;
      const questionLang = form.questionLang.value;
      const questionText = form.questionText.value.trim();
      const correctAnswer = form.correctAnswer.value.trim();
      const wrongAnswers = Array.from({ length: 6 }, (_, i) => form[`wrongAnswer${i + 1}`].value.trim()).filter(Boolean);
      const explanation = form.explanationText.value.trim();

      if (!userKey || !questionText || !correctAnswer) {
        messageBox.textContent = ui.missingFields || "⚠️ Merci de remplir la clé, la question et la bonne réponse.";
        messageBox.style.color = "orange";
        return;
      }

      const validKeys = CONFIG.VALID_KEYS || {};
      const submitted_by = validKeys[userKey];
      if (!submitted_by) {
        messageBox.textContent = ui.invalidKey || "❌ Clé d’accès invalide.";
        messageBox.style.color = "red";
        return;
      }

      const payload = {
        submitted_by,
        questionText,
        correctAnswer,
        wrongAnswers,
        explanation,
        lang: questionLang,
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

    // Marquer le formulaire comme initialisé
    proposeFormInitialized = true;
    proposeFormInitialized = true;
  proposeFormInitialized = true;
}

// 🎯 Affiche la section de proposition avec animation (fade-in)
function showProposeSection() {
  createProposeForm();
  proposeSection.style.display = "block";
  proposeSection.classList.add("fade");
  setTimeout(() => proposeSection.classList.add("show"), 20);
}

// 🚪 Cache la section de proposition avec fade-out (sans effacer les champs)
function hideProposeSection() {
  proposeSection.classList.remove("show");
  setTimeout(() => {
    proposeSection.style.display = "none";
    // Pas de reset du formulaire → on conserve les valeurs
    proposeSection.classList.remove("fade");
  }, FADE_DURATION);
}

// 🔁 Bascule l'affichage du formulaire (et ferme le classement si ouvert)
function toggleProposeSection() {
  const isOpen = proposeSection.style.display === "block";
  hideRankingSection();
  if (isOpen) hideProposeSection();
  else showProposeSection();
}

// 🏆 Affiche la section classement avec animation
function showRankingSection() {
  rankingSection.style.display = "block";
  rankingSection.classList.add("fade");
  setTimeout(() => rankingSection.classList.add("show"), 20);
}

// 🫗 Cache la section classement en douceur
function hideRankingSection() {
  rankingSection.classList.remove("show");
  setTimeout(() => {
    rankingSection.style.display = "none";
    rankingSection.classList.remove("fade");
  }, FADE_DURATION);
}

// 🔁 Bascule l'affichage du classement (et ferme le formulaire si ouvert)
async function toggleRankingSection() {
  const isOpen = rankingSection.style.display === "block";
  hideProposeSection();
  if (isOpen) hideRankingSection();
  else {
    showRankingSection();
    if (typeof loadRanking === "function") await loadRanking();
  }
}




// ============================================================
// 🏆 Chargement du classement (pas affichage)
// ============================================================
async function loadRanking() {
  const list = document.getElementById("rankingList");
  if (!list) return;

  list.innerHTML = `<li>⏳ Chargement...</li>`;

  const rows = await getRanking();

  if (!rows.length) {
    list.innerHTML = `<li>🤷‍♂️ Aucun score trouvé</li>`;
    return;
  }

  // Affichage
list.innerHTML = rows
  .map((r, index) => {
    const [name, score, total, percent] = r;

    // 🧮 convertit 0.8 → 80%
    const pct =
      typeof percent === "number"
        ? Math.round(percent * 100) + "%"
        : String(percent).includes("%")
        ? percent
        : percent + "%";

    // 🥇 🥈 🥉 Médailles
    const medals = ["🥇", "🥈", "🥉"];
    const medal = medals[index] || "";

    // Classe podium
    let rankClass = "";
    if (index === 0) rankClass = "rank-gold";
    else if (index === 1) rankClass = "rank-silver";
    else if (index === 2) rankClass = "rank-bronze";

    return `
      <li class="${rankClass}">
        <span class="player-name">${medal} ${name}</span>
        <span class="player-score">${score} ✅ — ${pct}</span>
      </li>`;
  })
  .join("");

}


