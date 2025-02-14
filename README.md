# FastRoute

FastRoute est une application web permettant de rechercher et d'optimiser des trajets en voiture à partir d'une carte interactive. Elle utilise OpenStreetMap pour afficher les itinéraires et intégrer des fonctionnalités comme la recherche d'itinéraire, la gestion des véhicules disponibles et l'affichage des bornes de recharge à proximité.

## Installation

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/votre-repo/FastRoute.git
   cd FastRoute
   ```

2. Installez les dépendances :
   ```sh
   npm install
   ```

3. Lancez le serveur :
   ```sh
   npm start
   ```

## Endpoints de l'API

### 1. Récupérer la distance entre deux points
Permet d'obtenir la distance en kilomètres entre deux coordonnées GPS.

**Requête :**
```
GET /calculateDistance?lat1={latitude1}&lon1={longitude1}&lat2={latitude2}&lon2={longitude2}
```

**Exemples :**
```
http://localhost:3000/calculateDistance?lat1=10.0&lon1=1.5&lat2=45.1&lon2=2.0
https://commetuveux.azurewebsites.net/calculateDistance?lat1=10.0&lon1=1.5&lat2=45.1&lon2=2.0
```

---

### 2. Récupérer les coordonnées d'une adresse
Convertit une adresse en coordonnées GPS.

**Requête :**
```
GET /adressToCoords?adresse={adresse}
```

**Exemples :**
```
http://localhost:3000/adressToCoords?adresse=Paris
https://commetuveux.azurewebsites.net/adressToCoords?adresse=Paris
```

---

### 3. Récupérer un itinéraire
Renvoie l'itinéraire entre deux adresses sous forme de coordonnées GPS.

**Requête :**
```
GET /getItineraire?ad1={latitude1,longitude1}&ad2={latitude2,longitude2}
```

**Exemples :**
```
http://localhost:3000/getItineraire?ad1=5.911581,45.693458&ad2=4.835571,45.732398
https://commetuveux.azurewebsites.net/getItineraire?ad1=5.911581,45.693458&ad2=4.835571,45.732398
```

---

### 4. Récupérer la liste des véhicules disponibles
Renvoie une liste des véhicules disponibles pour le trajet.

**Requête :**
```
GET /getListeVehicule
```

**Exemples :**
```
http://localhost:3000/getListeVehicule
https://commetuveux.azurewebsites.net/getListeVehicule
```

---

### 5. Récupérer les détails d'un véhicule
Renvoie les informations détaillées d'un véhicule spécifique.

**Requête :**
```
GET /getDetailVehicule/{id_vehicule}
```

**Exemples :**
```
http://localhost:3000/getDetailVehicule/5f043d88bc262f1627fc032b
https://commetuveux.azurewebsites.net/getDetailVehicule/5f043d88bc262f1627fc032b
```

## Technologies utilisées
- **Frontend :** HTML, CSS, JavaScript
- **Backend :** Node.js, Express
- **Cartographie :** OpenStreetMap

## Auteurs
- [NicolasMauclair](https://github.com/NicolasMauclair)

## Licence
Ce projet est sous licence MIT.

