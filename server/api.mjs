import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Importer les fonctions
import {
  calculateDistance,
  getCoordinates,
  getItineraire,
  recup_liste_vehicule,
  getPointProche,
  getBorneProximate,
} from "../public/js/function.js";

// Créer l'application Express
const app = express();

// Définir le port
const port = process.env.PORT || 3000;

// Permettre les requêtes CORS
app.use(cors());

// Récupérer le chemin du fichier courant pour gérer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "../public")));

// Route d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Endpoints - Récupérer la distance entre deux coordonnées
app.get("/calculateDistance", (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;
  const result = calculateDistance(lat1, lon1, lat2, lon2);
  res.status(200).json({ distance: result });
});

// Endpoints - Récupérer les coordonnées d'une adresse
app.get("/adressToCoords", async (req, res) => {
  const adresse = req.query.adresse;
  try {
    const result = await getCoordinates(adresse);
    res.status(200).json({ coordinates: result });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des coordonnées.",
    });
  }
});

// Endpoints - Récupérer l'itinéraire entre deux coordonnées
app.get("/getItineraire", async (req, res) => {
  const { ad1, ad2 } = req.query;
  let formate_ad1 = ad1.split(",");
  let formate_ad2 = ad2.split(",");
  try {
    const result = await getItineraire(formate_ad1, formate_ad2);
    res.status(200).json({ Itinéraire: result });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération de l'itinéraire.",
      details: error.message,
    });
  }
});

// Endpoints - Récupérer la liste des véhicules
app.get("/getListeVehicule", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/api/vehicles");
    const result = await response.json();
    res.status(200).json({ vehicles: result });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des véhicules.",
      details: error.message,
    });
  }
});

// Endpoints - Récupérer les détails d'un véhicule à partir de son ID
app.get('/getDetailVehicule/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const response = await fetch(`http://localhost:3001/api/vehicles/${vehicleId}`);
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des détails du véhicule.",
      details: error.message,
    });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});
