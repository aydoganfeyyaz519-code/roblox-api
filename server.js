const express = require("express");
const fetch = require("node-fetch");
const app = express();

const port = process.env.PORT || 10000;

// Route par défaut
app.get("/", (req, res) => {
  res.send("API ROBLOX MARCHE ✅");
});

// Route /follow
app.get("/follow", async (req, res) => {
  const { targetId, userId } = req.query;

  if (!targetId || !userId) {
    return res.status(400).json({ error: "Missing targetId or userId" });
  }

  try {
    const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/followings`);
    const data = await response.json();

    const isFollowing = data.data.some(user => String(user.id) === String(targetId));
    res.json({ isFollowing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch from Roblox API" });
  }
});

// Lancement serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
