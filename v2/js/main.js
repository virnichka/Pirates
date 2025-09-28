/**
 * 🚀 Point d’entrée du quiz
 */

window.onload = async () => {
  try {
    // ✅ Charger les accroches et les rendre globales (visibles dans ui.js)
    const response = await fetch("data/accroches.json");
    const accroches = await response.json();
    ACCROCHES = accroches; // ⬅️ pas window.ACCROCHES, juste ACCROCHES global
    console.log("✅ ACCROCHES chargées :", ACCROCHES);

    // 🎯 Appliquer un titre et un sous-titre aléatoires
    const titre = randomItem(ACCROCHES.titres);
    const sousTitre = randomItem(ACCROCHES.sousTitres);
    document.getElementById("titre").innerText = titre;
    document.getElementById("sousTitre").innerText = sousTitre;

    // 📦 Charger les questions
    const questions = await fetchQuestions();
    if (questions.length > 0) startQuiz(questions);
    else document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  } catch (err) {
    console.error("❌ Erreur lors du démarrage :", err);
  }
};

/**
 * Renvoie un élément aléatoire d’un tableau
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
