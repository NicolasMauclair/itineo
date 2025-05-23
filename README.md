# Itineo

Itineo est une application web permettant de rechercher et d'optimiser des trajets en voiture à partir d'une carte interactive. Elle utilise OpenStreetMap pour afficher les itinéraires et intégrer des fonctionnalités comme la recherche d'itinéraire, la gestion des véhicules disponibles et l'affichage des bornes de recharge à proximité.\n
L’ensemble de l’application est conteneurisé avec Docker, ce qui permet une mise en route rapide et isolée de l’environnement.

## Installation

1. Clonez le dépôt :
   ```sh
   git clone https://github.com/NicolasMauclair/itineo.git
   cd itineo
   ```

2. Lancez le conteneur Docker :
   ```sh
   docker-compose up --build
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
http://localhost:3001/calculateDistance?lat1=10.0&lon1=1.5&lat2=45.1&lon2=2.0
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
http://localhost:3001/adressToCoords?adresse=Paris
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
http://localhost:3001/getItineraire?ad1=5.911581,45.693458&ad2=4.835571,45.732398
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
http://localhost:3001/getListeVehicule
```

---

### 5. Récupérer les détails d'un véhicule
Renvoie les informations détaillées d'un véhicule spécifique.

**Requête :**
```
GET /getDetailVehicule/{id_vehicule}
```

## Technologies utilisées
- **Frontend :** HTML, CSS, JavaScript
- **Backend :** Node.js, Express
- **Cartographie :** OpenStreetMap
- **Conteneurisation** : Docker

## Auteurs
- [NicolasMauclair](https://github.com/NicolasMauclair)

