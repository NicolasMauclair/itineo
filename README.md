# FastRoute
application web permettant de rechercher et d’optimiser des trajets en voiture à partir d’une carte interactive. Elle utilise OpenStreetMap pour afficher les itinéraires et intégrer des fonctionnalités comme la recherche d’itinéraire, la gestion des véhicules disponibles et l’affichage des bornes de recharge à proximité.

Endpoints API :

Récupérer distance entre 2 points
http://localhost:3000/calculateDistance?lat1=10.0&lon1=1.5&lat2=45.1&lon2=2.0

Récupérer coordonnée adresse
http://localhost:3000/adressToCoords?adresse=Paris

Récupérer l'itinéraire
http://localhost:3000/getItineraire?ad1=5.911581,45.693458&ad2=4.835571,45.732398

Récupérer liste véhicule
http://localhost:3000/getListeVehicule

Récupérer détail véhicule
http://localhost:3000/getDetailVehicule/5f043d88bc262f1627fc032b
