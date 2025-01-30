// Fonction pour afficher une pop-up
export function affichePopup(msg) {
  let popup = document.getElementById("popup");
  let msg_popup = document.getElementById("message_popup");
  popup.classList.remove("hide");
  msg_popup.innerHTML = msg;
}

// ---------------------------------------------------------
// ---------------------------------------------------------

// Fonction pour désactiver une pop-up
export function desactivePopup() {
  let popup = document.getElementById("popup");
  popup.classList.add("hide");
}