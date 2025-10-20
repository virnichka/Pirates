/**
 * 🔗 API – Communication avec Google Apps Script
 * ------------------------------------------------------------
 *  Contient :
 *   - fetchQuestions() → récupère les questions selon le mode
 *   - sendScore() → envoie le score final à la feuille "scores"
 * ------------------------------------------------------------
 */

/* ==============================================
 *  🧩 Chargement des questions selon le mode et la langue
 * ==============================================*/
async function fetchQuestions(mode = null) {
  try {
    // 1️⃣ Récupère le mode sélectionné ou "general" par défaut
    const selectedMode = mode || localStorage.getItem("selectedMode") || "general";

    // 2️⃣ Récupère la langue active du site (par défaut : fr)
    const currentLang = window.currentLang || localStorage.getItem("lang") || "fr";

    // 3️⃣ Construit l’URL vers ton Google Apps Script
    // On récupère la limite de questions depuis le fichier config.js
    const limit = CONFIG.QUIZ_LIMIT || 5;
    // Ajout du paramètre shuffle=1 pour demander un tirage aléatoire
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=getQuestions&sheet=${encodeURIComponent(selectedMode)}&lang=${encodeURIComponent(currentLang)}&limit=${limit}&shuffle=1`;

    console.log("🌐 URL API utilisée :", url);

    // 4️⃣ Appel API (GET)
    const response = await fetch(url, { method: "GET", cache: "no-store" });

    if (!response.ok) {
      console.warn(`⚠️ Erreur HTTP (${response.status})`);
      return [];
    }

    const questions = await response.json();

    if (!Array.isArray(questions)) {
      console.warn("⚠️ Réponse inattendue :", questions);
      return [];
    }

    console.log(`✅ ${questions.length} questions chargées (${selectedMode}, ${currentLang})`);
    return questions;

  } catch (err) {
    console.error("❌ Erreur lors du chargement des questions :", err);
    return [];
  }
}


/**
 * ==============================================
 *  📤 Envoi du score vers Google Sheets
 * ==============================================
 *  → Utilise une requête GET pour contourner le CORS
 *  → Données visibles dans la feuille “scores”
 */
async function sendScore(nom, score, total, mode = "general") {
  try {
    // 1️⃣ Construction de l’URL complète sur une seule ligne (évite les erreurs de parsing)
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=sendScore&nom=${encodeURIComponent(nom)}&score=${encodeURIComponent(score)}&total=${encodeURIComponent(total)}&mode=${encodeURIComponent(mode)}&_t=${Date.now()}`;

    console.log("📡 Envoi du score via URL :", url);

    // 2️⃣ Appel GET
    const response = await fetch(url, { method: "GET", cache: "no-store" });

    // 3️⃣ Vérifie la validité de la réponse
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.warn("⚠️ Réponse non JSON :", err);
      data = { ok: false, message: "Réponse non JSON" };
    }

    // 4️⃣ Log console
    console.log("📤 Score enregistré :", data);

    if (!data.ok) {
      console.warn("⚠️ Réponse non valide :", data);
    }

    return data;

  } catch (err) {
    console.error("❌ Erreur d’envoi du score :", err);
    return { ok: false, error: err.message };
  }
}



// ============================================================
// 📩 Gestion de la soumission de la question utilisateur (multilingue + animation)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const proposeSection = document.getElementById("proposeSection");
  const form = document.getElementById("submitQuestionForm");
  const sendBtn = document.getElementById("sendQuestionBtn");
  const messageBox = document.createElement("div");
  messageBox.id = "sendMessage";
  messageBox.classList.add("send-status");
  proposeSection.appendChild(messageBox);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    sendBtn.disabled = true;
    sendBtn.textContent = getI18nText("ui.sending", "📤 Envoi en cours...");
    messageBox.textContent = "";

    console.log("🟢 Chargement de api.js commencé");
    const data = collectQuestionData(); // fonction existante dans ton code

    try {
      console.log("🟢 Déclaration de sendUserQuestion()");
      const result = await sendUserQuestion(data);

      if (result.status === "success") {
        messageBox.textContent = getI18nText("ui.sendSuccess", "✅ Question envoyée avec succès ! Merci 🙌");
        messageBox.style.color = "green";

        // Animation fade-out douce avant masquage
        proposeSection.classList.add("fade-out");
        setTimeout(() => {
          proposeSection.style.display = "none";
          form.reset();
          proposeSection.classList.remove("fade-out");
        }, 1000);
      } else {
        messageBox.textContent = getI18nText("ui.sendError", "⚠️ Erreur lors de l'envoi. Réessaie plus tard.");
        messageBox.style.color = "orange";
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      messageBox.textContent = getI18nText("ui.networkError", "❌ Une erreur est survenue pendant l'envoi.");
      messageBox.style.color = "red";
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = getI18nText("ui.sendButton", "📤 Envoyer");
    }
  });
});

// ============================================================
// 🧠 Utilitaire pour récupérer une clé multilingue avec fallback
// ------------------------------------------------------------
function getI18nText(key, fallback) {
  if (window.i18n && window.i18n[key]) return window.i18n[key];
  return fallback;
}

