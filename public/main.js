import { initializeMap, resetMap } from "./js/map.js";
import { recherche_trajet } from "./js/itineraire.js";
import { recup_liste_vehicule } from "./js/function.js";
import { afficheVehicule } from "./js/vehicule.js";

// ------------------------- INITIALISATION -------------------------

let maps = initializeMap(null);

document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  let lst_vehicule = await recup_liste_vehicule();
  if (lst_vehicule.length > 0) {
    console.log(lst_vehicule);
    afficheVehicule(lst_vehicule, 5000 / 1000);
  }
});

// ------------------------- GESTION DES ÉVÉNEMENTS -------------------------

function setupEventListeners() {
  // Fermeture des données véhicules
  document
    .getElementById("fermeture_data_vehicule")
    ?.addEventListener("click", toggleDataVehicule);

  // Gestion de l'affichage des véhicules
  document
    .getElementById("fermeture_container")
    ?.addEventListener("click", toggleVehiculeContainer);

  // Recherche du trajet
  document
    .getElementById("addressForm")
    ?.addEventListener("submit", rechercherTrajet);

  // Bouton pour échanger les adresses
  document
    .getElementById("change")
    ?.addEventListener("click", echangerAdresses);

  // Bouton pour réinitialiser la carte
  document.getElementById("reset")?.addEventListener("click", resetCarte);

  // Gestion de l'overlay et de la pop-up
  document
    .getElementById("button_error")
    ?.addEventListener("click", fermerPopup);
}

// ------------------------------- FONCTIONS -------------------------------

function toggleDataVehicule() {
  document.getElementById("data_trajet").classList.add("hide");
  document.getElementById("container_vehicules").classList.remove("hide");
}

function toggleVehiculeContainer() {
  let vehicules = document.getElementById("container_vehicules");
  let icone = document.getElementById("fermeture_icon");

  vehicules.classList.toggle("hide");
  icone.classList.toggle("bx-chevron-down");
  icone.classList.toggle("bx-chevron-up");
}

function fermerPopup() {
  document.getElementById("popup_error").classList.toggle("hide");
  document.getElementById("overlay").classList.toggle("overlay-active");
}

async function rechercherTrajet(event) {
  event.preventDefault();

  const adresse_depart = document.getElementById("adresse_depart").value;
  const adresse_arrivee = document.getElementById("adresse_arrivee").value;
  recherche_trajet(maps, adresse_depart, adresse_arrivee, 200, 10);
}

function echangerAdresses() {
  let departInput = document.getElementById("adresse_depart");
  let arriveeInput = document.getElementById("adresse_arrivee");

  [departInput.value, arriveeInput.value] = [
    arriveeInput.value,
    departInput.value,
  ];
}

function resetCarte() {
  maps = resetMap(maps);
}
