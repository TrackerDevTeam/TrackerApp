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
  const { query, quantity } = req.query; // Récupérer le paramètre query de la requête
  if (!query) return res.status(400).json({ error: "Veuillez entrer un aliment." });
  if (!quantity) return res.status(400).json({ error: "Veuillez entrer un grammage." });

  try {
    console.log(`🔍 Requête envoyée à ChatGPT : ${query} (${quantity})`);

    // Faire une requête à l'API OpenAI avec axios
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en nutrition. Fournis toujours les informations nutritionnelles dans la structure demandée, sans texte superflu."
          },
          {
            role: "user",
            content: `Donne-moi les informations nutritionnelles détaillées pour ${quantity} de ${query}. Format de réponse attendu : {
              "product_name": ${query},
              "quantity": ${quantity},
              "nutrition": {
                "calories": X,
                "proteines": X,
                "glucides": X,
                "dont_sucres": X,
                "acides_gras_satures": X,
                "acides_gras_insatures": {
                  "polyinsatures": {
                    "omega3": X,
                    "omega6": X
                  },
                  "monoinsatures": {
                    "omega9": X
                  }
                },
                "fibres": X,
                "vitamines": {
                  "A": X,
                  "B": {
                    "B1": X,
                    "B2": X,
                    "B3": X,
                    "B5": X,
                    "B6": X,
                    "B8": X,
                    "B9": X,
                    "B12": X
                  },
                  "C": X,
                  "D": X,
                  "E": X,
                  "K": X
                },
                "mineraux": {
                  "calcium": X,
                  "sodium": X,
                  "magnesium": X,
                  "potassium": X
                },
                "oligoelements": {
                  "zinc": X,
                  "silicium": X,
                  "fer": X,
                  "selenium": X
                }
              }
            }`
          }
        ],
        temperature: 0.0
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // Extraire la réponse de ChatGPT
    const result = response.data.choices[0].message.content;
    console.log("✅ Réponse ChatGPT :", result);

    // Créer le dossier response_nutrition_api s'il n'existe pas
    if (!fs.existsSync('./response_nutrition_api')) {
      fs.mkdirSync('./response_nutrition_api');
    }

    // Sauvegarder la réponse dans un fichier texte
    const fileName = `./response_nutrition_api/${query}_100g.txt`; // Utilise un timestamp pour un nom unique
    const dataToSave = `${result}`;
    // Écrire dans le fichier
    fs.writeFileSync(fileName, dataToSave, 'utf8');
    console.log(`✅ Réponse enregistrée dans le fichier ${fileName}`);

    // Retourner la réponse au frontend
    res.json({ query, quantity, result });
  } catch (error) {
    // Gérer les erreurs plus précisément
    console.error("❌ Erreur API OpenAI :", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
});

app.listen(5000, () => console.log("✅ Serveur démarré sur http://192.168.1.79:5000"));
