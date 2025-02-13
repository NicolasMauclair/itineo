// ------------------------- IMPORTS -------------------------
import { initializeMap, resetMap } from "./js/map.js";
import { recherche_trajet } from "./js/itineraire.js";
import { recup_liste_vehicule } from "./js/function.js";
import { afficheVehicule } from "./js/vehicule.js";
import { afficheError } from "./js/ui.js";

// ------------------------- INITIALISATION -------------------------
let maps = initializeMap(null);

document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();

  try {

    // Récupération de la liste des véhicules
    let lst_vehicule = await recup_liste_vehicule();

    if (lst_vehicule.length > 0) {
      // Choix du trajet réalisé
      document.getElementById("send").addEventListener("click", async () => {

        // Affichage de la liste des véhicules
        await afficheVehicule(lst_vehicule, 5);

        // Selection d'un véhicule
        document
          .querySelectorAll(".container-vehicule")
          .forEach((vehicule, i) => {
            vehicule.addEventListener("click", async () => {
              // Reinitialisation de la carte
              maps = resetMap(maps);

              // Affichage de la popup
              document.getElementById("chargement").classList.add("active");

              // Recherche du trajet
              await recherche_trajet(
                maps,
                document.getElementById("adresse_depart").value,
                document.getElementById("adresse_arrivee").value,
                lst_vehicule[i].range.chargetrip_range.worst,
                10
              );

              document.getElementById("chargement").classList.remove("active");

            });
          });
      });
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

// ------------------------------- FONCTIONS -------------------------------
function afficherChoixVehicule() {
  document.getElementById("addressForm").classList.toggle("hide");
  document.getElementById("vehiculeForm").classList.remove("hide");
}

function afficherChoixDestination() {
  document.getElementById("vehiculeForm").classList.toggle("hide");
  document.getElementById("addressForm").classList.remove("hide");
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
  document.getElementById("popup_error").classList.toggle("hide");
  document.getElementById("overlay").classList.toggle("overlay-active");
  document.getElementById("vehiculeForm").classList.toggle("hide");
  document.getElementById("addressForm").classList.remove("hide");
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
