const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;


app.use(cors({
  origin: "http://127.0.0.1:3000", // frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));


// Allow JSON bodies
app.use(express.json());

// Example POST endpoint
app.post("/api/update-names", (req, res) => {
  const { firstname, lastname, othernames } = req.body;

  // Return modified data
  res.json({
    firstname: firstname.toUpperCase(),
    lastname: lastname + " UPDATED",
    othernames: "NEW " + othernames
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

