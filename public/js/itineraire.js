let errorDisplayed = false;

import {
  getCoordinates,
  getBorneProximate,
  getItineraire,
} from "./function.js";
import { dessinePoint, dessinerItineraire, addMarker } from "./map.js";
import { afficheError } from "./ui.js";

// Fonction pour rechercher un trajet
export async function recherche_trajet(
  map,
  adresse_depart,
  adresse_arrivee,
  worst_d,
  rayon
) {
  if (errorDisplayed) return null;

  // Récupère les coordonnées des deux adresses
  const departCoords = await getCoordinates(adresse_depart);
  const arriveeCoords = await getCoordinates(adresse_arrivee);

  // Vérifie que les 2 adresses récupérées existent
  if (departCoords == null || arriveeCoords == null) {
    errorDisplayed = true;  // Indique qu'une erreur a été affichée
    afficheError("Une adresse n'existe pas");
    return null;
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
        addMarker(map, departCoords[1], departCoords[0], "static/flag.svg");
        addMarker(map, arriveeCoords[1], arriveeCoords[0], "static/flag.svg");

        return data_stat;

      } else {

        let duree = 0;
        let distance = 0;

        // Récupère la borne la plus proche
        let lst_borne = await getBorneProximate(lst_point, worst_d, rayon);

        lst_borne.unshift(departCoords);
        lst_borne.push(arriveeCoords);
        for (let i = 0; i < lst_borne.length - 1; i++) {
          let route = await getItineraire(lst_borne[i], lst_borne[i + 1]);
          duree += route.data_stat.duration;
          distance += route.data_stat.distance;
          dessinerItineraire(route["lst_point"], map);
          if (i == 0) {
            addMarker(map, lst_borne[i][1], lst_borne[i][0], "static/flag.svg");
          } else {
            dessinePoint(lst_borne[i], map);
          }
        }
        addMarker(map, arriveeCoords[1], arriveeCoords[0], "static/flag.svg");

        return  {
          distance: distance,
          duration: duree
        };
      }
    } else {
      errorDisplayed = true;
      afficheError("L'itinéraire n'a pas été trouvé");
      return null;
    }
  }
}