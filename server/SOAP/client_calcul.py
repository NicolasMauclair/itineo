from zeep import Client

# Charger le fichier WSDL
client = Client('http://localhost:8000/?wsdl')

# Appeler la méthode calc_time
response_time = client.service.calc_time(2.0, 5, 300.0, 100.0)
print(f"Temps calculé : {response_time} heures")

# Appeler la méthode calc_cout
response_cout = client.service.calc_cout(15.0, 400.0, 0.2)
print(f"Coût calculé : {response_cout} euros")

