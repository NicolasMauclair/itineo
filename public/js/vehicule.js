import { create } from "./utils.js";

async function callCalcCout(distance, consommation) {
  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="spyne.vehicule.service">
     <soapenv:Header/>
     <soapenv:Body>
        <web:calculer_cout>
           <web:distance>${parseFloat(distance)}</web:distance>
           <web:consommation>${parseFloat(consommation)}</web:consommation>
        </web:calculer_cout>
     </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const response = await fetch("http://localhost:8000", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      body: soapRequest,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch: " + response.statusText);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Une erreur est survenue lors du calcul du coût :", error);
  }
}

// Fonction qui affiche la liste des véhicules
export async function afficheVehicule(lst_vehicule) {
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
      "Autonomie : " + voiture.range.chargetrip_range.worst + "km",
      "vehicle-autonomy"
    );
  }

  return true;
}
