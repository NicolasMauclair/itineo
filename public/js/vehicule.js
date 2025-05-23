import { create } from "./utils.js";

// Fonction qui affiche la liste des véhicules
export async function afficheVehicule(lst_vehicule) {
  console.log(lst_vehicule)
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
