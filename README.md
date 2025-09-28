# 🎯 Quiz Entre Potes — README

> Un petit quiz “entre pirates” qui tire ses questions d’une Google Sheet et envoie les scores vers la même Sheet, le tout servi sur GitHub Pages.

- **Démo** : `https://<ton-user>.github.io/<repo>/v2/`
- **Tech** : HTML/CSS/JS (vanilla) + Google Apps Script (backend minimal)
- **Mode d’hébergement** : GitHub Pages
- **Données** : Google Sheets (onglets `questions`, `scores`, `log_debug`) + `data/accroches.json` pour les titres/sous-titres/commentaires finaux

---

## 1) Mode d’emploi (utilisateur)

1. Ouvre la page du quiz (ex : `/v2/`).
2. Choisis une réponse à chaque question (5 par partie par défaut).
3. Clique **Suivant** pour passer à la question suivante.
4. À la fin, entre ton **prénom/pseudo** pour enregistrer ton score.
5. Clique **Rejouer** pour relancer une partie.
6. Option : utilise **Basculer le thème** pour passer clair/sombre.

---

## 2) Vue d’ensemble

### Fonctionnement (schéma simplifié)

1. **Chargement de l’UI**
   `index.html` charge `js/ui.js` (utilitaires et thème), `js/api.js` (accès Apps Script), `js/quiz.js` (logique du quiz), `js/main.js` (démarrage).
2. **Accroches (titres/sous-titres/phrases finales)**
   `main.js` charge `data/accroches.json`, les expose globalement et affiche un titre/sous-titre aléatoires.
3. **Questions**
   `api.js` appelle ton **Web App Google Apps Script** avec `?action=getQuestions`.
4. **Partie**
   `quiz.js` mélange et limite à `CONFIG.QUIZ_LIMIT` questions, affiche les réponses, vérifie, colore **vert/rouge**, calcule le score.
5. **Scores**
   `api.js` envoie le score (`nom`, `score`, `total`) **en `application/x-www-form-urlencoded`** au même Apps Script (pas de preflight CORS).

---

## 3) Arborescence (V2)

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

(… texte complet comme décrit précédemment …)
