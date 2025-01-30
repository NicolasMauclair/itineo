from spyne import Application, rpc, ServiceBase, Iterable, Unicode, Integer, Float
from spyne.server.wsgi import WsgiApplication
from spyne.protocol.soap import Soap11

# source env/Scripts/activate

class soap_info(ServiceBase):
    @rpc(Float, Integer, Float, Float, _returns=Float)
    def calc_time(ctx, charge, nb_charge, distance, moy_vitesse):
        tps_recharge = charge * nb_charge
        tps_conduite = distance / moy_vitesse
        return tps_recharge + tps_conduite

    @rpc(Float, Float, Float, _returns=Float)
    def calc_cout(ctx, conso, autonomie, prix_kwh):
        nb_kwh = (conso * autonomie) / 100
        return prix_kwh * nb_kwh

application = Application(
    [soap_info],
    'spyne.examples.hello.soap',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11()
)
wsgi_application = WsgiApplication(application)

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    server = make_server('127.0.0.1', 8000, wsgi_application)
    print("Server is running on http://127.0.0.1:8000")
    server.serve_forever()
