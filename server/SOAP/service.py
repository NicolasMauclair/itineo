from spyne import Application, rpc, ServiceBase, Float
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server

class VehiculeService(ServiceBase):
    @rpc(Float, Float, _returns=Float)
    def calculer_cout(ctx, distance, consommation):
        """ Calcule le coût d'un trajet en fonction de la distance et de la consommation. """
        prix_carburant = 1.8  # Prix du carburant au litre
        cout = (distance / 100) * consommation * prix_carburant
        return round(cout, 2)

# Création de l'application SOAP
application = Application(
    [VehiculeService],
    tns='spyne.vehicule.service',
    in_protocol=Soap11(),
    out_protocol=Soap11()
)

wsgi_application = WsgiApplication(application)

# Middleware pour ajouter les en-têtes CORS
class CORSMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            headers.append(('Access-Control-Allow-Origin', '*'))  # Remplace par ton IP si besoin
            headers.append(('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'))
            headers.append(('Access-Control-Allow-Headers', 'Content-Type, Authorization, SOAPAction'))
            
            # Si la requête est OPTIONS, on renvoie une réponse vide avec 200 OK
            if environ.get('REQUEST_METHOD') == 'OPTIONS':
                status = '200 OK'
                headers.append(('Content-Length', '0'))
                return start_response(status, headers, exc_info)
            
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)

# Application avec le middleware CORS
wsgi_application = CORSMiddleware(wsgi_application)

if __name__ == '__main__':
    server = make_server('0.0.0.0', 8000, wsgi_application)
    print("Serveur SOAP en cours d'exécution sur http://localhost:8000/?wsdl")
    server.serve_forever()
