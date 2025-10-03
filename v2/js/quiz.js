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

  // Cela supprime le style dès qu’un nouveau quiz commence —
  document.getElementById("quizQuestion").classList.remove("finished");
  document.getElementById("quizAnswers").classList.remove("finished");
  
  showQuestion();
}

/**
 * Affiche la question courante
 */
function showQuestion() {
  const q = questions[currentQuestion];
  const elQ = document.getElementById("quizQuestion");
  const elA = document.getElementById("quizAnswers");
  const nextBtn = document.getElementById("nextBtn");
  const commentaireEl = document.getElementById("miniCommentaire");


// 🔄 Réinitialise le commentaire/explication précédente
if (commentaireEl) {
  commentaireEl.style.display = "none";
  commentaireEl.textContent = "";
}



  // cache le bouton suivant
  if (nextBtn) nextBtn.style.display = "none";

  //  debog console vue question
  console.log("Question actuelle :", q);


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
    // Normalisation : tout en texte, sans espaces ni casse
const btnText = String(b.textContent).trim().toLowerCase();
const correctText = String(correct).trim().toLowerCase();
const selectedText = String(selected).trim().toLowerCase();

if (btnText === correctText) b.classList.add("correct");
else if (btnText === selectedText) b.classList.add("incorrect");

  });

  if (selected === correct) score++;
  document.getElementById("nextBtn").style.display = "block";
  
// 🎓 Affiche l'explication de la réponse (si disponible)
const commentaireEl = document.getElementById("miniCommentaire");
const current = questions && questions[currentQuestion] ? questions[currentQuestion] : null;
if (!current || !commentaireEl) return;

const explication = current.explication;
if (explication) {
  commentaireEl.textContent = explication;
  commentaireEl.style.display = "block";
  commentaireEl.classList.add("visible");   // 👈 rend visible avec fondu
} else {
  commentaireEl.classList.remove("visible"); // 👈 cache si pas d'explication
  commentaireEl.style.display = "none";
}




}

/**
 * Passe à la question suivante ou termine le quiz
 */
function nextQuestion() {
  const nextBtn = document.getElementById("nextBtn");
  
  // on cache le bouton suivant
  if (nextBtn) nextBtn.style.display = "none";
  
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

  document.getElementById("quizQuestion").innerHTML = `
  <div class="final-card">
    <h2>Quiz terminé 🎉</h2>
    <p><strong>Tu as eu ${score}/${total} (${pourcentage}%)</strong></p>
    <p>${message}</p>
  </div>
`;

document.getElementById("quizAnswers").innerHTML = "";


  // 🎨 Ajout : applique le style "carte de résultat"
  document.getElementById("quizQuestion").classList.add("finished");
  
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";

  const nom = prompt("Entre ton nom pour le classement :");
  if (nom && nom.trim()) sendScore(nom.trim(), score, total);
}
