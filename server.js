// Local development server for the Monk Food site (Node.js + Express).
// The live site is static and hosted on GitHub Pages, but this lets you
// preview it locally exactly as it will appear online.
//
//   npm install
//   npm run dev
//   → open http://localhost:3000
//
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the site (index.html, assets/, other pages) from this folder
app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(PORT, () => {
  console.log(`\n  Monk Food site running at http://localhost:${PORT}\n`);
});
