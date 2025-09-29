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
 * Envoie le score final vers la feuille Google Sheets (version GET compatible GitHub Pages)
 */
async function sendScore(nom, score, total, mode = "general") {
  try {
    // ✅ Construction de l’URL avec paramètres GET
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=sendScore`
      + `&nom=${encodeURIComponent(nom)}`
      + `&score=${encodeURIComponent(score)}`
      + `&total=${encodeURIComponent(total)}`
      + `&mode=${encodeURIComponent(mode)}`;

    console.log("📡 Envoi du score via URL :", url);

    // ✅ Appel en GET (et non POST)
    const response = await fetch(url, { method: "GET" });

    // ✅ Lecture et affichage de la réponse
    const data = await response.json();
    console.log("📤 Score enregistré :", data);

    if (!data.ok) {
      console.warn("⚠️ Réponse non valide :", data);
    }
    return data;
  } catch (err) {
    console.error("❌ Erreur d’envoi du score :

