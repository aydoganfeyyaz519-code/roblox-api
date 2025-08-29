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

    while (true) {
      const url = `https://friends.roblox.com/v1/users/${userId}/followings?limit=100&cursor=${cursor}`;
      console.log("➡️ Fetching:", url);

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Roblox-Proxy/1.0",
          "Accept": "application/json"
        }
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("❌ JSON parse failed, raw response:", text);
        return res.status(500).json({
          error: "Roblox did not return valid JSON",
          raw: text
        });
      }

      if (!data || !data.data) {
        console.warn("⚠️ Unexpected Roblox API format:", data);
        break;
      }

      // Vérifie si targetId est dans cette page
      if (data.data.some(user => String(user.id) === String(targetId))) {
        isFollowing = true;
        break;
      }

      if (!data.nextPageCursor) break;
      cursor = data.nextPageCursor;
    }

    return res.json({ isFollowing });
  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ error: "Failed to fetch from Roblox API" });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur lancé sur le port ${port}`);
});
