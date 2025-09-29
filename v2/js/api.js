/**
 * 🔗 API – Communication avec Google Apps Script
 * ------------------------------------------------------------
 *  Contient :
 *   - fetchQuestions() → récupère les questions selon le mode
 *   - sendScore() → envoie le score final à la feuille "scores"
 * ------------------------------------------------------------
 */


/**
 * ==============================================
 *  🧩 Chargement des questions selon le mode choisi
 * ==============================================
 */
async function fetchQuestions(mode = null) {
  try {
    // 1️⃣ Récupère le mode sélectionné ou "general" par défaut
    const selectedMode = mode || localStorage.getItem("selectedMode") || "general";

    // 2️⃣ Construit l’URL vers ton Google Apps Script
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=getQuestions&sheet=${encodeURIComponent(selectedMode)}`;

    console.log("🌐 URL API utilisée :", url);

    // 3️⃣ Récupère les données
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

    console.log(`✅ ${questions.length} questions chargées pour le mode "${selectedMode}"`);
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
    // 1️⃣ Construction de l’URL
    const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=sendScore`
      + `&nom=${encodeURIComponent(nom)}`
      + `&score=${encodeURIComponent(score)}`
      + `&total=${encodeURIComponent(total)}`
      + `&mode=${encodeURIComponent(mode)}`
      + `&_t=${Date.now()}`; // évite le cache navigateur

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
