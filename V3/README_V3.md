# 🏴‍☠️ Quiz Entre Potes (Pirates)

Un quiz dynamique et multilingue conçu pour un cercle d’amis.  
L’objectif : offrir une expérience fun, fluide et personnalisée autour de différents modes de jeu.  
Le projet repose sur une architecture 100 % front-end et une source de données centralisée dans **Google Sheets**, accessible via **Google Apps Script**.

🔗 **Site en ligne :** [https://virnichka.github.io/Pirates/v2/](https://virnichka.github.io/Pirates/v2/)

---

## ⚙️ Fonctionnement général (Version actuelle – V2)

Lorsqu’un utilisateur sélectionne un mode de jeu :

1. Le site interroge l’API **Google Apps Script**.
2. Les données correspondantes sont chargées depuis la feuille Google Sheet appropriée.
3. Les questions s’affichent une à une :
   - 1 bonne réponse
   - 3 mauvaises réponses
   - Une explication facultative après la réponse.
4. À la fin, un message personnalisé apparaît selon le score obtenu.

> 💡 Le quiz est entièrement statique : aucune donnée personnelle n’est collectée.

---

## 🧱 Architecture actuelle du projet

Le projet est hébergé sur **GitHub Pages** et structuré de manière modulaire.

### 📂 Structure
```
v2/
├── css/
│   └── style.css
├── data/
│   └── texts.json
├── js/
│   ├── api.js
│   ├── config.js
│   ├── main.js
│   ├── quiz.js
│   └── ui.js
├── index.html
└── README.md
```

### 🗂️ Description des fichiers

| Fichier | Rôle |
|----------|------|
| **index.html** | Structure principale du site |
| **style.css** | Thèmes visuels (Général / Fun / Full Dark) et animations |
| **config.js** | Paramètres globaux (URL Google Script, limites, etc.) |
| **api.js** | Appels API vers Google Apps Script |
| **main.js** | Initialisation du quiz, gestion du mode sélectionné |
| **quiz.js** | Logique du quiz (affichage des questions, score, réponses) |
| **ui.js** | Fonctions d’interface utilisateur et effets visuels |
| **texts.json** | Dictionnaire multilingue (FR, EN, ES, RO) |

---

## 🌈 Modes de jeu disponibles

Chaque mode correspond à une ambiance distincte :

| Mode | Description |
|------|--------------|
| 🌞 **Général** | Culture générale, ambiance sobre |
| 🤪 **Fun** | Couleurs vives et humour léger |
| 🏴‍☠️ **Full Dark** | Ambiance pirate et humour noir |

---

## 📊 Structure des données Google Sheets

Chaque **mode** et **langue** possède sa propre feuille Google Sheets.  
Exemples :
- `General FR`, `General EN`, `General ES`, `General RO`
- `Fun FR`, `Fun EN`, `Fun ES`, `Fun RO`
- `Full Dark FR`, `Full Dark EN`, etc.

Structure de chaque feuille :

| question | bonne_reponse | reponses | explication |
|-----------|----------------|-----------|--------------|
| Texte de la question | Réponse correcte | Mauvaises réponses séparées par `;` | Explication optionnelle |

---

# 🚧 Projet en cours (V3)

## 💡 Objectif

Mettre en place une nouvelle fonctionnalité permettant aux amis du groupe de **proposer eux-mêmes des questions**, directement depuis le site.  
Les propositions seront enregistrées dans une feuille Google Sheets dédiée (`propositions`).

---

## 🧠 Cahier des charges validé (Module “Proposer une question”)

### 🔑 Authentification
- Chaque ami dispose d’une **clé d’accès personnelle**.
- Les clés sont définies **dans `config.js`** (aucune vérification côté serveur).
- Si la clé est reconnue → affichage du formulaire.

### 📋 Champs du formulaire
| Champ | Description |
|--------|--------------|
| clé_utilisateur | Clé d’accès personnelle |
| mode | Mode ciblé (`general`, `fun`, `full_dark`) |
| langue | Langue de la question (`fr`, `en`, `es`, `ro`) |
| question | Texte de la question |
| bonne_reponse | Réponse correcte |
| reponses | Mauvaises réponses séparées par `;` (au moins 4) |
| explication | Brève explication (optionnelle) |

### 🔁 Envoi
- Vérification de la clé côté front.
- Envoi au **Google Apps Script** via l’action `sendProposal`.
- Le script ajoute la question à la feuille `propositions`.

### 📊 Feuille Google `propositions`
| clé_utilisateur | mode | langue | question | bonne_reponse | reponses | explication |
|------------------|-------|---------|-----------|----------------|-----------|--------------|
| PIRATE_LEA | fun | fr | Qui a volé le rhum ? | Maxence | Thomas;Léa;Nico;Julien | Parce que c’est toujours Maxence. |

### 🎨 Interface prévue
- Section intégrée dans `index.html` (pas de nouvelle page).
- Accessible via un bouton “💡 Proposer une question”.
- Affichage dynamique via `#quiz` / `#propose`.
- Style cohérent avec les thèmes existants.
- Message simple : “✅ Ta question a bien été envoyée !”

---

## 🧭 Architecture globale (vue d’ensemble)

```
Client (GitHub Pages)
     ↓
Front-end JS
  ├── main.js (initialisation / navigation)
  ├── quiz.js (logique du quiz)
  ├── api.js (API Google Script)
  └── config.js (paramètres + clés)
     ↓
Google Apps Script
     ↓
Google Sheets
   ├── General FR / EN / ES / RO
   ├── Fun FR / EN / ES / RO
   ├── Full Dark FR / EN / ES / RO
   └── Propositions
```

---

# 🤖 Prompt ChatGPT (mémoire du projet)

> Tu es ChatGPT et tu connais le projet **Quiz Entre Potes (Pirates)**.  
> C’est un quiz multilingue, entre amis, connecté à **Google Sheets via Apps Script**.  
> Le projet utilise **HTML / CSS / JavaScript pur**, hébergé sur **GitHub Pages**.  
>
> Le projet **V2** est stable avec trois modes : Général, Fun et Full Dark.  
> Les données sont réparties par langue et mode dans Google Sheets.  
>
> Le projet **V3** (en développement) ajoute une fonctionnalité :  
> permettre aux utilisateurs de **proposer leurs propres questions** via un formulaire intégré.  
> La vérification de la clé d’accès est faite côté front (`config.js`),  
> puis la question est envoyée à la feuille `propositions` via `sendProposal`.  
>
> Le projet doit rester : simple, fun, statique (sans backend) et cohérent avec l’existant.  
> 
> Si l’utilisateur te redonne ce README, tu dois pouvoir :  
> - Reprendre immédiatement le contexte.  
> - Générer du code ou de la doc cohérente avec l’architecture décrite ici.  
> - Continuer le développement du module “Proposer une question”.

---

# 👨‍💻 Auteur

**Projet :** @virnichka  
**Version actuelle :** V2 (fonctionnelle)  
**Version en cours :** V3 – Module “Proposer une question”  
**Licence :** Usage personnel et amical.
