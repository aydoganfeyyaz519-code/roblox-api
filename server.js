const express = require("express");
const fetch = require("node-fetch");
const app = express();

const port = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("API ROBLOX MARCHE ✅");
});

app.get("/follow", async (req, res) => {
  const { targetId, userId } = req.query;

  if (!targetId || !userId) {
    return res.status(400).json({ error: "Missing targetId or userId" });
  }

  try {
    let cursor = "";
    let isFollowing = false;

    // boucle pagination
    while (true) {
      const url = `https://friends.roblox.com/v1/users/${userId}/followings?limit=100&cursor=${cursor}`;
      const response = await fetch(url);

      if (!response.ok) {
        return res.status(response.status).json({ error: "Roblox API error" });
      }

      const data = await response.json();

      if (!data || !data.data) {
        break; // sécurité si Roblox change le format
      }

      // check dans cette page
      if (data.data.some(user => String(user.id) === String(targetId))) {
        isFollowing = true;
        break;
      }

      // si plus de pages
      if (!data.nextPageCursor) break;
      cursor = data.nextPageCursor;
    }

    res.json({ isFollowing });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: "Failed to fetch from Roblox API" });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
