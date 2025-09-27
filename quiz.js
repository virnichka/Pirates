// 🧠 quiz.js
const noms = ["Thomas", "Simon", "Vladimir", "Alexis", "Ludovic", "Sacha", "Maxence", "Le zinc"];
const questionsURL = "https://virnichka.github.io/Pirates/questions.json";
const accrochesURL = "https://virnichka.github.io/Pirates/accroches.json";

let questions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let titres = [];
let sousTitres = [];

async function chargerAccroches() {
  try {
    const response = await fetch(accrochesURL);
    const data = await response.json();
    titres = data.titres;
    sousTitres = data.sousTitres;
    afficherAccroches();
  } catch (e) {
    console.error("Erreur de chargement des accroches", e);
  }
}

function afficherAccroches() {
  const titre = titres[Math.floor(Math.random() * titres.length)];
  const sousTitre = sousTitres[Math.floor(Math.random() * sousTitres.length)];
  document.getElementById("titre").innerText = titre;
  document.getElementById("sousTitre").innerText = sousTitre;
}

async function chargerQuestions() {
  try {
    const response = await fetch(questionsURL);
    const data = await response.json();
    questions = data;
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    showQuestion();
  } catch (error) {
    document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  }
}

function getRandomNames(exclude) {
  const autres = noms.filter(n => n !== exclude);
  return autres.sort(() => Math.random() - 0.5).slice(0, 3);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const current = shuffledQuestions[currentQuestionIndex];
  const questionContainer = document.getElementById("quizQuestion");
  const answersContainer = document.getElementById("quizAnswers");

  // Étape 1 : ajoute l'effet de fondu (on cache)
  questionContainer.classList.remove("show");
  answersContainer.classList.remove("show");

  setTimeout(() => {
    // Étape 2 : met à jour le contenu après disparition
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

    // Étape 3 : fait réapparaître en douceur
    questionContainer.classList.add("show");
    answersContainer.classList.add("show");

  }, 300); // délai de disparition
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
  document.getElementById("quizAnswers").innerHTML = `
    <p>Tu as eu ${score} bonne(s) réponse(s) sur ${shuffledQuestions.length}.</p>
    <p>${commentaire}</p>
    <p><label for="playerName">Ton prénom :</label><br>
    <input type="text" id="playerName" placeholder="Ton blaze ici"></p>
    <button onclick="soumettreScore()">Envoyer mon score</button>
  `;
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  showQuestion();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  const btn = document.getElementById("toggleThemeBtn");
  btn.innerText = isLight ? "Basculer en thème sombre" : "Basculer en thème clair";
}

window.onload = () => {
  chargerAccroches();
  chargerQuestions();
  toggleTheme(); toggleTheme();
};
