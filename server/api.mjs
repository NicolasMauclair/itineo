import express from "express";
import {
  calculateDistance,
  getCoordinates,
  getItineraire,
  recup_liste_vehicule,
  getPointProche,
  getBorneProximate,
} from "../public/function.js";
const app = express();
const port = 3000;
import cors from "cors";
app.use(cors());

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
    res.status(200).json({ distance: result });
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
      error: "Une erreur est survenue lors de la récupération des coordonnées.",
      details: error.message,
    });
  }
});

// Endpoints - Récupérer la liste des véhicules
app.get("/getListeVehicule", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/api/vehicles");
    const result = await response.json();
    res.status(200).json({ Itinéraire: result });
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des coordonnées.",
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
      error: "Une erreur est survenue lors de la récupération des coordonnées.",
      details: error.message,
    });
  }
});


app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});
