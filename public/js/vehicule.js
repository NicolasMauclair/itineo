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
