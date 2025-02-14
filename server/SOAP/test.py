import requests

url = "http://localhost:8000"
headers = {"Content-Type": "text/xml; charset=utf-8"}
soap_request = """<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="spyne.vehicule.service">
   <soapenv:Header/>
   <soapenv:Body>
      <web:calculer_cout>
         <distance>100</distance>
         <consommation>5</consommation>
      </web:calculer_cout>
   </soapenv:Body>
</soapenv:Envelope>"""


response = requests.post(url, data=soap_request, headers=headers)
print(response.text)
