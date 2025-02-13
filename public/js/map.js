// Fonction qui initialise la carte
export function initializeMap(map) {
  if (map !== null) {
    map.remove(); // Supprime l'instance existante
  }

  // Réinitialise la carte avec une nouvelle instance
  map = L.map("map").setView([47, 4], 6);
  // Ajouter la couche de base
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour réinitialiser la carte
export function resetMap(map) {
  map = initializeMap(map);
  return map;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction qui dessine un trajet sur la map
export function dessinerItineraire(route, map) {
  let routeGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: route,
        },
        properties: {},
      },
    ],
  };

  L.geoJSON(routeGeoJSON, {
    style: {
      color: "blue",
      weight: 4,
      opacity: 0.7,
    },
  }).addTo(map);
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction qui définit un point sur la map
export function dessinePoint(point, map) {
  L.geoJSON(
    [
      {
        type: "Point",
        coordinates: point,
      },
    ],
    {
      style: {
        color: "blue",
        weight: 4,
        opacity: 0.7,
      },
    }
  ).addTo(map);
}
