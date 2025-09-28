/**
 * 🚀 Point d’entrée du quiz
 */

window.onload = async () => {
  try {
    // Charger les accroches
    const accroches = await fetch("data/accroches.json").then(r => r.json());

    // 🔥 Rendre l'objet disponible globalement
    window.ACCROCHES = accroches;

    // Appliquer un titre et un sous-titre aléatoires
    const titre = randomItem(accroches.titres);
    const sousTitre = randomItem(accroches.sousTitres);
    document.getElementById("titre").innerText = titre;
    document.getElementById("sousTitre").innerText = sousTitre;

    // Charger les questions
    const questions = await fetchQuestions();
    if (questions.length > 0) startQuiz(questions);
    else document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  } catch (err) {
    console.error("Erreur lors du démarrage :", err);
  }
};

/**
 * Renvoie un élément aléatoire d’un tableau
 */
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
