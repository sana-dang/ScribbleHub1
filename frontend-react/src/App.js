import React, { useState, useEffect } from "react";
import "./style.css";

const API_URL = "http://localhost:3000/stories";

function App() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [charCount, setCharCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Load stories from backend
  const loadStories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStories(data.reverse()); // newest first
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  // Publish story
  const publishStory = async () => {
    if (!title || !story || !category) {
      alert("Fill all fields");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, story, category }),
      });
      setTitle("");
      setStory("");
      setCategory("");
      setCharCount(0);
      loadStories();
    } catch (err) {
      console.error("Error publishing story:", err);
    }
  };

  // Copy story
  const copyStory = (title, story) => {
    navigator.clipboard.writeText(title + "\n\n" + story);
    alert("Copied!");
  };

  // Filtered stories for search & category
  const filteredStories = stories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.story.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCat === "all" || s.category === filterCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Theme toggle */}
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Header */}
      <header>
        <h1>ScribbleHub</h1>
        <p>Share, like, bookmark, and explore stories</p>
      </header>

      <main className="container">
        {/* Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Poetry">Poetry</option>
            <option value="Diary">Diary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Story Form */}
        <section className="story-form">
          <h2>Write Your Story</h2>
          <input
            type="text"
            placeholder="Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>
              Select Category
            </option>
            <option value="Fiction">Fiction</option>
            <option value="Poetry">Poetry</option>
            <option value="Diary">Diary</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            placeholder="Your story..."
            maxLength={500}
            value={story}
            onChange={(e) => {
              setStory(e.target.value);
              setCharCount(e.target.value.length);
            }}
          />
          <div id="charCount">{charCount} / 500</div>
          <button onClick={publishStory}>Publish</button>
        </section>

        {/* Published Stories */}
        <section className="published-stories">
          <h2>Published Stories</h2>
          <div id="storiesContainer" className="stories-grid">
            {filteredStories.map((s) => (
              <div key={s._id} className="story-card">
                <h3>{s.title}</h3>
                <div className="timestamp">{new Date(s.createdAt).toLocaleString()}</div>
                <div className="category">{s.category}</div>
                <p>{s.story}</p>
                <div className="actions">
                  <button>❤️ Like</button>
                  <button>🔖 Bookmark</button>
                  <button onClick={() => copyStory(s.title, s.story)}>📋 Copy</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 ScribbleHub</p>
      </footer>
    </div>
  );
}

export default App;
