# QuickNote App

## Run it on Windows

1. Extract the ZIP file.
2. Open the extracted `QuickNoteApp` folder in VS Code (File → Open Folder).
3. Open Terminal → New Terminal.
4. Run `npm install` (only needed the first time).
5. Run `npm start`.
6. Open https://quicknoteapp-zzmi.onrender.com/ in your browser.

Keep the terminal running while you use the app. Notes are stored locally in `data/notes.json`.

## Project structure

- `server.js` — Express backend and API
- `public/index.html` — page structure
- `public/style.css` — design
- `public/script.js` — frontend behaviour and API calls
- `data/notes.json` — local JSON storage
