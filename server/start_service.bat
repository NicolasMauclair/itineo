@echo off
call server\env\Scripts\activate
python server\SOAP\service.py
pause
