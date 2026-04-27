const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    console.log("🎯 Target API received a request from GuardX!");
    res.json({
        status: "success",
        message: "You have reached the Target API through GuardX!",
        data: ["User 1", "User 2", "User 3"]
    });
    console.log("Res got successfullyy..............")
});

app.listen(PORT, () => {
    console.log(`🎯 Mock Backend Service running on http://localhost:${PORT}`);
});
