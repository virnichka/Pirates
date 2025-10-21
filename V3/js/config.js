/**
 * 🌍 Configuration globale du quiz
 */
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx93i92e5L0HfuJIlfoU6ZSFHYT9cIJz5WfjOikscP2PJDGdoOHV8PuworGE4D0LGsb/exec",
  QUIZ_LIMIT: 5,
  FULL_DARK_PASS: "🖕", // 🗝️ mot de passe pour le mode Full Dark
  
  
  // 🧩  clés d'accès pour les soumettre une question
  VALID_KEYS: {
    "INSA": "Gilo",
    "Juziers": "Simon",
    "Judo": "Thomas",
    "Perseides": "Annabelle",
    "Pikachu": "Sacha",
    "BatGab": "Gabriel",
    "PoumonDOr": "Vladimir",
    "Gargenville": "Alexis",
    "111": "Maxime",
    "Mezy": "Arthur",
    "Toulouse": "Hugo",
    "78": "Autres",
    "Villon": "Florent",
    "Timisoara": "Maxence"
  }
};

// ✅ Exposition globale 
window.CONFIG = CONFIG;
console.log("🌍 CONFIG exposé globalement :", window.CONFIG);
