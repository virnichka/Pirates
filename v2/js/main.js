/**
 * 🚀 Point d’entrée du quiz
 */

window.onload = async () => {
  try {
    // ✅ Charger et rendre global immédiatement
    window.ACCROCHES = await fetch("data/accroches.json").then(r => r.json());
    console.log("✅ ACCROCHES chargées :", ACCROCHES);

    // ✅ Sélectionner un titre et un sous-titre aléatoires
    const titre = randomItem(ACCROCHES.titres);
    const sousTitre = randomItem(ACCROCHES.sousTitres);

    document.getElementById("titre").innerText = titre;
    document.getElementById("sousTitre").innerText = sousTitre;

    // ✅ Charger les questions et démarrer le quiz
    const questions = await fetchQuestions();
    if (questions.length > 0) startQuiz(questions);
    else document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  } catch (err) {
    console.error("❌ Erreur lors du démarrage :", err);
  }
};

/**
 * 🔁 Renvoie un élément aléatoire d’un tableau
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
