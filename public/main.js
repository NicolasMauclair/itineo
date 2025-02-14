// ------------------------- IMPORTS -------------------------
import { initializeMap, resetMap } from "./js/map.js";
import { recherche_trajet } from "./js/itineraire.js";
import { recup_liste_vehicule, secondToHour } from "./js/function.js";
import { afficheVehicule, test } from "./js/vehicule.js";
import { afficheError } from "./js/ui.js";

// ------------------------- INITIALISATION -------------------------
let maps = initializeMap(null);

document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  try {
    const res = await test();

    // Récupération de la liste des véhicules
    let lst_vehicule = await recup_liste_vehicule();

    if (lst_vehicule.length > 0) {
      setupVehiculeSelection(lst_vehicule);
    } else {
      afficheError("Aucun véhicule disponible");
    }
  } catch (error) {
    afficheError("Erreur dans la récupération des véhicules");
  }
});

// ------------------------- GESTION DES ÉVÉNEMENTS -------------------------
function setupEventListeners() {
  addClickListener("fermeture_data_vehicule", toggleDataVehicule);
  addClickListener("fermeture_container", toggleVehiculeContainer);
  addClickListener("send", afficherChoixVehicule);
  addClickListener("back", afficherChoixDestination);
  addClickListener("change", echangerAdresses);
  addClickListener("button_error", fermerPopup);
}

function setupVehiculeSelection(lst_vehicule) {
  document.getElementById("send").addEventListener("click", async () => {
    await afficheVehicule(lst_vehicule, 5);
    setupVehiculeClickListener(lst_vehicule);
  });
}

function setupVehiculeClickListener(lst_vehicule) {
  document.querySelectorAll(".container-vehicule").forEach((vehicule, i) => {
    vehicule.addEventListener("click", async () => {
      data_trajet();

      // Reinitialisation de la carte et affichage de la popup
      maps = resetMap(maps);
      document.getElementById("chargement").classList.add("active");

      // Recherche du trajet
      const result = await recherche_trajet(
        maps,
        document.getElementById("adresse_depart").value,
        document.getElementById("adresse_arrivee").value,
        lst_vehicule[i].range.chargetrip_range.worst,
        10
      );

      if (result != null) {
        // Mise à jour des informations du trajet
        updateTrajetInfo(result);
        document.getElementById("chargement").classList.remove("active");
      }
    });
  });
}

function updateTrajetInfo(result) {
  document.getElementById("data_trajet_temps").classList.remove("hide");
  document.getElementById("data_trajet_distance").classList.remove("hide");

  document.getElementById("distance-data").innerText =
    result.distance.toFixed(3) / 1000 + " km";
  document.getElementById("temps-data").innerText = secondToHour(
    result.duration
  );
}

// ------------------------------- FONCTIONS -------------------------------
function start() {
  document.getElementById("addressForm").classList.remove("hide");
  document.getElementById("vehiculeForm").classList.add("hide");
  document.getElementById("data_trajet_temps").classList.add("hide");
  document.getElementById("data_trajet_distance").classList.add("hide");
  document.getElementById("chargement").classList.remove("active");
}

function data_trajet() {
  document.getElementById("data_trajet_temps").classList.add("hide");
  document.getElementById("data_trajet_distance").classList.add("hide");
}

function afficherChoixVehicule() {
  document.getElementById("addressForm").classList.toggle("hide");
  document.getElementById("vehiculeForm").classList.remove("hide");
}

function afficherChoixDestination() {
  start();
  maps = resetMap(maps);
}

function toggleDataVehicule() {
  document.getElementById("data_trajet").classList.add("hide");
  document.getElementById("container_vehicules").classList.remove("hide");
}

function toggleVehiculeContainer() {
  let vehicules = document.getElementById("container_vehicules");
  let icone = document.getElementById("fermeture_icon");

  vehicules.classList.toggle("hide");
  icone.classList.toggle("bx-chevron-left");
  icone.classList.toggle("bx-chevron-right");
}

function fermerPopup() {
  document.getElementById("popup_error").classList.add("hide");
  document.getElementById("overlay").classList.remove("overlay-active");
  start();
}

function echangerAdresses() {
  let departInput = document.getElementById("adresse_depart");
  let arriveeInput = document.getElementById("adresse_arrivee");

  [departInput.value, arriveeInput.value] = [
    arriveeInput.value,
    departInput.value,
  ];
}

// ------------------------- UTILITAIRES -------------------------
function addClickListener(id, callback) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", callback);
  }
}
