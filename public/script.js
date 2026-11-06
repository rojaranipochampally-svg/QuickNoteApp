const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesGrid = document.getElementById("notesGrid");
const noteCount = document.getElementById("noteCount");
const formMessage = document.getElementById("formMessage");

async function loadNotes() {
  try {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("Could not load notes.");
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    notesGrid.innerHTML = `<div class="empty-state"><h3>Couldn't load notes</h3><p>${escapeHtml(error.message)}</p></div>`;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderNotes(notes) {
  noteCount.textContent = notes.length;
  if (!notes.length) {
    notesGrid.innerHTML = `<div class="empty-state"><span class="empty-icon">✧</span><h3>Your space is waiting</h3><p>Create your first note above. It will appear here.</p></div>`;
    return;
  }

  notesGrid.innerHTML = notes.map(note => `
    <article class="note-card">
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <div class="note-meta">
        <span>${new Date(note.createdAt).toLocaleString()}</span>
        <button class="delete-button" data-id="${escapeHtml(note.id)}" aria-label="Delete ${escapeHtml(note.title)}">Delete ×</button>
      </div>
    </article>
  `).join("");
}

noteForm.addEventListener("submit", async event => {
  event.preventDefault();
  formMessage.textContent = "";
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    formMessage.textContent = "Please fill in both fields.";
    return;
  }

  const submitButton = noteForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not save note.");
    noteForm.reset();
    await loadNotes();
    formMessage.style.color = "#416b56";
    formMessage.textContent = "Note saved!";
  } catch (error) {
    formMessage.style.color = "#b14b43";
    formMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Save note <span>↗</span>';
  }
});

notesGrid.addEventListener("click", async event => {
  const button = event.target.closest(".delete-button");
  if (!button) return;

  button.disabled = true;
  try {
    const response = await fetch(`/api/notes/${encodeURIComponent(button.dataset.id)}`, {
      method: "DELETE"
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not delete note.");
    await loadNotes();
  } catch (error) {
    alert(error.message);
    button.disabled = false;
  }
});

loadNotes();
