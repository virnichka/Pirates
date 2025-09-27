const noms = ["Thomas", "Simon", "Vladimir", "Alexis", "Ludovic", "Sacha", "Maxence", "Le zinc"];
const scriptURL = "questions.json";

const miniPhrases = [
  "Trop tard pour reculer",
  "Bien tenté, champion",
  "Pas ouf, hein",
  "La honte continue",
  "Tu le savais pas ?",
  "Encore raté, bravo",
  "Ça sent le mytho",
  "Gros malaise là",
  "On a les preuves",
  "Pire que prévu",
  "Mieux vaut oublier",
  "Continue, on juge",
  "Mais pourquoi t’as cliqué",
  "La commère en chef",
  "On te voit venir",
  "Pas sûr de toi",
  "Y’a des témoins mec",
  "On en parlera",
  "T’as pas honte ?",
  "C’est ton pote ça ?"
];

const miniPhrasesCorrectes = [
  "Trop précis mec",
  "T’étais là c’est sûr",
  "Balanceur repéré",
  "Ça sent la délation",
  "Bien vu, fouineur",
  "Il/elle balance sec",
  "Encore un ragot validé",
  "Le roi du quiz",
  "Pas mal Sherlock",
  "T’as pas hésité",
  "On sent le vécu",
  "Tu connais les dossiers",
  "C’est cramé que tu sais",
  "Trop bien informé",
  "T’as des captures ?",
  "On t’écoute, commère",
  "Champion du ragot",
  "C’est toi la source ?",
  "Bravo, sale balance",
  "On veut les détails"
];

let questions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getRandomNames(exclude) {
  const autres = noms.filter(n => n !== exclude);
  return shuffle(autres).slice(0, 3);
}

async function chargerQuestions() {
  try {
    const response = await fetch(scriptURL);
    const data = await response.json();
    questions = data;
    shuffledQuestions = shuffle([...questions]);
    showQuestion();
  } catch (error) {
    document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  }
}

function showQuestion() {
  const current = shuffledQuestions[currentQuestionIndex];
  const questionContainer = document.getElementById("quizQuestion");
  const answersContainer = document.getElementById("quizAnswers");

  // Reset phrase et bouton
  document.getElementById("miniCommentaire").innerText = "";

  // Animation fade out
  questionContainer.classList.remove("show");
  answersContainer.classList.remove("show");

  setTimeout(() => {
    questionContainer.innerText = current.question;

    const shuffledAnswers = shuffle([
      current.correct,
      ...getRandomNames(current.correct)
    ]);

    answersContainer.innerHTML = "";
    shuffledAnswers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.className = "answerBtn";
      button.onclick = () => checkAnswer(answer, current.correct);
      answersContainer.appendChild(button);
    });

    questionContainer.classList.add("show");
    answersContainer.classList.add("show");

  }, 300);
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".answerBtn");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correct) {
      btn.classList.add("correct");
    } else if (btn.innerText === selected) {
      btn.classList.add("incorrect");
    }
  });

  if (selected === correct) {
    score++;
  }

  // Affiche une petite phrase selon la réponse
  let phrase = "";
  if (selected === correct) {
    phrase = miniPhrasesCorrectes[Math.floor(Math.random() * miniPhrasesCorrectes.length)];
  } else {
    phrase = miniPhrases[Math.floor(Math.random() * miniPhrases.length)];
  }
  document.getElementById("miniCommentaire").innerText = phrase;

  document.getElementById("nextBtn").style.display = "block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  document.getElementById("miniCommentaire").innerText = "";
  const commentaires = [
    "Zéro pointé. T'es sûr que tu fais partie du groupe ? 😅",
    "Une seule bonne réponse… Ça sent le déni ou l'amnésie sélective.",
    "Deux bonnes réponses. Tu veux qu'on te rafraîchisse la mémoire ?",
    "Trois ? Tu connais juste les potins les plus évidents.",
    "Quatre. Tu sauves l'honneur… de justesse.",
    "Cinq bonnes réponses ! Pas mal, t'as bien suivi les histoires.",
    "Six ? On sent que t'as pris des notes dans l’ombre.",
    "Sept ? T'es clairement une commère premium.",
    "Huit sur huit ? Tu ES la honte collective incarnée."
  ];

  const commentaire = commentaires[score] || "Bravo… ou désolé, on sait plus trop.";
  document.getElementById("quizQuestion").innerText = "Quiz terminé !";
  document.getElementById("quizAnswers").innerHTML =
    `<p>Tu as eu ${score} bonne(s) réponse(s) sur ${shuffledQuestions.length}.</p><p>${commentaire}</p>`;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = shuffle([...questions]);
  showQuestion();
}

window.onload = () => {
  chargerQuestions();
};
