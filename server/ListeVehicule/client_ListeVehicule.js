import express from "express";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";
import cors from 'cors';
import { vehicleListQuery, getVehicleDetailsQuery } from "./queries.js";
import dotenv from "dotenv";

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

dotenv.config();

// Configuration des en-têtes pour le client GraphQL
const headers = {
  "x-client-id": process.env.X_CLIENT_ID,
  "x-app-id": process.env.X_APP_ID,
};

// Initialisation du client GraphQL
const client = createClient({
  url: "https://api.chargetrip.io/graphql",
  exchanges: [cacheExchange, fetchExchange], 
  fetchOptions: {
    method: "POST",
    headers,
  },
});

// Route pour récupérer la liste des véhicules
app.get("/api/vehicles", async (req, res) => {
  const { page = 0, size = 10, search = "" } = req.query;

  try {
    const response = await getVehicleList({ page, size, search }); 
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch vehicle list", details: error.message });
  }
});

// Route pour récupérer les détails d'un véhicule spécifique
app.get("/api/vehicles/:vehicleId", async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const response = await getVehicleDetails(vehicleId);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch vehicle details", details: error.message });
  }
});

/**
 * Fonction pour récupérer la liste des véhicules.
 * @param { Object } options - Les paramètres pour la requête GraphQL.
 * @param { number } options.page - Page actuelle.
 * @param { number } options.size - Nombre d'éléments par page.
 * @param { string } options.search - Mot-clé pour filtrer les résultats.
 * @returns { Promise<Object> } - Les données de la liste des véhicules.
 */
export const getVehicleList = async ({ page, size = 10, search = "" }) => {
  try {
    const response = await client.query(vehicleListQuery, { page, size, search }).toPromise();
    return response.data?.vehicleList || []; // Retourne la liste des véhicules ou un tableau vide
  } catch (error) {
    throw new Error("Failed to fetch vehicle list");
  }
};

/**
 * Fonction pour récupérer les détails d'un véhicule spécifique.
 * @param { string } vehicleId - ID du véhicule à récupérer.
 * @returns { Promise<Object> } - Les détails du véhicule.
 */
export const getVehicleDetails = async (vehicleId) => {
  try {
    const response = await client.query(getVehicleDetailsQuery, { vehicleId }).toPromise();
    return response.data?.vehicle || {}; // Retourne les détails du véhicule ou un objet vide
  } catch (error) {
    throw new Error("Failed to fetch vehicle details");
  }
};

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
