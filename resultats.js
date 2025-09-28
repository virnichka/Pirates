// 📤 resultats.js

function soumettreScore() {
  const nom = document.getElementById("playerName").value.trim() || "Anonyme";
  envoyerResultat(nom, score, shuffledQuestions.length);
  document.getElementById("quizAnswers").innerHTML += "<p>✅ Score envoyé !</p>";
}

function envoyerResultat(nom, score, total) {
  const formData = new FormData();
  formData.append("nom", nom);
  formData.append("score", score);
  formData.append("total", total);

  // DEBUG – afficher tout le contenu du formData
  for (let pair of formData.entries()) {
    console.log(`📦 ${pair[0]}: ${pair[1]}`);
  }

  // DEBUG – afficher ce qu’on s’apprête à envoyer
  console.log("📤 Envoi avec :", nom, score, total);


  fetch("https://script.google.com/macros/s/AKfycbwkVTs1FhApBp_L56ufCDCgnGFail0Seu_d-l4aBc0sRwiWKScWrj_KH_ikRUoybQyW/exec", {
    method: "POST",
    body: formData
  })
    .then(response => response.json()) // ✅ Important ici
    .then(data => {
      console.log("✅ Score envoyé :", data);
    })
    .catch(error => {
      console.error("❌ Erreur lors de l'envoi du score :", error);
    });
}



