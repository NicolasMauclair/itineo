// Fonction de création de balise
export function create(tagName, container, text = null, classs = null, id = null) {
  let element = document.createElement(tagName);
  container.appendChild(element);
  if (text) element.appendChild(document.createTextNode(text));
  if (classs) element.classList.add(classs);
  if (id) element.id = id;
  return element;
}