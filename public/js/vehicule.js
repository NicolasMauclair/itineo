import { create } from "./utils.js";

async function callCalcCout(distance, vitesse, energie) {
  const url = "http://localhost:8000/?wsdl";
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

  try {
    const response = await fetch("http://localhost:8000/?wsdl", {
      method: "POST",
      headers: {
        "Content-Type": "application/soap+xml",
      },
      body: soapRequest,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch: " + response.statusText);
    }
    const data = await response.text();
    console.log("Reponse: ", data);
  } catch (error) {
    console.error("Une erreur est survenue lors du calcul du coût :", error);
  }
}

// Fonction qui affiche la liste des véhicules
export async function afficheVehicule(lst_vehicule, distance) {
  let container_liste = document.getElementById("container_affichage_vehicule");
  let container = document.getElementById("container_vehicules");
  container_liste.classList.remove("hide");
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

      create("h3", vehicule_data, lst_vehicule[i].naming.model);
      create("p", vehicule_data, lst_vehicule[i].naming.make);

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

  try {
    const cout = await callCalcCout(distance, 100.0, 0.2);
    console.log("Coût calculé:", cout);
  } catch (error) {
    console.error("Une erreur est survenue lors du calcul du coût :", error);
  }
}
