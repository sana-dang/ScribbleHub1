// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/scribblehub")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Story schema
const StorySchema = new mongoose.Schema({
  title: String,
  story: String,
  category: String,
}, { timestamps: true });

const Story = mongoose.model("Story", StorySchema);

// --------------- API ROUTES ----------------

// GET all stories
app.get("/stories", async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
});

// POST a new story
app.post("/stories", async (req, res) => {
  const { title, story, category } = req.body;
  if (!title || !story || !category) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const newStory = new Story({ title, story, category });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    res.status(500).json({ message: "Failed to save story" });
  }
});

// --------------- SERVE FRONTEND ----------------
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all route for frontend (regex version)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));