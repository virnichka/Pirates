async function chargerQuestionsDepuisGoogle() {
  // Utilise l'URL définie dans config.js
  const url = `${GOOGLE_SCRIPT_URL}?action=getQuestions`;

  try {
    const response = await fetch(url, { cache: "no-store" }); // no-store = toujours les dernières questions
    const data = await response.json();

    if (data.status === "success" && Array.isArray(data.questions)) {
      console.log("✅ Questions chargées depuis Google Sheets :", data.questions);
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

// Exemple : au démarrage du quiz
chargerQuestionsDepuisGoogle().then(questions => {
  if (questions.length > 0) {
    demarrerQuiz(questions); // ta fonction qui lance le quiz
  } else {
    alert("Impossible de charger les questions !");
  }

});
