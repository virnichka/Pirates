# 🏴‍☠️ Quiz Entre Potes (Pirates)

**Quiz Entre Potes (Pirates)** est un jeu de quiz web pensé pour être à la fois fun, personnalisable et technique.  
Le projet allie **Google Sheets**, **Google Apps Script** et **JavaScript (front-end pur)** pour créer un quiz en ligne dynamique, alimenté à distance.

C’est un projet à la croisée du divertissement et du développement — pensé pour les potes, mais conçu comme un vrai produit web modulaire ⚙️

---

## ⚡️ Aperçu rapide

- 🧭 **3 modes de jeu** :  
  - `Général` (thème clair)  
  - `Fun` (thème coloré, léger)  
  - `Full Dark` (thème sombre, ton pirate et satirique)  

- 📄 **Questions et réponses stockées dans Google Sheets**, avec une feuille par mode :
  - `general`
  - `fun`
  - `full_dark`

- 🎨 **Thèmes visuels synchronisés** avec le mode choisi :
  - Couleurs globales gérées via CSS variables (`data-theme`)
  - Sélecteur de mode affiché en bas du site (remplace l’ancien bouton “Basculer le thème”)

- 💬 **Titres, sous-titres et phrases de fin de quiz** adaptés à chaque mode via `accroches.json`.

- 💾 **Sauvegarde automatique des scores** dans la feuille `scores` de Google Sheets.

- 🧠 **Technos** :  
  - HTML / CSS / JavaScript (sans framework)  
  - Google Apps Script (API personnalisée)
  - GitHub Pages pour l’hébergement

---

## 🧩 Architecture du projet

### 📁 Structure principale

```
📦 quiz-entre-potes
 ┣ 📜 index.html          → Structure principale du site
 ┣ 🎨 style.css           → Thèmes, couleurs et animations
 ┣ ⚙️ config.js           → URL Google Script et constantes globales
 ┣ 📡 api.js              → Communication entre le site et Google Sheets
 ┣ 🧩 quiz.js             → Gestion logique des questions / réponses
 ┣ 💬 ui.js               → Gestion de l’interface utilisateur (titres, sous-titres, fin de quiz)
 ┣ 🚀 main.js             → Initialisation du jeu, écouteurs, flux global
 ┣ 🗒️ accroches.json      → Textes dynamiques (titres, sous-titres, commentaires de fin)
 ┗ 🧠 Script Google.txt   → Script Apps Script (back-end)
```

---

## 🧠 Fonctionnement global

### 1. 🔌 Chargement des questions
Chaque mode de jeu correspond à une **feuille Google Sheets distincte** :  
`general`, `fun`, `full_dark`.

Lors du démarrage :
```js
fetchQuestions(selectedMode);
```
→ appelle le script Apps Script :
```
https://script.google.com/macros/s/.../exec?action=getQuestions&sheet=fun
```
Les colonnes attendues :
```
question | bonne_reponse | reponses
```
La colonne `reponses` contient les mauvaises réponses séparées par `;`.

---

### 2. 🎨 Thèmes visuels
Chaque mode applique un **thème CSS spécifique** :
- `data-theme="general"` → clair  
- `data-theme="fun"` → coloré / festif  
- `data-theme="full_dark"` → sombre  

Le choix est sauvegardé dans `localStorage`, pour qu’au rechargement du site, le mode choisi soit restauré automatiquement.

---

### 3. 💬 Accroches et commentaires de fin
Le fichier `accroches.json` contient :
- les titres et sous-titres d’accueil par mode,
- les phrases de fin de quiz selon le score (0 → 100 %).

Lorsqu’un quiz se termine :
```js
getCommentaire(pourcentage);
```
→ récupère la phrase adaptée au score et au mode choisi.

---

### 4. 📤 Envoi du score
L’envoi du score se fait **via une requête GET** (pour éviter les erreurs CORS).

```js
sendScore(nom, score, total, mode);
```

→ appelle :
```
https://script.google.com/macros/s/.../exec?action=sendScore&nom=Maxou&score=4&total=5&mode=fun
```

Les scores sont stockés dans la feuille `scores` :
```
timestamp | nom | score | total | mode | version
```

---

