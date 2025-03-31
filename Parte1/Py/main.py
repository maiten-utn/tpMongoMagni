import requests
from db import connect_to_db

url = 'https://restcountries.com/v3.1/alpha/'

def getCountryData(code):
    try:
        response = requests.get(url + code)

        if response.status_code != 200:
            raise requests.HTTPError(f"Error: {response.status_code}")

        data = response.json()
        countryData = data[0]  # Accede al primer elemento del listado

        return {
            'codigoPais': countryData.get('ccn3', 0),
            'nombrePais': countryData.get('name', {}).get('common', 'Desconocido'),
            'capitalPais': countryData.get('capital', ['No disponible'])[0],
            'region': countryData.get('region', 'Desconocida'),
            'subregion': countryData.get('subregion', 'Desconocida'),
            'poblacion': countryData.get('population', 0),
            'latitud': countryData.get('latlng', [None])[0],
            'longitud': countryData.get('latlng', [None])[1],
        }
    except requests.exceptions.RequestException as error:
        print(f'⚠️ No se encontraron datos para el código: {code}')
        return None

def saveCountry(code, connection):
    countryData = getCountryData(code)
    if countryData is None:
        return False
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO pais (codigoPais, nombrePais, capitalPais, region, subregion, poblacion, latitud, longitud) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        
        valores = (countryData['codigoPais'],
                   countryData['nombrePais'],
                   countryData['capitalPais'],
                   countryData['region'],
                   countryData['subregion'],
                   countryData['poblacion'],
                   countryData['latitud'],
                   countryData['longitud'])

        cursor.execute(sql, valores)
        connection.commit()

        print(f"✅ País {code} insertado correctamente")
        return True
    except RuntimeError as error:
        print(f'⚠️ Error al conectar a la base de datos o al insertar: {error}')
        return False

def saveAllCountries():
    connection = connect_to_db()  

    for code in range(0, 999):
        code = f"{code:03d}"  
        result = saveCountry(code, connection)
        if result == False:
            continue
        print(f'País {code} guardado correctamente')
    
    connection.close() 

saveAllCountries()
