from spyne import Application, rpc, ServiceBase, Integer, Double
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server

class VehiculeService(ServiceBase):
    @rpc(Double, Double, _returns=Double)
    def calculer_cout(ctx, distance, consommation):
        return distance * consommation * 0.2

application = Application(
    [VehiculeService],
    tns="spyne.vehicule.service",
    in_protocol=Soap11(validator="lxml"),
    out_protocol=Soap11(),
)

def cors_middleware(app):
    def middleware(environ, start_response):
        def custom_start_response(status, headers, exc_info=None):
            headers.append(("Access-Control-Allow-Origin", "*"))
            headers.append(("Access-Control-Allow-Methods", "POST, OPTIONS"))
            headers.append(("Access-Control-Allow-Headers", "Content-Type, SOAPAction"))
            return start_response(status, headers, exc_info)
        
        if environ["REQUEST_METHOD"] == "OPTIONS":
            start_response("200 OK", [
                ("Access-Control-Allow-Origin", "*"),
                ("Access-Control-Allow-Methods", "POST, OPTIONS"),
                ("Access-Control-Allow-Headers", "Content-Type, SOAPAction"),
                ("Content-Length", "0")
            ])
            return [b""]

        return app(environ, custom_start_response)
    
    return middleware

server = make_server('0.0.0.0', 8000, cors_middleware(WsgiApplication(application)))
print("✅ Serveur SOAP avec CORS démarré sur http://localhost:8000")
server.serve_forever()
