# 🏴‍☠️ Quiz Entre Potes (Pirates)

Un quiz dynamique connecté à Google Sheets, pensé pour être simple, fun et flexible.  
Le projet repose sur une architecture claire côté front-end et une source de données centralisée via Google Sheets.

---

## ⚙️ Fonctionnement général

Le site affiche une série de questions issues d’une feuille Google Sheet, selon le **mode** choisi par l’utilisateur.  
Chaque mode correspond à une feuille différente (onglet) du même document Google Sheet.

Lorsqu’un utilisateur choisit un mode :
1. Le site interroge l’API Google Apps Script.
2. Les données du mode sélectionné sont chargées :  
   `question`, `bonne_reponse`, `reponses`, `explication`
3. Le quiz s’affiche question par question, avec :
   - 1 bonne réponse
   - 3 mauvaises réponses
   - 1 explication (affichée après la sélection)

---

## 📊 Structure des données Google Sheets

Chaque onglet du document Google Sheets suit ce format :

| question | bonne_reponse | reponses | explication |
|-----------|----------------|-----------|--------------|
| Texte de la question | Réponse correcte | Mauvaises réponses séparées par `;` | Brève explication du contexte |

### Exemple :
| question | bonne_reponse | reponses | explication |
|-----------|----------------|-----------|--------------|
| Combien de temps dort une girafe par jour ? | 2h | 4h;6h;8h | Une girafe dort environ deux heures par jour, souvent debout. |

La colonne **explication** est facultative :  
si elle est vide, aucune explication ne s’affiche dans le quiz.

---

## 🧱 Structure HTML principale

La section centrale du quiz est composée ainsi :

```html
<main>
  <h2 id="quizQuestion">Chargement du quiz…</h2>
  <div id="quizAnswers" class="answers"></div>
  <div id="miniCommentaire" class="mini-comment"></div>

  <div class="buttons">
    <button id="nextBtn" onclick="nextQuestion()" style="display:none;">Suivant</button>
    <button id="restartBtn" onclick="startQuiz(questions)" style="display:none;">Rejouer</button>
  </div>
</main>
```

👉 `miniCommentaire` est une zone discrète qui affiche l’explication de la question juste après la réponse de l’utilisateur.

---

## 🔁 Logique du quiz

### 1. Initialisation
- `startQuiz(list)` mélange et sélectionne un nombre limité de questions (`CONFIG.QUIZ_LIMIT`).
- Le bouton “Rejouer” est masqué.
- Les styles de fin de quiz sont réinitialisés.

### 2. Affichage de la question
- `showQuestion()` :
  - Affiche la question et les 4 boutons de réponse.
  - Cache le bouton “Suivant”.
  - Réinitialise la zone d’explication (`miniCommentaire`).

### 3. Validation de la réponse
- `checkAnswer(selected, correct)` :
  - Met en surbrillance la bonne et la mauvaise réponse.
  - Affiche le bouton “Suivant”.
  - ✅ Affiche, si disponible, le texte d’explication (`explication`) sous le bouton “Suivant”.

### 4. Navigation
- `nextQuestion()` masque le bouton “Suivant”, efface l’explication, et charge la question suivante.

### 5. Fin du quiz
- `showFinalScore()` affiche le score et un message final dans une carte centrée.
- L’utilisateur peut rejouer ou envoyer son score.

---

## 🧠 Scripts principaux

### `main.js`
- Initialise le quiz et gère la sélection du mode.
- Appelle `fetchQuestions()` pour récupérer les données Google Sheets selon le mode.

### `api.js`
- Contient la logique d’appel à l’API Google Apps Script.
- Retourne les données structurées pour le front-end.

### `quiz.js`
- Gère toute la logique du quiz :
  - `startQuiz`, `showQuestion`, `checkAnswer`, `nextQuestion`, `showFinalScore`
  - Ajout du support de l’**explication** (via la colonne `explication`).
  - Gestion de la visibilité du bouton “Suivant”.

### `ui.js`
- Contient des fonctions d’affichage et utilitaires (ex. `getRandomNames`).

### `style.css`
- Définit le style des thèmes (général, fun, full_dark).
- Unifie le bloc `.mini-comment` :
  ```css
  .mini-comment {
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .mini-comment.visible {
    opacity: 1;
  }
  ```
- Style compatible avec tous les modes.

---

## 🌈 Modes disponibles

Chaque mode correspond à un onglet dans Google Sheets :
- **Mode Général** : apparence sobre et claire.
- **Mode Fun** : couleurs plus vives, ambiance légère.
- **Mode Full Dark** : contraste renforcé, texte clair sur fond sombre.

---

## 🔧 Architecture globale du projet

```
📁 quiz-entre-potes/
│
├── index.html           → structure principale du site
├── style.css            → styles + thèmes (general, fun, full_dark)
├── main.js              → initialisation + gestion du mode
├── quiz.js              → logique du quiz (navigation, vérification)
├── ui.js                → fonctions utilitaires d’affichage
├── api.js               → lien entre le front et Google Sheets (Apps Script)
├── accroches.json       → textes ou phrases d’accroche du jeu
└── README.md            → documentation et prompt de développement
```

Le projet est entièrement statique et hébergé côté client (par exemple sur GitHub Pages).  
Les données sont dynamiquement chargées via une **API Google Apps Script**.

---

## 🧩 Prompt universel – Quiz Entre Potes (Pirates)

*(section inchangée – utilisée par ChatGPT pour continuer le développement du projet)*

```
[contenu original du prompt universel]
```

---

📘 **Résumé rapide**
- Données : Google Sheets → Apps Script → JSON → Quiz Web.
- Logique : 1 bonne réponse, 3 mauvaises, + 1 explication optionnelle.
- UX : bouton “Suivant” caché jusqu’à la sélection, affichage d’une explication claire sous la question.
