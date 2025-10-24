# 📘 Quiz Pirates – Plateforme de quiz interactive (V3)

## 🎯 Introduction
Plateforme de quiz collaboratif permettant de :
- répondre à des questions classées par mode (Général, Fun, Full Dark)
- changer la langue (FR, EN, ES, RO)
- proposer de nouvelles questions via un formulaire intégré
- consulter un **classement des joueurs** synchronisé avec Google Sheets

L'application fonctionne avec :
- `index.html` pour la structure
- `main.js`, `ui.js`, `quiz.js`, `api.js` pour la logique
- `Google Apps Script` pour la gestion backend (questions & scores)

---

## 🧭 Nouveautés récentes (Version 3.2)

### ✅ **Nouvelle barre de navigation simplifiée (footer)**
- Les boutons Mode / Langue / Proposer / Classement sont désormais **centrés et uniformes**
- Les boutons affichent uniquement un **emoji clair et reconnaissable**
- L’apparence est cohérente sur mobile et desktop

### ✅ **Menus flottants (popovers) pour Mode & Langue**
Les menus déroulants ont été remplacés par des **menus popover clairs** :
- `themeBtn` → change le mode (Général / Fun / Full Dark)
- `langBtn` → change la langue (FR / EN / ES / RO)

Ils apparaissent au clic et se ferment automatiquement au clic extérieur.

### 🏆 **Classement des joueurs intégré**
- Récupération des scores via : `GET /exec?action=getRanking`
- Affichage d’un **podium visuel** (or / argent / bronze)
- Mise en forme inspirée du formulaire d’envoi de question
- Le classement se referme automatiquement si le formulaire est ouvert (et inversement)

### ✨ **Comportement UI amélioré**
- `proposeSection` et `rankingSection` **ne se chevauchent plus**
- Défilement automatique jusqu’à la section ouverte (`scrollIntoView()`)

---

## 🛠️ Configuration du script Google Sheets

Dans votre **Google Apps Script**, ajouter :

```js
function getRanking() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Ranking");
  const rows = sheet.getRange("A3:D").getDisplayValues().filter(r => r[0]);
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Puis déployer en tant que **Web App → accès Tous (même anonyme)**.

---

## 🔗 Rappel important : ordre des scripts dans `index.html`

```html
<script src="js/api.js"></script>
<script src="js/config.js"></script>
<script src="js/ui.js"></script> <!-- doit être AVANT quiz.js -->
<script src="js/quiz.js"></script>
<script src="js/main.js"></script>
```

> Ceci garantit que `shuffle()` et les popovers sont disponibles lorsque le quiz démarre.

---

## 🎨 Style des popovers (extrait CSS)

```css
.popover {
  position: absolute;
  bottom: 60px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.4rem;
  display: none;
  flex-direction: column;
  gap: 0.4rem;
  z-index: 99999;
}
.popover.show { display: flex !important; }
```

---

## 🎁 Crédits
- Dev et design → Virnichka & Friends
- Idées, retours et ambiance → Le Crew du Quiz 🍹

© 2025 – Projet WithMe. Tous droits réservés.
