
import React, { useState, useEffect } from "react";
import "./style.css";

function App() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [likes, setLikes] = useState({}); // track likes per story
  const [bookmarks, setBookmarks] = useState({}); // track bookmarks

  const API_URL = "http://localhost:3000/stories";

  // Load stories from backend
  const loadStories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStories(data);
    } catch (err) {
      console.error("Error loading stories:", err);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  // Publish new story
  const publishStory = async () => {
    if (!title || !story || !category) {
      alert("Fill all fields");
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, story, category }),
      });
      if (!res.ok) throw new Error("Failed to publish story");
      setTitle("");
      setStory("");
      setCategory("");
      loadStories();
    } catch (err) {
      console.error("Error publishing story:", err);
    }
  };

  // Like a story
  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Bookmark a story
  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy story
  const copyStory = (title, story) => {
    navigator.clipboard.writeText(title + "\n\n" + story);
    alert("Copied!");
  };

  // Filtered stories based on search and category
  const filteredStories = stories
    .filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.story.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) => filterCat === "all" || s.category === filterCat);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Theme Toggle */}
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

      {/* Main */}
      <main className="container">
        {/* Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            value={story}
            onChange={(e) => setStory(e.target.value)}
            maxLength={500}
          ></textarea>
          <div>{story.length} / 500</div>
          <button onClick={publishStory}>Publish</button>
        </section>

        {/* Published Stories */}
        <section className="published-stories">
          <h2>Published Stories</h2>
          <div className="stories-grid">
            {filteredStories.length === 0 && <p>No stories found.</p>}
            {filteredStories.map((s) => (
              <div key={s._id} className="story-card">
                <h3>{s.title}</h3>
                <div className="timestamp">{new Date(s.createdAt).toLocaleString()}</div>
                <div className="category">{s.category}</div>
                <p>{s.story}</p>
                <div className="actions">
                  <button onClick={() => toggleLike(s._id)}>
                    {likes[s._id] ? "❤️ Liked" : "❤️ Like"}
                  </button>
                  <button onClick={() => toggleBookmark(s._id)}>
                    {bookmarks[s._id] ? "🔖 Bookmarked" : "🔖 Bookmark"}
                  </button>
                  <button onClick={() => copyStory(s.title, s.story)}>📋 Copy</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 ScribbleHub</p>
      </footer>
    </div>
  );
}

export default App;