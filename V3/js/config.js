/**
 * 🌍 Configuration globale du quiz
 */
const CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx93i92e5L0HfuJIlfoU6ZSFHYT9cIJz5WfjOikscP2PJDGdoOHV8PuworGE4D0LGsb/exec",
  QUIZ_LIMIT: 5,
  FULL_DARK_PASS: "🖕", // 🗝️ mot de passe pour le mode Full Dark
  
  
  // 🧩 VALID_KEYS : clé privée saisie par l'utilisateur → nom public stocké dans scores et soumission de questions
  VALID_KEYS: {
    "INSA": "Gilo",
    "Juziers": "Simon",
    "Judo": "Tho",
    "Perseides": "Annabelle",
    "Pikachu": "Sacha",
    "BatGab": "Gabroche",
    "PoumonDOr": "Vladimir Cauchemar",
    "Gargenville": "Alexis",
    "111": "Maximus",
    "Mezy": "Arthuro",
    "Toulouse": "Hugolin",
    "78": "Autres",
    "Villon": "Denes",
    "Lille": "Pere Giletos",
    "Mercedes": "Pere Lombard",
    "Timisoara": "Maxence"
  }
};

// ✅ Exposition globale 
window.CONFIG = CONFIG;
