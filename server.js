const express = require("express");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
    res.send("✅ API ROBLOX en ligne !");
});

// route /follow
app.get("/follow", async (req, res) => {
    const { targetId, userId } = req.query;

    if (!targetId || !userId) {
        return res.status(400).json({ error: "Missing targetId or userId" });
    }

    try {
        const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/followings`);
        const data = await response.json();

        const isFollowing = data.data.some(user => user.id == targetId);

        res.json({ isFollowing });
    } catch (err) {
        res.status(500).json({ error: "Roblox API error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Serveur lancé sur le port " + PORT);
});