### 5. ⚙️ Script Google Apps Script (API)
Côté serveur (dans ton Google Apps Script) :

- `doGet(e)` gère :
  - `?action=getQuestions` → renvoie les questions de la feuille demandée
  - `?action=sendScore` → enregistre un score via GET

- `doPost(e)` gère les requêtes POST (non utilisées depuis GitHub Pages)

Les logs et événements sont enregistrés dans la feuille `log_debug` :
```
📥 Feuille demandée : general
✅ Score ajouté : maxou | 4/5 | mode=fun
```

---

## ⚙️ Développement et maintenance

### 🧰 Google Sheets
- `questions` → obsolète  
- `general`, `fun`, `full_dark` → actives  
- `scores` → stockage des résultats  
- `log_debug` → traçage des actions

### 💾 Hébergement
- Front-end : GitHub Pages  
- Back-end : Google Apps Script (déployé en “Exécuter en tant que moi / accessible à tous”)

### 🧩 Debug utile
- Ouvrir la **console navigateur (F12)** :
  - `console.log` → affiche les chargements, les scores et les erreurs  
- Vérifier la **feuille `log_debug`** :
  - pour confirmer la réception côté Apps Script  
- Les erreurs de chargement de questions proviennent souvent :
  - d’une faute de frappe dans le nom de la feuille (`fun` vs `full_dark`)  
  - ou d’un déploiement Apps Script non mis à jour.

---

## 🎮 Expérience utilisateur
- Sélecteur de mode visible en bas du site (`<select id="modeSelect">`)
- Les questions et thèmes changent instantanément selon le mode
- Les couleurs du site et les phrases de fin de quiz s’adaptent automatiquement
- L’état du mode choisi est sauvegardé entre les sessions

---

## 💬 Exemple de flux complet

1. L’utilisateur choisit le **mode Fun**  
2. Le site applique `data-theme="fun"`  
3. Les **questions** sont chargées depuis la feuille `fun`  
4. Les **titres et phrases** viennent de `accroches.json` (`modes.fun`)  
5. À la fin du quiz, le **score est envoyé** à Google Sheets  
6. Une **phrase de fin personnalisée** s’affiche  
7. Le mode est enregistré dans `localStorage`

---

## 🧩 Prompt universel – Quiz Entre Potes (Pirates)

> Utilise ce prompt pour relancer ChatGPT dans le bon contexte si tu veux continuer à travailler sur ce projet.

---

### 🪶 **Prompt à copier :**

> Tu es ChatGPT, et tu connais le projet **Quiz Entre Potes (Pirates)**.  
> Ce projet est un site de quiz connecté à Google Sheets, avec un mode de jeu sélectionnable (Fun, Full Dark, Général).  
> Le site est en HTML/CSS/JavaScript pur, hébergé sur GitHub Pages, et communique avec un Google Apps Script qui gère les questions et les scores.
>
> Les fichiers importants :
> - `index.html` → structure du site  
> - `style.css` → thèmes visuels et variables CSS  
> - `api.js` → communication avec Google Apps Script (`fetchQuestions`, `sendScore`)  
> - `main.js` → logique principale et initialisation  
> - `ui.js` → interface et accroches dynamiques  
> - `accroches.json` → titres, sous-titres, phrases de fin  
> - `Script Google.txt` → backend Apps Script (`doGet`, `doPost`, `getQuestions`, `logDebug`)
>
> Le but du projet est de maintenir et d’améliorer le quiz : nouveaux modes, nouveaux thèmes, optimisation du code et de l’UX, tout en gardant la logique actuelle.
>
> À chaque fois que je te relancerai avec ce projet, considère que :
> - le thème **“Général”** est le mode par défaut,  
> - les données sont chargées depuis **trois feuilles Google Sheets** (`general`, `fun`, `full_dark`),  
> - les scores sont enregistrés dans la feuille **scores**,  
> - le design s’adapte automatiquement selon `data-theme`,  
> - les phrases de fin proviennent de `accroches.json`.  
>
> Ton rôle est de m’aider à **faire évoluer ce projet sans casser la logique existante** :  
> analyser, corriger, proposer, améliorer, commenter proprement.

---

⚓️ *“Entre potes, entre pirates — mais avec du code propre.”*
