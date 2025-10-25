# 📘 Quiz Entre Potes – Application Web de Quiz Multilingue

[https://virnichka.github.io/Pirates/V3/](https://virnichka.github.io/Pirates/V3/)

**Quiz Entre Potes** est un quiz en ligne multilingue, simple, fun, et collaboratif.
Il permet de **jouer en plusieurs modes**, de **soumettre ses propres questions**, et **d’enregistrer automatiquement les scores** dans Google Sheets.

---

## 🎯 Fonctionnalités

* **Trois modes de quiz**

  * Général 🌞
  * Fun 🤪
  * Full Dark 🏴‍☠️ (mot de passe, côté front)
* **Multilingue** (FR, EN, ES, RO)
* **Soumission de questions** depuis le site ✅
* **Classement automatique** basé sur Google Sheets ✅
* **Aucune dépendance serveur** → tout passe par Google Apps Script

---

## 🧱 Architecture générale

```
Navigateur (HTML/CSS/JS)
         ↓
Google Apps Script (API REST)
         ↓
Google Sheets (base de données)
```

* **Front** : GitHub Pages (statique)
* **Backend** : Google Apps Script (doGet / doPost)
* **Stockage** : Google Sheets

---

## 📂 Structure des fichiers (front)

```
/V3
│ index.html              → Structure principale de l’interface
│
├─ css/style.css          → Thèmes, boutons, animations
│
├─ js/config.js           → Configuration globale (URL Script, limites, clés)
├─ js/api.js              → Communication API (questions, scores, ranking, soumission)
├─ js/main.js             → Initialisation, sélection mode/langue, formulaires
├─ js/quiz.js             → Logique du quiz (questions, réponses, score)
├─ js/ui.js               → I18n, affichage dynamique, messages fin de quiz
│
└─ data/texts.json        → Contenu des textes pour chaque langue
```

---

## 🗂 Structure Google Sheets

### `Questions_All`

| question | bonne_reponse | reponses (a;b;c…) | explication | submitted_by | category | lang |
→ Le script Apps Script utilise `category` (mode) + `lang` pour filtrer.

### `scores` (brut, chaque partie)

| Date | Nom | Points obtenus | Total | Mode | Version |

### `Ranking` (résultat final affiché sur le site)

| GOAT (Nom) | Total points | Total questions | % Réussite |

> Cette feuille est calculée **automatiquement** (formules Sheets).

---

## 🔑 Clés d’accès pour proposer une question

Les utilisateurs doivent saisir **une clé** définie dans `config.js` :

```js
VALID_KEYS = {
  "INSA": "Gilo",
  "Juziers": "Simon",
  ...
}
```

* La **clé** est saisie par l’utilisateur
* La **valeur associée** est stockée dans `submitted_by`
* **But futur** : utiliser la même clé pour identifier les joueurs dans le classement ✅

---

## 📤 Soumettre une question (depuis l’interface)

1. Cliquer sur **📤 Envoyer une question**
2. Saisir la **clé d’accès**
3. Remplir :

   * Question
   * Bonne réponse
   * Mauvaises réponses
   * Mode (Général / Fun / Full Dark)
4. Envoyer → Les données s’ajoutent à **Questions_All**

Entièrement côté front, aucune installation backend nécessaire.

---

## 🏆 Classement

Le classement :

* Se calcule dans la feuille **Ranking**
* S’affiche via l’API `getRanking()` (bouton 🏆)
* Est basé sur **l’historique complet des scores**

→ Affichage **global**, pas par session.

---

## ⚙️ Configuration (`config.js`)

```js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  QUIZ_LIMIT: 5,
  FULL_DARK_PASS: "🖕",
  VALID_KEYS: { ... }
};
```

---

## 🤖 Mémoire projet (pour ChatGPT — à conserver)

> Tu es ChatGPT et tu connais le projet **Quiz Entre Potes**.
> C’est un quiz multilingue (FR/EN/ES/RO) connecté à **Google Sheets** via **Google Apps Script**.
> Les fonctionnalités clés :
>
> * Modes : Général, Fun, Full Dark (mot de passe côté front)
> * Soumission de questions → ajout dans **Questions_All**
> * Scores → ajout dans **scores**, classement calculé dans **Ranking**
> * Les questions sont servies via `doGet(action=getQuestions)` filtré par (mode, langue)
> * `api.js` gère toute la communication front ↔ Google Sheets
>
> Le projet est statique (GitHub Pages) et n’a **pas de backend autre que Google Apps Script**.
> Lorsque l’utilisateur te montre ce README, tu dois être capable de :
>
> * Comprendre l’architecture
> * Générer du code JS / Apps Script compatible
> * Continuer l’évolution du projet (ex : gestion des clés + scoring)
