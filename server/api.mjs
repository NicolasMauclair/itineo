import express from "express";
  import path from "path";
  import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {
  calculateDistance,
  getCoordinates,
  getItineraire,
} from "../public/js/function.js";
import dotenv from "dotenv";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requetes"
});

dotenv.config();

const app = express();
const port = process.env.PORT_API;

// Permet les requêtes CORS
app.use(cors());

// Evite les attaques DDOS
app.use(limiter);

// Récupère le chemin du fichier courant pour gérer __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

// Route vers la page web
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
    const response = await fetch("http://localhost:" + process.env.PORT_API_VEHICULES + "/api/vehicles");
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
    const response = await fetch("http://localhost:" + process.env.PORT_API_VEHICULES + "/api/vehicles/${vehicleId}");
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
