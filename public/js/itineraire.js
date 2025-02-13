import {
  getCoordinates,
  getBorneProximate,
  getItineraire,
} from "./function.js";
import { dessinePoint, dessinerItineraire } from "./map.js";
import { afficheError } from "./ui.js";

export function addMarker(map, lat, lng, iconUrl) {
  const customIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [7, 32],
    popupAnchor: [0, -32],
  });

  L.marker([lat, lng], { icon: customIcon }).addTo(map);
}

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
    afficheError("Une adresse n'existe pas");
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
        addMarker(map, departCoords[1], departCoords[0], "flag.svg");
        addMarker(map, arriveeCoords[1], arriveeCoords[0], "flag.svg");

      } else {
        // Récupère la borne la plus proche
        let lst_borne = await getBorneProximate(lst_point, worst_d, rayon);

        lst_borne.unshift(departCoords);
        lst_borne.push(arriveeCoords);
        for (let i = 0; i < lst_borne.length - 1; i++) {
          let route = await getItineraire(lst_borne[i], lst_borne[i + 1]);
          dessinerItineraire(route["lst_point"], map);
          if (i == 0) {
            addMarker(map, lst_borne[i][1], lst_borne[i][0], "flag.svg");
          } else {
            dessinePoint(lst_borne[i], map);
          }
        }
        addMarker(map, arriveeCoords[1], arriveeCoords[0], "flag.svg");
      }

      return data_stat = res["data_stat"];

      // Aucun trajet récupéré
    } else {
      afficheError("L'itinéraire n'a pas été trouvé");
    }
  }
}
