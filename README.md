
# 📘 WithMe -- Plateforme de quiz interactive

## 🎯 Description

**WithMe** est une plateforme web interactive permettant aux
utilisateurs de jouer à des quiz selon plusieurs modes, langues et
thèmes.\
Elle est conçue pour être simple, fluide et responsive, tout en
permettant à la communauté de proposer de nouvelles questions
directement depuis l'interface.

------------------------------------------------------------------------

## 🚀 Fonctionnalités principales

### 🎮 Modes de jeu

-   **Général 🦁**
-   **Fun 🤪**
-   **Full Dark 🏴‍☠️** (mode caché avec mot de passe défini dans
    `config.js`)

### 🌍 Multilingue

Le site prend en charge plusieurs langues (Français, Anglais, Espagnol,
Roumain).\
Les textes sont gérés dans le fichier `texts.json` et traduits
automatiquement selon la langue sélectionnée.

### 📤 Soumission de questions

Les utilisateurs peuvent proposer leurs propres questions : clé d'accès,
question, bonne réponse, six mauvaises réponses, catégorie.\
L'interface affiche un retour visuel fluide (messages localisés,
animation fade) et envoie les données au script Google configuré.

### ☁️ Intégration Google Sheets

Toutes les données sont centralisées dans un **tableur Google Sheets**
:\
- Feuille `scores` : enregistre les résultats.\
- Feuille `questions_users` : reçoit les propositions des utilisateurs.\
Un script Google Apps Script reçoit les données via `doPost(e)` et les
insère dans la feuille correspondante.

------------------------------------------------------------------------

## ⚙️ Structure du projet

    /index.html
    /style.css
    /main.js
    /ui.js
    /api.js
    /config.js
    /texts.json

------------------------------------------------------------------------

## 🧩 Technologies utilisées

-   HTML5, CSS3, JavaScript Vanilla\
-   Google Apps Script\
-   Animations CSS (`fade`, `show`)\
-   Internationalisation JSON

------------------------------------------------------------------------

## 🔑 Configuration

Dans `config.js` :

``` js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  QUIZ_LIMIT: 5,
  FULL_DARK_PASS: "🖕"
};
window.CONFIG = CONFIG;
```

------------------------------------------------------------------------

## 🧠 Logique d'envoi

    main.js → sendUserQuestion(data) → api.js → Google Apps Script → Google Sheets

-   `main.js` : collecte et valide les données utilisateur.\
-   `api.js` : envoie les données JSON vers Google Apps Script.\
-   Le script Google insère la ligne dans `questions_users`.

------------------------------------------------------------------------

## 🧪 Test

1.  Ouvrir la console.\
2.  Soumettre une question.\
3.  Observer les logs et vérifier la feuille Google Sheets.

------------------------------------------------------------------------

© 2025 -- Projet WithMe. Tous droits réservés.
