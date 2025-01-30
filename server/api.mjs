import express from 'express';
import { calculateDistance, getCoordinates, getPointProche,getBorneProximate } from '../public/function.js';
const app = express();
const port = 3000;
import cors from "cors";
app.use(cors());

/*
// Endpoints - Récupérer la distance entre deux coordonnées
app.get('/calculateDistance', (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;
  const result = calculateDistance(lat1, lon1, lat2, lon2);
  console.log(result);
  res.status(200).json({ distance: result });
});

// Endpoints - Récupérer les coordonnées d'une adresse
app.get('/adressToCoords', async (req, res) => {
  const adresse = req.query.adresse;
  try {
    const result = await getCoordinates(adresse);
    res.status(200).json({ distance: result });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des coordonnées.' });
  }
});


// Endpoints - Récupérer la borne la plus proche d'une coordonnée parmis une liste
app.get('/getBorneItineraire', (req, res) => {
  const lstBorne = JSON.parse(req.query.liste);pc
  const point = req.query.point;
  
  const pointProche = getPointProche(lstBorne, point);
  
  res.status(200).json({ pointProche });
});
//localhost:3000/getBorneitineraire?liste=[{"xlongitude":2.1,"ylatitude":40.5},{"xlongitude":2.2,"ylatitude":40.6},{"xlongitude":2.3,"ylatitude":40.7}]&point=[2.4,40.8]


/*
// Endpoints - Récupérer la liste des bornes d'un itinéraire
app.get('/api', (req, res) => {
  const result = calculateDistance(41, 2, 40, 1);
  console.log(result);
  res.status(200).json({ distance: result });
});

// Endpoints - 
app.get('/api', (req, res) => {
  const result = calculateDistance(41, 2, 40, 1);
  console.log(result);
  res.status(200).json({ distance: result });
});

*/

app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});
