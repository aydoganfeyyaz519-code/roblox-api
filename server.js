const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Exemple d'API
app.get("/", (req, res) => {
  res.send("API Roblox marche ✅");
});

// Exemple pour followers
app.get("/followers/:userId", (req, res) => {
  const { userId } = req.params;
  res.json({ userId, followers: 123 }); // à remplacer par du vrai code plus tard
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
