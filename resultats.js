// 📤 resultats.js

function soumettreScore() {
  const nom = document.getElementById("playerName").value.trim() || "Anonyme";
  envoyerResultat(nom, score, shuffledQuestions.length);
  document.getElementById("quizAnswers").innerHTML += "<p>✅ Score envoyé !</p>";
}

function envoyerResultat(nom, score, total) {
  const params = new URLSearchParams();
  params.append("nom", nom);
  params.append("score", score);
  params.append("total", total);

  // DEBUG – afficher ce qu’on s’apprête à envoyer
  for (let pair of params.entries()) {
    console.log(`📦 ${pair[0]}: ${pair[1]}`);
  }
  console.log("📤 Envoi avec :", nom, score, total);

  fetch("https://script.google.com/macros/s/AKfycbwkVTs1FhApBp_L56ufCDCgnGFail0Seu_d-l4aBc0sRwiWKScWrj_KH_ikRUoybQyW/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Score envoyé :", data);
    })
    .catch(error => {
      console.error("❌ Erreur lors de l'envoi du score :", error);
    });
}




