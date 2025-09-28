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
