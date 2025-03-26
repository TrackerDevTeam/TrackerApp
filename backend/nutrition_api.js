const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require('fs');
require('dotenv').config(); // Charger les variables d'environnement

// Vérifier si la clé API est bien définie
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY n'est pas définie dans le fichier .env");
  process.exit(1); // Quitter l'application si la clé n'est pas trouvée
}

const app = express();
app.use(cors()); // Autoriser les requêtes du frontend
app.use(express.json()); // Parse le JSON dans les requêtes

app.get("/search", async (req, res) => {
  const { query } = req.query; // Récupérer le paramètre query de la requête
  if (!query) return res.status(400).json({ error: "Veuillez entrer un aliment." });

  try {
    console.log(`🔍 Requête envoyée à ChatGPT : ${query}`);

    // Faire une requête à l'API OpenAI avec axios
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // Ou "gpt-3.5-turbo" si tu veux réduire les coûts
        messages: [
          { role: "system", content: "Tu es un expert en nutrition." },
          {
            role: "user",
            content: `Donne-moi les informations nutritionnelles détaillées pour 100g de ${query}. 
                      Inclut les calories, protéines, lipides, glucides (dont sucres), vitamines, minéraux, fibres et sel.`,
          },
        ],
        temperature: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extraire la réponse de ChatGPT
    const result = response.data.choices[0].message.content;
    console.log("✅ Réponse ChatGPT :", result);

    // Sauvegarder la réponse dans un fichier texte
    const fileName = `./response_nutrition_api/response_${Date.now()}.txt`; // Utilise un timestamp pour un nom unique
    const dataToSave = `Requête : ${query}\n\nRéponse ChatGPT :\n${result}\n`;

    // Écrire dans le fichier
    fs.writeFileSync(fileName, dataToSave, 'utf8', (err) => {
      if (err) {
        console.error("❌ Erreur lors de l'écriture dans le fichier :", err);
      } else {
        console.log(`✅ Réponse enregistrée dans le fichier ${fileName}`);
      }
    });

    // Retourner la réponse au frontend
    res.json({ query, result });
  } catch (error) {
    // Gérer les erreurs plus précisément
    console.error("❌ Erreur API OpenAI :", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
});

app.listen(5000, () => console.log("✅ Serveur démarré sur http://192.168.1.79:5000"));
