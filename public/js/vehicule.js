import { create } from "./utils.js";
/*
async function callCalcCout(distance, vitesse, energie) {
  const url = "http://localhost:8000/?wsdl"; // URL du WSDL du service SOAP
  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://localhost:8000">
     <soapenv:Header/>
     <soapenv:Body>
        <web:calc_cout>
           <distance>${distance}</distance>
           <vitesse>${vitesse}</vitesse>
           <energie>${energie}</energie>
        </web:calc_cout>
     </soapenv:Body>
  </soapenv:Envelope>`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "http://localhost:8000/calc_cout", // Action SOAP pour calc_cout
    },
    body: soapRequest,
  });

  const text = await response.text(); // Réponse en XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  const result =
    xmlDoc.getElementsByTagName("calc_coutResponse")[0].textContent;
  return result;
}
*/

// Fonction qui affiche la liste des véhicules
export async function afficheVehicule(lst_vehicule, distance) {
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

      Array.from(vehicule_data.children).forEach((child) => {
        if (!child.id.includes("fermeture_data_vehicule")) {
          child.remove();
        }
      });

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

  /*
  try {
    const cout = await callCalcCout(distance, 100, 0.2); // Exemple de paramètres pour calc_cout
    console.log("Coût calculé:", cout);
  } catch {}
   */
  
}
