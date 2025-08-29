const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("✅ API ROBLOX MARCHE");
});

// Nouvelle route pour vérifier si un user suit un autre
app.get("/follow", async (req, res) => {
  const { targetId, userId } = req.query;

  if (!targetId || !userId) {
    return res.status(400).json({ error: "Paramètres manquants (targetId, userId)" });
  }

  try {
    const response = await axios.get(
      `https://friends.roblox.com/v1/users/${userId}/followings`
    );

    const isFollowing = response.data.data.some(u => u.id == targetId);

    res.json({ isFollowing });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erreur lors de la requête Roblox API" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
