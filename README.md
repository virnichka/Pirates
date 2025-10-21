# 📘 Quiz Pirates – Plateforme de quiz interactive (V3)

## 🎯 Description

**Quiz Pirates** est une application web de quiz multilingue et multi-mode, pensée pour être simple, rapide et collaborative. Elle permet désormais aux utilisateurs de **soumettre leurs propres questions** directement depuis l’interface du site.

Cette version (V3) consolide les fonctionnalités principales, y compris l’intégration complète avec **Google Sheets** pour la gestion des scores et des propositions de questions.

---

## 🚀 Fonctionnalités principales

### 🎮 Modes de jeu

* **Général 🦁** – Culture générale.
* **Fun 🤪** – Questions plus légères et ludiques.
* **Full Dark 🏴‍☠️** – Mode caché nécessitant un mot de passe (défini dans `config.js`).

### 🌍 Multilingue

Le site est disponible en plusieurs langues (Français, Anglais, Espagnol, Roumain).
Les textes sont gérés dans `texts.json` et automatiquement traduits selon la langue sélectionnée dans le pied de page.

### 🧠 Quiz interactif

* Sélection automatique du mode et de la langue.
* Limitation configurable du nombre de questions (`QUIZ_LIMIT`).
* Enregistrement automatique des scores dans Google Sheets.

### 📤 Proposition de questions (nouvelle fonctionnalité)

Les utilisateurs peuvent proposer de nouvelles questions depuis l’interface du site :

* Le bouton **📤 Soumettre une question** affiche un formulaire dynamique.
* L’utilisateur saisit : une **clé d’accès**, la **question**, la **bonne réponse**, jusqu’à **6 mauvaises réponses**, et la **catégorie** (mode du quiz).
* L’interface est multilingue et s’adapte à la langue de l’utilisateur.
* Un message animé (fade-in/fade-out) confirme la réussite de l’envoi.
* Les données sont transmises à Google Sheets via **Google Apps Script**.

### ☁️ Intégration Google Sheets

L’application s’appuie sur un **script Google Apps Script** connecté à un tableur contenant plusieurs feuilles :

* `scores` → enregistre les résultats des joueurs.
* `questions_users` → stocke les propositions envoyées par les utilisateurs (question, bonne réponse, mauvaises réponses fusionnées, soumis_par, mode/catégorie).
* Feuilles de questions **par Mode × Langue** (lecture par le site) :

  * `Général FR`, `Général EN`, `Général ES`, `Général RO`
  * `Fun FR`, `Fun EN`, `Fun ES`, `Fun RO`
  * `Full Dark FR`, `Full Dark EN`, `Full Dark ES`, `Full Dark RO`

Chaque feuille de questions suit la structure : **question | bonne_reponse | reponses (liste séparée par des virgules) | explication (optionnelle)**.

Le script traite les données reçues via la fonction `doPost(e)` :

* Si le `payload` contient un score → enregistrement dans `scores`.
* Si le `payload` contient une question utilisateur (`action: add_user_question`) → ajout dans `questions_users`.

Un `doGet(e)` peut être exposé pour **fournir les questions** selon `mode` et `lang` (filtrage par feuille correspondante).

---

## ⚙️ Structure du projet

```
index.html         → Structure principale du site
style.css          → Thèmes, animations et disposition (.fade, .show)
main.js            → Logique générale, gestion du formulaire utilisateur et UI
ui.js              → Gestion des textes et traduction dynamique (data-i18n)
api.js             → Communication avec Google Apps Script (GET/POST)
config.js          → Configuration (URL du script Google, limite du quiz, clé Full Dark) + exposition globale
texts.json         → Traductions multilingues (FR/EN/ES/RO)
```

---

## 🔑 Configuration

Dans `config.js` :

```js
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
  QUIZ_LIMIT: 5,
  FULL_DARK_PASS: "🖕"
};
window.CONFIG = CONFIG;
```

### Script Google Apps Script (aperçu fonctionnel)

* **`doPost(e)`** : reçoit des données JSON depuis le site, distingue l’action (score ou question utilisateur) et écrit la ligne dans la feuille cible (`scores` ou `questions_users`).
* **`doGet(e)`** : renvoie des questions prêtes à l’emploi selon les paramètres `mode` et `lang`, en lisant la feuille correspondante (ex. `Général FR`).
* **Utilitaires** : extraction du payload, logs, création de feuille si manquante.

> Remarque : le site utilise un `fetch` en `POST` (mode `no-cors`) pour la soumission de questions ; les chargements de questions se font en `GET` paramétré.

---

## 🧩 Logique de fonctionnement

```
main.js  →  sendUserQuestion(data)  →  api.js  →  Google Apps Script  →  Google Sheets
```

* `main.js` : gère l’interface (footer, formulaire, messages localisés, transitions `.fade/.show`) et la collecte.
* `api.js` : envoie la requête JSON (mode `no-cors`) pour la soumission ; effectue les lectures (GET) pour récupérer les questions.
* `doPost(e)` / `doGet(e)` : réception, routage et accès aux feuilles.


## 🧪 Test et vérification

1. Ouvrir la console du navigateur (F12 → Console).
2. Cliquer sur **📤 Soumettre une question** et remplir le formulaire.
3. Vérifier les logs : `📦 Données prêtes à l’envoi` et `✅ Question envoyée avec succès !`.
4. Confirmer la réception dans la feuille Google Sheets `questions_users`.

---

## 🧠 Technologies utilisées

* **HTML5**, **CSS3**, **JavaScript Vanilla**
* **Google Apps Script** (communication backend)
* **Google Sheets** (base de données simple)
* **Animations CSS** (classes `.fade`, `.show`)
* **Internationalisation** via `texts.json`


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


© 2025 – Projet WithMe. Tous droits réservés.
