// Serveur de développement pour le routing SPA
const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist')));

// Route pour toutes les pages (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur SPA démarré sur le port ${PORT}`);
  console.log(`📱 Application accessible sur http://localhost:${PORT}`);
}); 