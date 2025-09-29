/**
 * 🔗 API : gestion des échanges avec Google Apps Script
 */

/**
 * Récupère les questions depuis la feuille Google Sheets.
 * @returns {Promise<Array>} - Liste des questions.
 */
async function fetchQuestions() {
  const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=getQuestions`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success") {
      console.log("✅ Questions chargées :", data.questions.length);
      console.log("Questions reçues depuis Google Sheet :", data.questions);
      return data.questions;
    } else {
      console.error("⚠️ Erreur de chargement :", data.message);
      return [];
    }
  } catch (err) {
    console.error("❌ Erreur réseau :", err);
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
