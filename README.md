# 🎯 Quiz Entre Potes – Version 2.0

Un quiz totalement déjanté entre potes, où la mémoire sociale est mise à l’épreuve et la honte collective est au rendez-vous.  
Ce projet mélange humour, simplicité et technique — pour un résultat fun, propre et modulable.

---

## 🧩 1) Présentation du projet

### 🎬 Contexte
Le **Quiz Entre Potes** est une application web simple et légère, pensée pour être jouée entre amis.  
Chaque partie affiche une série de questions personnalisées (souvent internes au groupe 👀) et propose plusieurs réponses.  
À la fin, le score du joueur est enregistré dans **Google Sheets** via un **Google Apps Script**, pour garder trace des performances de chacun.

---

## ⚙️ 2) Fonctionnement général

L’application est entièrement front-end (HTML/CSS/JS), sans framework externe.  
Les données et configurations sont chargées dynamiquement à partir de fichiers JSON et d’un script Google.

### 🔄 Schéma global

1. **Chargement de la page (`index.html`)**
   - Initialise la configuration (`config.js`)
   - Charge les accroches (titres, sous-titres, commentaires)
   - Récupère les questions du quiz depuis une source externe (Google Sheet via `api.js`)
   - Démarre le quiz

2. **Déroulement du quiz**
   - Une question s’affiche avec plusieurs réponses.
   - L’utilisateur clique sur une réponse.
   - La bonne réponse s’allume en vert, la mauvaise en rouge.
   - L’utilisateur clique sur **Suivant** pour passer à la question suivante.

3. **Fin du quiz**
   - Le score est calculé en pourcentage.
   - Un commentaire final (personnalisé selon le score) s’affiche.
   - Les résultats sont envoyés automatiquement à Google Sheets.
   - Un bouton **Rejouer** permet de relancer une nouvelle partie.

---

## 🧱 3) Arborescence du projet (V2)

```
v2/
│
├── index.html              # Structure principale du site
│
├── css/
│   └── style.css           # Styles du quiz (mode clair/sombre, boutons, etc.)
│
├── data/
│   └── accroches.json      # Textes dynamiques : titres, sous-titres, commentaires de fin
│
├── js/
│   ├── config.js           # Configuration globale (URL Google Script, limite de questions)
│   ├── api.js              # Gestion de la communication avec Google Sheets (POST/GET)
│   ├── ui.js               # Interface utilisateur (thème, accroches, commentaires)
│   ├── quiz.js             # Logique du quiz (affichage des questions/réponses)
│   └── main.js             # Point d’entrée principal – initialise tout au chargement
│
└── README.md               # Documentation complète du projet
```

---

## 🧠 4) Détails des fichiers

### 📄 index.html
- Contient la structure HTML du site.
- Charge les scripts JS dans le bon ordre.
- Intègre la configuration de base.
- Contient les sections : **header**, **main**, et **footer**.

### 🎨 css/style.css
- Définit les deux thèmes (clair / sombre).
- Gère l’affichage des boutons, des réponses, et des messages de fin.
- Utilise des transitions fluides, un style moderne et une hiérarchie visuelle claire.
- Compatible mobile grâce à une section `@media`.

### 📁 data/accroches.json
Ce fichier contient :
- Les **titres** affichés aléatoirement en haut du site.
- Les **sous-titres** à l’humour “after de 3h du mat”.
- Les **commentaires de fin** selon le pourcentage de réussite.

### ⚙️ js/config.js
Définit les constantes globales utilisées partout dans l’app :
```js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  QUIZ_LIMIT: 5
};
```

### 🌐 js/api.js
Gère les communications réseau :
- Récupère les questions depuis Google Sheets (via un Apps Script publié en mode “Web App”).
- Envoie le score du joueur en POST à la même URL.
- Gère les erreurs réseau (CORS, indisponibilité, etc.).

### 🎨 js/ui.js
Centralise toute la gestion visuelle :
- Basculer entre thème clair et sombre.
- Charger dynamiquement les titres, sous-titres, et commentaires finaux depuis `accroches.json`.
- Fournir des outils utilitaires (`shuffle`, `getRandomNames`, etc.).
- Retourner un commentaire final en fonction du score.

### 🎮 js/quiz.js
Cœur du gameplay :
- Affiche les questions et réponses.
- Vérifie la réponse de l’utilisateur.
- Met à jour le score.
- Passe à la question suivante.
- Déclenche l’affichage du message final et l’envoi des résultats.

### 🚀 js/main.js
Point d’entrée de l’application :
- Se lance à `window.onload`.
- Charge `accroches.json` et l’associe à la variable globale `ACCROCHES`.
- Applique un titre et un sous-titre aléatoires.
- Lance la récupération des questions et le démarrage du quiz.

---

## 🧭 5) Fonctionnement technique

### 🔌 Communication avec Google Sheets
Le script Google Apps Script agit comme une API :
- **GET** → retourne les questions depuis un Google Sheet.
- **POST** → ajoute le score du joueur dans une feuille dédiée.

Pour fonctionner :
1. Ouvre ton script Google Apps Script.
2. Clique sur **Déployer > Déployer en tant qu’application web**.
3. Coche :
   - **Exécuter en tant que : Moi (le propriétaire)**
   - **Accessible à : Tout le monde**
