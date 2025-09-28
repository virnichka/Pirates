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

function commentairePour(score, total) {
  const pct = Math.round((score / total) * 100);

  if (pct === 100) return "Parfait ! 100% — tu es la commère en chef. 👑";
  if (pct >= 80)  return "Excellent, tu connais tes potes par cœur. 🔥";
  if (pct >= 60)  return "Pas mal, t'as bien suivi les histoires. 😉";
  if (pct >= 40)  return "Moyen… il te manque quelques potins. 🤏";
  if (pct >= 20)  return "Ouch… on dirait que t'étais pas là. 😬";
  if (pct > 0)    return "Une petite lueur d'espoir… 🌤️";
  return "Zéro pointé. T'es sûr que tu fais partie du groupe ? 😅";
}

function showFinalScore() {
  const total = shuffledQuestions.length;
  const commentaire = commentairePour(score, total); // ⬅️ calcul dynamique du message
  const pourcentage = Math.round((score / total) * 100);
  
  // 🧾 Affichage du score et du commentaire
  document.getElementById("quizQuestion").innerText = "Quiz terminé !";

  document.getElementById("quizAnswers").innerHTML =
    `<p>Tu as eu ${score} bonne(s) réponse(s) sur ${total} (${pourcentage}%).</p><p>${commentaire}</p>`;

  // 🎛️ Réglage des boutons
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "block";

  // 💬 Réinitialisation du mini-commentaire
  const mini = document.getElementById("miniCommentaire");
  mini.innerText = "";
  mini.classList.remove("visible");

  // 🧍‍♂️ Envoi du résultat à Google Sheets
  const nom = prompt("Entre ton nom pour le classement :");
  if (nom && nom.trim() !== "") {
    envoyerResultat(nom.trim(), score, total);
  }
}


function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = melangerEtLimiterQuestions(questions);
  showQuestion();
}

window.onload = async () => {
  chargerAccroches();
  const questions = await chargerQuestionsDepuisGoogle();
  if (questions.length > 0) {
    demarrerQuiz(questions);
  } else {
    document.getElementById("quizQuestion").innerText = "Erreur de chargement du quiz.";
  }
};
