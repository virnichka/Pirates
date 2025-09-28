🎯 Quiz Entre Potes — README

Un petit quiz “entre pirates” qui tire ses questions d’une Google Sheet et envoie les scores vers la même Sheet, le tout servi sur GitHub Pages.

Démo : https://<ton-user>.github.io/<repo>/v2/

Tech : HTML/CSS/JS (vanilla) + Google Apps Script (backend minimal)

Mode d’hébergement : GitHub Pages

Données : Google Sheets (onglets questions, scores, log_debug) + data/accroches.json pour les titres/sous-titres/commentaires finaux

1) Mode d’emploi (utilisateur)

Ouvre la page du quiz (ex : /v2/).

Choisis une réponse à chaque question (5 par partie par défaut).

Clique Suivant pour passer à la question suivante.

À la fin, entre ton prénom/pseudo pour enregistrer ton score.

Clique Rejouer pour relancer une partie.

Option : utilise Basculer le thème pour passer clair/sombre.

2) Vue d’ensemble
Fonctionnement (schéma simplifié)

Chargement de l’UI
index.html charge js/ui.js (utilitaires et thème), js/api.js (accès Apps Script), js/quiz.js (logique du quiz), js/main.js (démarrage).

Accroches (titres/sous-titres/phrases finales)
main.js charge data/accroches.json, les expose globalement et affiche un titre/sous-titre aléatoires.

Questions
api.js appelle ton Web App Google Apps Script avec ?action=getQuestions.
La réponse JSON ressemble à :

{ "status":"success", "questions":[
  { "question":"...", "bonne_reponse":"..." }
]}


Partie
quiz.js mélange et limite à CONFIG.QUIZ_LIMIT questions, affiche les réponses, vérifie, colore vert/rouge, calcule le score.

Scores
api.js envoie le score (nom, score, total) en application/x-www-form-urlencoded au même Apps Script (pas de preflight CORS).
Apps Script écrit dans l’onglet scores et journalise dans log_debug.

3) Arborescence (V2)
v2/
├─ index.html
├─ css/
│  └─ style.css
├─ data/
│  └─ accroches.json
└─ js/
   ├─ config.js
   ├─ api.js
   ├─ ui.js
   ├─ quiz.js
   └─ main.js

Rôle des fichiers

index.html : structure de la page, inclusion des scripts dans le bon ordre.

css/style.css : thème sombre/clair, styles des boutons, états correct/incorrect robustes.

data/accroches.json :

titres (10)

sousTitres (10)

commentairesFin (clés 0,10,20,30,40,50,70,80,90,100)

js/config.js : configuration (URL Apps Script, nombre de questions).

js/api.js : appels réseau vers Apps Script (GET questions, POST score).

js/ui.js : utilitaires d’UI (thème, mélange, choix de prénoms, choix du commentaire final à partir des paliers).

js/quiz.js : logique de jeu (start, showQuestion, checkAnswer, next, showFinal).

js/main.js : point d’entrée (charge accroches.json, fixe titre/sous-titre, charge questions, lance la partie).

4) Configuration (V2)
js/config.js
/**
 * 🌍 Configuration globale du quiz
 */
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  QUIZ_LIMIT: 5 // nombre de questions par partie
};


GOOGLE_SCRIPT_URL : URL du déploiement Web App de ton Apps Script.

QUIZ_LIMIT : nombre de questions utilisées par partie (les questions sont mélangées).

❗️Si tu déplaces la config dans index.html, veille à supprimer le doublon et à conserver une seule source de vérité.

5) Google Apps Script (backend)
A. Pré-requis côté Google Sheet

Crée un spreadsheet avec 3 onglets :

questions : colonnes minimales

question (texte)

bonne_reponse (texte)
(Tu peux ajouter reponses si tu veux fournir tes distracteurs toi-même, mais V2 génère 3 noms « pirates » automatiquement.)

scores : (sera rempli automatiquement)

date, nom, score, total, source, version

log_debug : (facultatif) journaux textuels

B. Script .gs (extrait type utilisé)
const VERSION = "v3.4";

function doPost(e) {
  if (!e) return error("Aucune donnée reçue");
  try {
    const p = (e.parameter || {});
    const nom   = p.nom   || "Inconnu";
    const score = +p.score || 0;
    const total = +p.total || 0;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("scores");
    if (!sheet) return error("Feuille 'scores' introuvable");

    sheet.appendRow([new Date(), nom, score, total, "parameter", VERSION]);
    return json({ status: "success", message: "Score ajouté", source: "parameter", version: VERSION });
  } catch (err) {
    return error(err.message);
  }
}

function doGet(e) {
  const action = e?.parameter?.action || "";
  if (action === "getQuestions") return getQuestions();
  return json({ ok: true, hint: "Utilisez ?action=getQuestions", version: VERSION });
}

