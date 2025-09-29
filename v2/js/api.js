/**
 * 🔗 API : gestion des échanges avec Google Apps Script
 */

/**
 * ==============================================
 *  Chargement des questions selon le mode choisi
 * ==============================================
 */
async function fetchQuestions(mode = null) {
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
 * Envoie le score final vers la feuille Google Sheets.
 */
async function sendScore(nom, score, total) {
  try {
    const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ nom, score, total })
    });

    const data = await response.json();
    console.log("📤 Score envoyé :", data);
  } catch (err) {
    console.error("❌ Erreur d’envoi du score :", err);
  }
}
