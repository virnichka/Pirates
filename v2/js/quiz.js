/**
 * 🎮 Gestion du quiz
 */

let questions = [];
let currentQuestion = 0;
let score = 0;

/**
 * Lance le quiz avec une liste de questions
 */
function startQuiz(list) {
  questions = shuffle(list).slice(0, CONFIG.QUIZ_LIMIT);
  currentQuestion = 0;
  score = 0;

  // 🔽 On cache le bouton "Rejouer" dès qu'une nouvelle partie commence
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";

  showQuestion();
}

/**
 * Affiche la question courante
 */
function showQuestion() {
  const q = questions[currentQuestion];
  const elQ = document.getElementById("quizQuestion");
  const elA = document.getElementById("quizAnswers");

  elQ.innerText = q.question;
  elA.innerHTML = "";

  // ✅ Utiliser les mauvaises réponses de la Google Sheet
  const wrongs = Array.isArray(q.reponses)
    ? q.reponses.filter(r => r && r.trim().length > 0)
    : [];

  // ✅ Combiner et mélanger les réponses
  const answers = shuffle([q.bonne_reponse, ...wrongs]);

  // ✅ Créer les boutons de réponses
  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "answerBtn";
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(ans, q.bonne_reponse);
    elA.appendChild(btn);
  });
}

/**
 * Vérifie la réponse sélectionnée
 */
function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".answerBtn");
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add("correct");
    else if (b.textContent === selected) b.classList.add("incorrect");
  });

  if (selected === correct) score++;
  document.getElementById("nextBtn").style.display = "block";
}

/**
 * Passe à la question suivante ou termine le quiz
 */
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else showFinalScore();
}

/**
 * Affiche le score final
 */
function showFinalScore() {
  const total = questions.length;
  const pourcentage = Math.round((score / total) * 100);
  const message = getCommentaire(pourcentage);

  document.getElementById("quizQuestion").innerHTML =
    `Quiz terminé 🎉<br>Tu as eu ${score}/${total} (${pourcentage}%)`;
  document.getElementById("quizAnswers").innerHTML = `<p>${message}</p>`;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";

  const nom = prompt("Entre ton nom pour le classement :");
  if (nom && nom.trim()) sendScore(nom.trim(), score, total);
}
