const noms = ["Thomas", "Simon", "Vladimir", "Alexis", "Ludovic", "Sacha", "Maxence", "Le zinc"];

let questions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// 🌟 Nombre total de questions à afficher par partie
const NOMBRE_QUESTIONS = 5;

const mauvaisesReactions = [
  "aie...", "c’était pas ça", "dommage", "raté", "outch", "eh non", "presque", "non non non", "oh lala", "quelle honte"
];
const bonnesReactions = [
  "bien joué", "tu connais tes potes", "haha exact", "trop fort", "tu l’as", "yes", "bingo", "respect", "joli", "clean"
];

async function chargerAccroches() {
  try {
    const response = await fetch("accroches.json");
    const data = await response.json();
    const titre = data.titres[Math.floor(Math.random() * data.titres.length)];
    const sousTitre = data.sousTitres[Math.floor(Math.random() * data.sousTitres.length)];
    document.getElementById("titre").innerText = titre;
    document.getElementById("sousTitre").innerText = sousTitre;
  } catch (error) {
    console.error("Erreur de chargement des accroches :", error);
  }
}

function getRandomNames(exclude) {
  const autres = noms.filter(n => n !== exclude);
  return autres.sort(() => Math.random() - 0.5).slice(0, 3);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 🔀 Fonction utilitaire : mélange les questions et en garde NOMBRE_QUESTIONS
function melangerEtLimiterQuestions(liste) {
  return liste.sort(() => Math.random() - 0.5).slice(0, NOMBRE_QUESTIONS);
}

function demarrerQuiz(listeQuestions) {
  console.log("🎮 Quiz démarré avec", listeQuestions.length, "questions");
  questions = listeQuestions;
  console.log("🧠 Exemple de question reçue :", questions[0]);
  
  shuffledQuestions = melangerEtLimiterQuestions(questions);
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const questionEl = document.getElementById("quizQuestion");
  const answersContainer = document.getElementById("quizAnswers");
  const mini = document.getElementById("miniCommentaire");

  // Fondu sortant
  questionEl.classList.add("fade-out");
  answersContainer.classList.add("fade-out");
  mini.innerText = "";
  mini.classList.remove("visible");

  setTimeout(() => {
    const current = shuffledQuestions[currentQuestionIndex];
    questionEl.innerText = current.question;

    const shuffledAnswers = shuffle([
      current.bonne_reponse,
      ...getRandomNames(current.bonne_reponse)
    ]);

    answersContainer.innerHTML = "";
    shuffledAnswers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.className = "answerBtn";
      button.onclick = () => checkAnswer(answer, current.bonne_reponse);
      answersContainer.appendChild(button);
    });

    questionEl.classList.remove("fade-out");
    answersContainer.classList.remove("fade-out");
    questionEl.classList.add("fade-in");
    answersContainer.classList.add("fade-in");

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
  }, 400);
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll(".answerBtn");
  const mini = document.getElementById("miniCommentaire");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correct) {
      btn.classList.add("correct");
    } else if (btn.innerText === selected) {
      btn.classList.add("incorrect");
    }
  });

  const bonneReponse = selected === correct;
  if (bonneReponse) score++;

  const phrases = bonneReponse ? bonnesReactions : mauvaisesReactions;
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  mini.innerText = phrase;
  mini.classList.add("visible");

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
  document.getElementById("quizAnswers").innerHTML =
    `<p>Tu as eu ${sco
