// Fonction pour calculer la distance entre deux coordonnées
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000; // Rayon moyen de la Terre en mètres

  // Convertir les latitudes et longitudes de degrés en radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  // Différences des coordonnées
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Formule de Haversine
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance en mètres
  return earthRadius * c;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour obtenir les coordonnées d'une adresse
export async function getCoordinates(address) {
  const api_key = "5b3ce3597851110001cf62481cf3c27900c544c0a862d7868924615a";
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${api_key}&text=${encodeURIComponent(
    address
  )}`;

  const response = await fetch(url);
  const res = await response.json();
  if (res.features.length > 0) {
    return res.features[0].geometry.coordinates;
  } else {
    return null;
  }
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour obtenir le point le plus proche
export function getPointProche(lst_borne, point) {
  let point_proche = lst_borne[0];
  let distance = calculateDistance(
    point_proche["ylatitude"],
    point_proche["xlongitude"],
    point[0],
    point[1]
  );

  for (let i = 1; i < lst_borne.length; i++) {
    let d = calculateDistance(
      lst_borne[i]["ylatitude"],
      lst_borne[i]["xlongitude"],
      point[0],
      point[1]
    );
    if (d < distance) {
      distance = d;
      point_proche = lst_borne[i];
    }
  }
  return point_proche;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour obtenir la borne la plus proche
export async function getBorneProximate(lst_point, worst_d, rayon) {
  let distance = 0;
  let currentPoint = 0;

  let res = [];

  let nb_point = lst_point.length;

  // Parcours de la liste des coordonnées de l'itinéraire
  while (currentPoint < lst_point.length - 1) {
    distance += parseInt(
      calculateDistance(
        lst_point[currentPoint][0],
        lst_point[currentPoint][1],
        lst_point[currentPoint + 1][0],
        lst_point[currentPoint + 1][1]
      )
    );

    // Si la distance est suffisamment grande, on cherche la borne la plus proche
    if (distance >= worst_d * 1000) {
      const url =
        "https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?where=within_distance(geo_point_borne%2CGEOM%27POINT(" +
        lst_point[currentPoint][0] +
        "%20" +
        lst_point[currentPoint][1] +
        ")%27%2C" +
        rayon +
        "km)";

      const response = await fetch(url);
      const result = await response.json();
      if (result["total_count"] > 0) {
        // Récupère borne la plus proche
        let point_proche = getPointProche(
          result["results"],
          lst_point[currentPoint]
        );

        // Ajout de la borne
        res.push([point_proche["xlongitude"], point_proche["ylatitude"]]);
      }

      distance = 0;
    }

    currentPoint++;
  }

  return res;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour obtenir l'itinéraire entre deux adresses
export async function getItineraire(departCoords, arriveeCoords) {
  const api_key = "5b3ce3597851110001cf62481cf3c27900c544c0a862d7868924615a";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${api_key}&start=${departCoords[0]},${departCoords[1]}&end=${arriveeCoords[0]},${arriveeCoords[1]}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null
    }

    const data = await response.json();

    // Statistiques de l'itinéraire
    let data_stat = data["features"][0]["properties"]["summary"];

    // Liste des coordonnées de l'itinéraire
    let lst_point = data["features"][0]["geometry"]["coordinates"];

    return {
      lst_point: lst_point,
      data_stat: data_stat,
    };

  } catch (error) {
    return null;
  }
}


// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour récupérer la liste des véhicules
export async function recup_liste_vehicule() {
  let res = [];
  try {
    // Récupération de la liste des véhicules
    const response = await fetch("http://localhost:3001/api/vehicles");
    if (!response.ok) {
      throw new Error(
        `Erreur HTTP lors de la récupération des véhicules : ${response.status}`
      );
    }
    const vehicles = await response.json();

    // Récupération des détails pour chaque véhicule
    for (const vehicle of vehicles) {
      try {
        const detailsResponse = await fetch(
          `http://localhost:3001/api/vehicles/${vehicle.id}`
        );
        if (!detailsResponse.ok) {
          throw new Error(
            `Erreur HTTP pour le véhicule ${vehicle._id} : ${detailsResponse.status}`
          );
        }
        const details = await detailsResponse.json();
        res.push(details);
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des détails pour le véhicule ${vehicle._id} :`,
          error
        );
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des véhicules :",
      error
    );
  }
  return res;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

export function secondToHour(second) {
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second % 3600) / 60);
  const seconds = second % 60;
  return `${hours}h${minutes}min`;
}