function getQuestions() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("questions");
  const data = sh.getDataRange().getValues();
  const headers = data.shift();
  const questions = data.map(r => {
    const q = {};
    headers.forEach((h,i) => q[h] = r[i]);
    // option : q.reponses &&= String(q.reponses).split(";").map(s => s.trim());
    return q;
  });
  return json({ status: "success", questions });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function error(msg) { return json({ status: "error", message: msg, version: VERSION }); }

C. Déploiement du Web App

Déployer > Gérer les déploiements > Nouveau déploiement

Type : Application Web

Exécuter en tant que : moi

Qui a accès : Tout le monde

Copier l’URL → renseigner CONFIG.GOOGLE_SCRIPT_URL

ℹ️ Pour éviter les erreurs CORS, sendScore poste en application/x-www-form-urlencoded (pas de preflight).

6) API côté front (V2)
js/api.js — Récupération des questions
async function fetchQuestions() {
  const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=getQuestions`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  if (data.status === "success" && Array.isArray(data.questions)) {
    console.log("✅ Questions chargées :", data.questions.length);
    return data.questions;
  }
  console.warn("⚠️ Chargement questions :", data.message);
  return [];
}

js/api.js — Envoi du score (form-urlencoded)
async function sendScore(nom, score, total) {
  const body = new URLSearchParams({ nom, score, total }).toString();
  const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });
  const data = await res.json();
  console.log("📤 Score envoyé :", data);
}

7) Logique de jeu (V2)
js/quiz.js — Principales fonctions

startQuiz(list) : mélange, limite à CONFIG.QUIZ_LIMIT, remet les compteurs, affiche la 1ʳᵉ question.

showQuestion() : injecte l’énoncé et 4 boutons de réponses (1 bonne + 3 noms aléatoires).

checkAnswer(selected, correct) : désactive les boutons, colore .correct / .incorrect, rend visible Suivant.

nextQuestion() : itère, sinon fin.

showFinalScore() :

calcule %

récupère un commentaire final via getCommentaire(pourcentage) (dans ui.js, basé sur data/accroches.json)

demande le nom et appelle sendScore(nom, score, total)

n’affiche Rejouer qu’à la fin

Les couleurs de validation (vert/rouge) sont forcées en CSS avec !important pour être identiques en clair/sombre.

8) Personnalisation
A. Accroches, sous-titres, commentaires finaux

Édite v2/data/accroches.json :

{
  "titres": ["...", "..."],
  "sousTitres": ["...", "..."],
  "commentairesFin": {
    "0": "…",
    "10": "…",
    "20": "…",
    "30": "…",
    "40": "…",
    "50": "…",
    "70": "…",
    "80": "…",
    "90": "…",
    "100": "…"
  }
}


La sélection du commentaire se fait par palier : le plus grand seuil ≤ au % obtenu.

B. Nombre de questions

CONFIG.QUIZ_LIMIT dans js/config.js.

C. Thème & style

Tout est dans css/style.css.
Couleurs des boutons correct/incorrect robustes (fonctionnent dans les 2 thèmes).

9) Publication GitHub Pages

Settings → Pages → Source = Deploy from a branch → Branche main / dossier /root

L’URL publique ressemble à :
https://<ton-user>.github.io/<repo>/
La V2 est servie depuis :
https://<ton-user>.github.io/<repo>/v2/

Si la page ne reflète pas la dernière version, fais un hard refresh :
Windows Ctrl + F5, macOS Cmd + Shift + R.

10) Dépannage (FAQ)

404 sur style.css : le chemin doit être css/style.css (et pas style.css).

CORS / preflight bloqué : vérifie sendScore en application/x-www-form-urlencoded + déploiement Web App public.

“Commentaires finaux non trouvés” :

Vérifie le chargement de data/accroches.json (ouvre l’onglet Network).

L’ordre des scripts dans index.html : ui.js avant main.js.

Dans la console : ACCROCHES doit contenir {titres, sousTitres, commentairesFin}.

Questions vides :

Teste l’API : https://script.google.com/.../exec?action=getQuestions (tu dois voir un JSON).

Vérifie l’onglet questions et les en-têtes de colonnes.

11) Versioning

V1 : ancienne version à la racine (code monolithique).

V2 : nouvelle version modulaire dans le dossier v2/.
Tu peux faire cohabiter les deux (utile pour migrer progressivement).

12) Licence

Projet privé / usage personnel entre amis.
Adapte la licence si tu souhaites le rendre public.

13) Contribuer / Travailler avec une IA

Le cœur du fonctionnement et les conventions sont décrits ici.

En cas d’évolution, mettre à jour :

js/config.js (URL Apps Script, limites)

data/accroches.json (phrases)

README (éventuel changement de structure)
