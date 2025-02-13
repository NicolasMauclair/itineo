// Fonction pour afficher une pop-up d'erreur
export function afficheError(msg) {
  document.getElementById("popup_error").classList.toggle("hide");
  document.getElementById("overlay").classList.toggle("overlay-active");
  document.getElementById("error_type").innerHTML = msg;
  console.log("afficheError: " + msg);
}