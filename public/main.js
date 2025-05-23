// ------------------------- IMPORTS -------------------------
// Importation des modules nécessaires pour la gestion de la carte, l'itinéraire et les véhicules
import { initializeMap, resetMap } from "./js/map.js";
import { recherche_trajet } from "./js/itineraire.js";
import { recup_liste_vehicule, secondToHour } from "./js/function.js";
import { afficheVehicule } from "./js/vehicule.js";
import { afficheError } from "./js/ui.js";

// ------------------------- INITIALISATION -------------------------
// Initialisation de la carte avec une valeur null par défaut
let maps = initializeMap(null);


// Exécution du code lorsque le DOM est complètement chargé
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners(); // Mise en place des écouteurs d'événements

  try {
    // Récupération de la liste des véhicules disponibles
    let lst_vehicule = await recup_liste_vehicule();
    console.log(lst_vehicule);
    
    // Vérification de la présence de véhicules
    if (lst_vehicule.length > 0) {
      setupVehiculeSelection(lst_vehicule);
    } else {
      afficheError("Aucun véhicule disponible"); // Affichage d'une erreur si aucun véhicule n'est trouvé
    }
  } catch (error) {
    afficheError("Erreur dans la récupération des véhicules"); // Gestion des erreurs
  }
});

// ------------------------- GESTION DES ÉVÉNEMENTS -------------------------
// Fonction pour attacher des écouteurs d'événements aux éléments de l'interface utilisateur
function setupEventListeners() {
  addClickListener("fermeture_data_vehicule", toggleDataVehicule);
  addClickListener("fermeture_container", toggleVehiculeContainer);
  addClickListener("send", afficherChoixVehicule);
  addClickListener("back", afficherChoixDestination);
  addClickListener("change", echangerAdresses);
  addClickListener("button_error", fermerPopup);
}

// Fonction pour initialiser l'affichage des véhicules et leur sélection
function setupVehiculeSelection(lst_vehicule) {
  document.getElementById("send").addEventListener("click", async () => {
    await afficheVehicule(lst_vehicule); // Affichage des véhicules disponibles
    setupVehiculeClickListener(lst_vehicule); // Ajout des écouteurs d'événements sur les véhicules
  });
}

// Fonction pour gérer la sélection d'un véhicule et lancer la recherche d'itinéraire
function setupVehiculeClickListener(lst_vehicule) {
  document.querySelectorAll(".container-vehicule").forEach((vehicule, i) => {
    vehicule.addEventListener("click", async () => {
      maps = resetMap(maps); // Réinitialisation de la carte
      data_trajet(); // Masquer les données de trajet
      document.getElementById("chargement").classList.add("active"); // Affichage de l'animation de chargement

      // Recherche du trajet en fonction du véhicule sélectionné
      const result = await recherche_trajet(
        maps,
        document.getElementById("adresse_depart").value,
        document.getElementById("adresse_arrivee").value,
        lst_vehicule[i].range.chargetrip_range.worst,
        10
      );

      // Mise à jour de l'interface utilisateur si un trajet est trouvé
      if (result) {
        updateTrajetInfo(result);
        document.getElementById("chargement").classList.remove("active");
      }
    });
  });
}

// ------------------------- ACTIONS PRINCIPALES -------------------------
// Fonction pour afficher la section de sélection des véhicules
function afficherChoixVehicule() {
  document.getElementById("addressForm").classList.toggle("hide"); // Masquer le formulaire d'adresse
  document.getElementById("vehiculeForm").classList.remove("hide"); // Afficher le formulaire de sélection des véhicules
}

// Fonction pour afficher la section de saisie d'adresse et réinitialiser la carte
function afficherChoixDestination() {
  start(); // Réinitialisation de l'affichage
  maps = resetMap(maps); // Réinitialisation de la carte
}

// Fonction pour mettre à jour les informations du trajet (distance et durée)
function updateTrajetInfo(result) {
  document.getElementById("data_trajet_temps").classList.remove("hide");
  document.getElementById("data_trajet_distance").classList.remove("hide");
  document.getElementById("distance-data").innerText = (result.distance.toFixed(3) / 1000) + " km";
  document.getElementById("temps-data").innerText = secondToHour(result.duration);
}

// ------------------------- INTERACTIONS UI -------------------------
// Fonction pour masquer les détails du trajet et revenir à la liste des véhicules
function toggleDataVehicule() {
  document.getElementById("data_trajet").classList.add("hide");
  document.getElementById("container_vehicules").classList.remove("hide");
}

// Fonction pour afficher/masquer le conteneur des véhicules et changer l'icône correspondante
function toggleVehiculeContainer() {
  let vehicules = document.getElementById("container_vehicules");
  let icone = document.getElementById("fermeture_icon");

  vehicules.classList.toggle("hide");
  icone.classList.toggle("bx-chevron-left");
  icone.classList.toggle("bx-chevron-right");
}

// Fonction pour fermer la popup d'erreur et réinitialiser l'affichage
function fermerPopup() {
  document.getElementById("popup_error").classList.add("hide");
  document.getElementById("overlay").classList.remove("overlay-active");
  start();
}

// Fonction pour inverser les adresses saisies (point de départ et d'arrivée)
function echangerAdresses() {
  let departInput = document.getElementById("adresse_depart");
  let arriveeInput = document.getElementById("adresse_arrivee");

  [departInput.value, arriveeInput.value] = [arriveeInput.value, departInput.value];
}

// ------------------------- UTILITAIRES -------------------------
// Fonction pour ajouter un écouteur d'événements "click" à un élément spécifique
function addClickListener(id, callback) {
  let element = document.getElementById(id);
  if (element) {
    element.addEventListener("click", callback);
  }
}

// Fonction pour masquer les informations du trajet
function data_trajet() {
  document.getElementById("data_trajet_temps").classList.add("hide");
  document.getElementById("data_trajet_distance").classList.add("hide");
}

// Fonction pour réinitialiser l'affichage de départ
function start() {
  document.getElementById("addressForm").classList.remove("hide");
  document.getElementById("vehiculeForm").classList.add("hide");
  document.getElementById("data_trajet_temps").classList.add("hide");
  document.getElementById("data_trajet_distance").classList.add("hide");
  document.getElementById("chargement").classList.remove("active");
}
