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

  // 📝 Affiche le texte de la question
  elQ.innerText = q.question;
  elA.innerHTML = "";

  // 🧩 1. Récupère les mauvaises réponses depuis la Google Sheet
  const wrongsRaw = Array.isArray(q.reponses)
    ? q.reponses
    : (typeof q.reponses === "string" ? q.reponses.split(";") : []);

  // 🧹 2. Nettoie les réponses : trim, supprime les vides et les doublons
  const wrongs = wrongsRaw
    .map(r => String(r).trim())
    .filter(r => r.length && r.toLowerCase() !== String(q.bonne_reponse).trim().toLowerCase());

  // 🧯 3. Sécurité : si la Google Sheet n’a pas 3 mauvaises réponses, on complète avec la liste locale
  if (wrongs.length < 3) {
    const backup = getRandomNames(q.bonne_reponse); // depuis ui.js
    for (const name of backup) {
      if (wrongs.length >= 3) break;
      if (!wrongs.includes(name)) wrongs.push(name);
    }
  }

  // 🎲 4. Combine la bonne réponse + les mauvaises et mélange le tout
  const answers = shuffle([q.bonne_reponse, ...wrongs.slice(0, 3)]);

  // 🧱 5. Crée un bouton par réponse
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
