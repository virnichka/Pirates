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
// ============================================================
// 🧩 Debug version : sendUserQuestion (toujours accessible)
// ============================================================

// Vérification du chargement du fichier
document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 api.js chargé — début d'exécution");
});

// Définition au niveau global (pas dans un bloc local)
window.sendUserQuestion = async function (data) {
  console.log("🚀 sendUserQuestion appelée avec :", data);

  if (!window.CONFIG || !CONFIG.GOOGLE_SCRIPT_URL) {
    console.error("❌ CONFIG.GOOGLE_SCRIPT_URL est introuvable !");
    return { status: "error", message: "URL manquante" };
  }

  const url = CONFIG.GOOGLE_SCRIPT_URL;
  const payload = {
    action: "add_user_question",
    ...data,
  };

  console.log("📤 Préparation envoi vers :", url);
  console.log("📦 Données envoyées :", payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Requête envoyée à Google Apps Script (mode no-cors)");
    return { status: "success" };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi à Google Apps Script :", error);
    return { status: "error", message: error.message };
  }
};

// Vérification immédiate que la fonction existe bien globalement
if (typeof window.sendUserQuestion === "function") {
  console.log("🧠 Vérification OK : sendUserQuestion est bien définie globalement ✅");
} else {
  console.error("🚨 Problème : sendUserQuestion n'est PAS définie globalement ❌");
}

// ============================================================
// 🧠 Utilitaire pour récupérer une clé multilingue avec fallback
// ------------------------------------------------------------
function getI18nText(key, fallback) {
  if (window.i18n && window.i18n[key]) return window.i18n[key];
  return fallback;
}

