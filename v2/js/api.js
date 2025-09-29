/**
 * 🔗 API : gestion des échanges avec Google Apps Script
 */

/**
 * ==============================================
 *  Chargement des questions selon le mode choisi
 * ==============================================
 */
async function fetchQuestions(mode = null) {
  console.log("URL API utilisée :", CONFIG?.GOOGLE_SCRIPT_URL);

  try {
    // 1️⃣ Récupère le mode sélectionné (ou celui sauvegardé)
    const selectedMode = mode || localStorage.getItem("selectedMode") || "general";

    // 2️⃣ Construit l’URL vers ton Apps Script
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=getQuestions&sheet=${encodeURIComponent(selectedMode)}`;

    // 3️⃣ Récupération des données
    const response = await fetch(url);
    const questions = await response.json();

    console.log(`✅ Questions chargées depuis "${selectedMode}" (${questions.length} lignes)`);
    return questions;
  } catch (err) {
    console.error("❌ Erreur lors du chargement des questions :", err);
    return [];
  }
}


/**
 * Envoie le score final vers la feuille Google Sheets
 * Compatible GitHub Pages (GET → évite CORS)
 */
async function sendScore(nom, score, total, mode = "general") {
  try {
    // ✅ Construction de l’URL avec paramètres GET
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=sendScore`
      + `&nom=${encodeURIComponent(nom)}`
      + `&score=${encodeURIComponent(score)}`
      + `&total=${encodeURIComponent(total)}`
      + `&mode=${encodeURIComponent(mode)}`
      + `&_t=${Date.now()}`; // anti-cache

    console.log("📡 Envoi du score via URL :", url);

    // ✅ Appel en GET (aucun CORS)
    const response = await fetch(url, { method: "GET", cache: "no-store" });

    // ⚠️ Sécurise le parsing JSON (si la réponse est vide)
    let data;
    try {
      data = await response.json();
    } catch {
      data = { ok: false, message: "Réponse non JSON" };
    }

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
