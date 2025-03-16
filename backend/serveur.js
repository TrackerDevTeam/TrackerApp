const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Autoriser les requêtes du frontend
app.use(express.json());

app.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Veuillez entrer un aliment." });

  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=true`
    );

    const products = response.data.products;
    if (products.length === 0) return res.status(404).json({ error: "Aucun produit trouvé." });

    const product = products[0]; // Premier produit trouvé
    const result = {
      name: product.product_name,
      image: product.image_url,
      calories: product.nutriments?.["energy-kcal_100g"],
      proteins: product.nutriments?.["proteins_100g"],
      carbohydrates: product.nutriments?.["carbohydrates_100g"],
      fat: product.nutriments?.["fat_100g"],
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
});

app.listen(5000, () => console.log("✅ Serveur démarré sur http://localhost:5000"));
