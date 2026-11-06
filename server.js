const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2), "utf8");
}

app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

app.post("/api/notes", (req, res) => {
  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "Please enter both a title and note." });
  }

  const notes = readNotes();
  const note = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.unshift(note);
  writeNotes(notes);
  res.status(201).json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const updated = notes.filter(note => note.id !== req.params.id);

  if (updated.length === notes.length) {
    return res.status(404).json({ message: "Note not found." });
  }

  writeNotes(updated);
  res.json({ message: "Note deleted." });
});

app.listen(PORT, () => {
  console.log(`Quick Note App is running at http://localhost:${PORT}`);
});
