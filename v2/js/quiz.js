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
  // Les questions sont limitées et mélangées côté serveur 
  questions = list;
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
 * 🎯 Affiche le score final
 */
function showFinalScore() {
  const total = questions.length;
  const pourcentage = Math.round((score / total) * 100);
  const message = getCommentaire(pourcentage);

  // 🧼 Nettoyer le texte explicatif à la fin du quiz
  const miniComment = document.getElementById("miniCommentaire");
  if (miniComment) {
    miniComment.innerText = "";
    miniComment.style.display = "none";
  }


  // 🧩 Récupère les textes de l'interface selon la langue
  const ui = window.TEXTS?.ui || {};

  // 🧱 Construit le contenu HTML à afficher
  const html = `
    <div class="final-card">
      <h2>${ui.quizFinished || "Quiz terminé 🎉"}</h2>
      <p><strong>${ui.youGot || "Tu as eu"} ${score}/${total} (${pourcentage}%)</strong></p>
      <p>${message}</p>
    </div>
  `;

  // 🧩 Injection dans le DOM
  const questionEl = document.getElementById("quizQuestion");
  const answersEl = document.getElementById("quizAnswers");

  if (questionEl) {
    questionEl.innerHTML = html;
    questionEl.classList.add("finished");
  }

  if (answersEl) answersEl.innerHTML = "";

  // 🎮 Boutons : on cache "Suivant", on affiche "Rejouer"
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";

  // 🏆 Classement (optionnel)
  const nom = prompt(ui.enterName || "Entre ton nom pour le classement :");
  if (nom && nom.trim()) sendScore(nom.trim(), score, total);
}


/**
 * 🔄 Relance un nouveau quiz complet
 * Recharge les questions depuis le serveur avant de recommencer.
 */
async function restartQuiz() {
  try {
    const selectedMode = localStorage.getItem("selectedMode") || "general";
    const lang = localStorage.getItem("lang") || "fr";

    // 🔤 Récupération des textes selon la langue
    const uiTexts = (window.TEXTS && window.TEXTS.ui) || {};

    const loadingMsg = uiTexts.loading || "⏳ " + (uiTexts.loading || "Chargement du quiz...");
    const errorMsg = uiTexts.errorLoading || "Erreur lors du chargement du quiz 😕";
    const noQuestionsMsg = uiTexts.noQuestions || "Impossible de charger un nouveau quiz 😕";

    // 🧼 Réinitialise l’affichage avant le rechargement
    const questionEl = document.getElementById("quizQuestion");
    const answersEl = document.getElementById("quizAnswers");
    const finalEl = document.getElementById("quizFinal");

    if (finalEl) finalEl.style.display = "none";
    if (questionEl) questionEl.innerText = loadingMsg;
    if (answersEl) answersEl.innerHTML = "";

    // 🔁 Recharge les questions depuis le script Google
    const newQuestions = await fetchQuestions(selectedMode);

    if (newQuestions && newQuestions.length > 0) {
      console.log(`✅ Nouvelles questions chargées (${selectedMode}, ${lang})`);
      startQuiz(newQuestions);
    } else {
      questionEl.innerText = noQuestionsMsg;
    }

  } catch (err) {
    console.error("❌ Erreur lors du redémarrage du quiz :", err);
    const uiTexts = (window.TEXTS && window.TEXTS.ui) || {};
    const errorMsg = uiTexts.errorLoading || "Erreur lors du rechargement du quiz.";
    const questionEl = document.getElementById("quizQuestion");
    if (questionEl) questionEl.innerText = errorMsg;
  }
}


