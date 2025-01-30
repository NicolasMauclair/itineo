// Fonction qui initialise la carte
function initializeMap(map) {
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
function resetMap(map) {
  map = initializeMap(map);
  document.getElementById("reset").style.display = "none";
  document.getElementById("data_itineraire").style.display = "none";
  document.getElementById("adresse_depart").value = "";
  document.getElementById("adresse_arrivee").value = "";
  return map;
}