import {
  getCoordinates,
  getBorneProximate,
  getItineraire,
  recup_liste_vehicule,
} from "../function.js";
import { dessinePoint, dessinerItineraire } from "./map.js";
import { affichePopup, desactivePopup } from "./ui.js";
import { afficheVehicule } from "./vehicule.js";

// Fonction pour rechercher un trajet
export async function recherche_trajet(
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

      // Trajet est réalisable sans passer par une borne
      if (data_stat["distance"] < worst_d * 1000) {
        dessinerItineraire(res["lst_point"], map);

      } else {

        // Récupère la borne la plus proche
        let lst_borne = await getBorneProximate(lst_point, worst_d, rayon);

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