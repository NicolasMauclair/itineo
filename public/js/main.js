import {
  getCoordinates,
  getBorneProximate,
  getItineraire,
  recup_liste_vehicule,
} from "../function.js";

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction de création de balise
function create(tagName, container, text = null, classs = null, id = null) {
  let element = document.createElement(tagName);
  container.appendChild(element);
  if (text) element.appendChild(document.createTextNode(text));
  if (classs) element.classList.add(classs);
  if (id) element.id = id;
  return element;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour afficher une pop-up
function affichePopup(msg) {
  let popup = document.getElementById("popup");
  let msg_popup = document.getElementById("message_popup");
  popup.classList.remove("hide");
  msg_popup.innerHTML = msg;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour désactiver une pop-up
function desactivePopup() {
  let popup = document.getElementById("popup");
  popup.classList.add("hide");
}

// ---------------------------------------------------------
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction qui dessine un trajet sur la map
function dessinerItineraire(route, map) {
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
function dessinePoint(point, map) {
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

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction qui affiche la liste des véhicules
function afficheVehicule(lst_vehicule, distance) {
  let container = document.getElementById("container_vehicules");
  for (let voiture of lst_vehicule) {
    let containerVehicule = create(
      "div",
      container,
      null,
      "container-vehicule"
    );

    // Image du véhicule
    let imageContainer = create(
      "div",
      containerVehicule,
      null,
      "image-container"
    );
    let img = create("img", imageContainer, null, "vehicle-image");
    img.src = voiture.media.image.url;

    // Informations du véhicule
    let dataContainer = create(
      "div",
      containerVehicule,
      null,
      "data-container"
    );
    create("h3", dataContainer, voiture.naming.make, "vehicle-make");
    create("p", dataContainer, voiture.naming.model, "vehicle-model");
    create(
      "p",
      dataContainer,
      `Version: ${voiture.naming.chargetrip_version}`,
      "vehicle-version"
    );
  }

  let container_vehicules = document.getElementById("container_vehicules");
  let vehicule = document.querySelectorAll(".container-vehicule");
  let vehicule_data = document.getElementById("data_trajet");
  for (let i = 0; i < vehicule.length; i++) {
    vehicule[i].addEventListener("click", function () {
      container_vehicules.classList.add("hide");
      vehicule_data.classList.remove("hide");
      console.log(lst_vehicule[i]);
      create("p", vehicule_data, lst_vehicule[i].naming.make);
      create("h3", vehicule_data, lst_vehicule[i].naming.model);

      let container_data1 = create(
        "div",
        vehicule_data,
        null,
        "container_data"
      );
      create("p", container_data1, "Distance :");
      create("p", container_data1, distance);
      create("p", container_data1, "km");
      let container_data2 = create(
        "div",
        vehicule_data,
        null,
        "container_data"
      );
      create("p", container_data2, "Autonomie :");
      create("p", container_data2, lst_vehicule[i].naming.make);
      create("p", container_data2, "km");
      let container_data3 = create(
        "div",
        vehicule_data,
        null,
        "container_data"
      );
      create("p", container_data3, "Chargement :");
      create("p", container_data3, lst_vehicule[i].naming.make);
      create("p", container_data3, "mn");
    });
  }
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour rechercher un trajet
async function recherche_trajet(
  map,
  adresse_depart,
  adresse_arrivee,
  worst_d,
  rayon
) {
  // Récupère les coordonnées des deux adresses
  const departCoords = await getCoordinates(adresse_depart);
  const arriveeCoords = await getCoordinates(adresse_arrivee);

  // Vérifie que les 2 adresses récupérées existent
  if (departCoords == null || arriveeCoords == null) {
    affichePopup("Adresse introuvable");
    setTimeout(function () {
      desactivePopup();
    }, 3000);
  } else {
    // Récupère l'itinéraire
    let res = await getItineraire(departCoords, arriveeCoords);

    // Vérifie que l'itinéraire existe
    if (res != null) {
      let lst_point = res["lst_point"];
      let data_stat = res["data_stat"];

      // Récupère la borne la plus proche
      let lst_borne = await getBorneProximate(lst_point, worst_d, rayon);

      // Trajet est réalisable sans passer par une borne
      if (data_stat["distance"] < worst_d * 1000) {
        dessinerItineraire(res["lst_point"], map);
      } else {
        lst_borne.unshift(departCoords);
        lst_borne.push(arriveeCoords);

        for (let i = 0; i < lst_borne.length - 1; i++) {
          let route = await getItineraire(lst_borne[i], lst_borne[i + 1]);
          dessinerItineraire(route["lst_point"], map);

          if (i != 0) {
            dessinePoint(lst_borne[i], map);
          }
        }
      }
      desactivePopup();

      let lst_vehicule = await recup_liste_vehicule();
      if (lst_vehicule.length > 0) {
        afficheVehicule(lst_vehicule, data_stat["distance"]/1000);
      }
    } else {
      affichePopup("Itinéraire introuvable");
      setTimeout(function () {
        desactivePopup();
      }, 3000);
    }
  }
}

// ------------------------- MAIN --------------------------
// ---------------------------------------------------------

let maps = null;
maps = initializeMap(maps);

let fermeture_data_vehicule = document.getElementById(
  "fermeture_data_vehicule"
);
fermeture_data_vehicule.addEventListener("click", function () {
  document.getElementById("data_trajet").classList.add("hide");
  document.getElementById("container_vehicules").classList.remove("hide");
});

// Récupération de la liste des véhicules

// Gestion de l'affichage des véhicules
let fermeture = document.getElementById("fermeture_container");
let vehicules = document.getElementById("container_vehicules");
let icone = document.getElementById("fermeture_icon");
fermeture.addEventListener("click", function () {
  vehicules.classList.toggle("hide");
  icone.classList.toggle("bx-chevron-down");
  icone.classList.toggle("bx-chevron-up");
});

// Recherche du trajet
document
  .getElementById("addressForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const adresse_depart = document.getElementById("adresse_depart").value;
    const adresse_arrivee = document.getElementById("adresse_arrivee").value;

    affichePopup("Recherche en cours...");
    recherche_trajet(maps, adresse_depart, adresse_arrivee, 200, 1);
  });

// Bouton pour échanger les adresses
let button_change = document.getElementById("change");
button_change.addEventListener("click", function () {
  let adresse_depart = document.getElementById("adresse_depart").value;
  let adresse_arrivee = document.getElementById("adresse_arrivee").value;
  document.getElementById("adresse_depart").value = adresse_arrivee;
  document.getElementById("adresse_arrivee").value = adresse_depart;
});

// Bouton pour réinitialiser la carte
let button_reset = document.getElementById("reset");
button_reset.addEventListener("click", function () {
  maps = resetMap(maps);
});
