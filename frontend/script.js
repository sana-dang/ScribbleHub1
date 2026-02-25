const titleInput = document.getElementById("title");
const storyInput = document.getElementById("story");
const categorySelect = document.getElementById("category");
const publishBtn = document.getElementById("publishBtn");
const storiesContainer = document.getElementById("storiesContainer");
const toggleThemeBtn = document.getElementById("toggleTheme");
const searchBar = document.getElementById("searchBar");
const filterCategory = document.getElementById("filterCategory");
const charCount = document.getElementById("charCount");

const API_URL = "/stories";

async function loadStories() {
  const res = await fetch(API_URL);
  const stories = await res.json();
  renderStories(stories);
}

loadStories();

storyInput.addEventListener("input", () => {
  charCount.textContent = `${storyInput.value.length} / 500`;
});

publishBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const story = storyInput.value.trim();
  const category = categorySelect.value;
  if (!title || !story || !category) { alert("Fill all fields"); return; }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, story, category })
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Failed to publish story");
    return;
  }

  titleInput.value = "";
  storyInput.value = "";
  categorySelect.selectedIndex = 0;
  charCount.textContent = "0 / 500";
  loadStories();
});

function renderStories(stories) {
  storiesContainer.innerHTML = "";
  stories.forEach(s => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <h3>${s.title}</h3>
      <div class="timestamp">${new Date(s.createdAt).toLocaleString()}</div>
      <div class="category">${s.category}</div>
      <p>${s.story}</p>
      <div class="actions">
        <button class="like-btn">❤️ Like</button>
        <button class="bookmark-btn">🔖 Bookmark</button>
        <button class="copy-btn">📋 Copy</button>
      </div>
    `;
    card.querySelector(".copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(`${s.title}\n\n${s.story}`);
      alert("Copied!");
    });
    storiesContainer.appendChild(card);
  });
}

searchBar.addEventListener("input", async () => {
  const res = await fetch(API_URL);
  let stories = await res.json();
  const q = searchBar.value.toLowerCase();
  stories = stories.filter(s =>
    s.title.toLowerCase().includes(q) || s.story.toLowerCase().includes(q)
  );
  if (filterCategory.value !== "all") stories = stories.filter(s => s.category === filterCategory.value);
  renderStories(stories);
});

filterCategory.addEventListener("change", () => { searchBar.dispatchEvent(new Event("input")); });

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleThemeBtn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});