4. Copie l’URL fournie et colle-la dans `config.js` dans la clé `GOOGLE_SCRIPT_URL`.

---

## 🧑‍💻 6) Mode d’emploi pour les utilisateurs

1. **Ouvre la page `index.html`**
   - Le quiz se charge automatiquement.
   - Un titre et un sous-titre apparaissent aléatoirement.
2. **Réponds aux questions**
   - Clique sur la bonne réponse.
   - Les bonnes/mauvaises réponses s’affichent en vert/rouge.
3. **Clique sur "Suivant"**
   - Passe à la question suivante.
4. **Fin du quiz**
   - Le score final est affiché avec une punchline.
   - Les résultats sont envoyés automatiquement à Google Sheets.
5. **Clique sur "Rejouer"**
   - Le jeu recommence proprement (bouton “Rejouer” masqué au redémarrage).

---

## 🎨 7) Points forts de la V2

✅ Thèmes clair/sombre fluides  
✅ Interface modernisée et responsive  
✅ Fichiers bien séparés (code, données, style)  
✅ Commentaires finaux dynamiques depuis `accroches.json`  
✅ Envoi automatique des scores à Google Sheets  
✅ Structure claire et facilement extensible

---

## 🧩 8) Pour aller plus loin

Prochaines évolutions possibles :
- Ajout d’un classement en ligne (leaderboard).
- Intégration d’un sélecteur de difficulté.
- Possibilité d’ajouter ses propres questions via un formulaire.
- Ajout d’un mode “buzzer” multijoueur.

---

## 🏁 9) Licence

Projet libre pour usage personnel entre amis.  
Merci de garder la mention d’auteur : **vinrichka** ✨  
Toute modification ou extension est la bienvenue tant qu’elle conserve l’esprit potes & fun.

---

## 🤖 ChatGPT – Aide au développement

Ce projet est maintenu et amélioré avec l’aide de ChatGPT (GPT-5).  
Cette section permet à ChatGPT de comprendre automatiquement le contexte du projet sans explications supplémentaires.

### 🧠 Instructions d’utilisation

Pour chaque nouvelle session ChatGPT :
1. Ouvre une nouvelle discussion.  
2. Copie le prompt universel ci-dessous et colle-le dans le chat.  
3. Joins ce fichier `README.md` (aucun autre fichier n’est nécessaire au départ).  
4. Si besoin d’analyses backend, ajoute le script Google Apps Script.  
5. ChatGPT pourra alors comprendre instantanément le projet, son architecture et son fonctionnement.

---

### 🧩 Prompt universel – Quiz Entre Potes (Pirates)

Contexte du projet :  
Tu es ChatGPT, expert en développement web front-end (HTML, CSS, JavaScript) et en intégration avec Google Sheets via Google Apps Script. Tu m’aides à développer, corriger et améliorer un site web hébergé sur GitHub Pages, qui communique avec une feuille Google Sheets.

Fonctionnement général :  
Le site web contient des fichiers HTML, CSS et JS (ou JSS) hébergés sur GitHub.  
Il interagit avec une feuille Google Sheets via un script Apps Script.  
La feuille sert à :  
1. Fournir des données, par exemple le contenu d’un formulaire ou d’un quiz.  
2. Recevoir les réponses des utilisateurs depuis le site.  
Le script Google Apps Script agit comme une API backend, gérant la lecture et l’écriture des données dans la feuille.

Objectif de ton rôle :  
Tu dois être capable de :  
1. Comprendre le fonctionnement complet du projet, c’est-à-dire la structure du site et la liaison avec la feuille Google Sheets.  
2. Identifier et corriger des erreurs dans le code HTML, CSS, JS ou Apps Script.  
3. Ajouter ou améliorer des fonctionnalités selon mes besoins.  
4. Optimiser les performances, la lisibilité et la fiabilité du code.  
5. Proposer de bonnes pratiques et des améliorations techniques.

À chaque nouvelle session :  
Je te fournirai :  
1. Une capture d’écran ou un extrait montrant la structure du dépôt GitHub.  
2. Le script Google Apps Script associé, si utile.  
3. Certains fichiers du projet à analyser ou modifier, si nécessaire.

Ta mission :  
1. Te baser sur ces éléments pour comprendre le projet.  
2. Analyser ou modifier le code selon mes demandes.  
3. Expliquer clairement le fonctionnement.  
4. Me guider dans la mise à jour ou l’évolution du site.

---

### 🔗 Liens utiles

- **Site en ligne :** [https://virnichka.github.io/Pirates/v2/](https://virnichka.github.io/Pirates/v2/)  
- **Dépôt GitHub :** [https://github.com/virnichka/Pirates](https://github.com/virnichka/Pirates)  
- **Script Google Apps Script (API) :** [https://script.google.com/macros/s/AKfycbx93i92e5L0HfuJIlfoU6ZSFHYT9cIJz5WfjOikscP2PJDGdoOHV8PuworGE4D0LGsb/exec](https://script.google.com/macros/s/AKfycbx93i92e5L0HfuJIlfoU6ZSFHYT9cIJz5WfjOikscP2PJDGdoOHV8PuworGE4D0LGsb/exec)

---

✅ En suivant ces instructions, ChatGPT comprendra immédiatement le fonctionnement complet du projet “Quiz Entre Potes (Pirates)” et pourra t’aider à le faire évoluer efficacement.
