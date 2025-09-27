// 📤 resultats.js

function soumettreScore() {
  const nom = document.getElementById("playerName").value.trim() || "Anonyme";
  envoyerResultat(nom, score, shuffledQuestions.length);
  document.getElementById("quizAnswers").innerHTML += "<p>✅ Score envoyé !</p>";
}

// 🔁 Remplace ici par l'URL exacte de TON script Google Apps Script
function envoyerResultat(nom, score, total) {
  fetch("https://script.google.com/macros/s/AKfycbw91fMdYaGQPYnpzMkEIbUADTN3np_8jmXCCS-Bk2u3KUAdvDmjLQ4D8AfPcttHAt5-/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nom: nom,
      score: score,
      total: total
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("✅ Score envoyé :", data);
  })
  .catch(error => {
    console.error("❌ Erreur lors de l'envoi du score :", error);
  });
}
